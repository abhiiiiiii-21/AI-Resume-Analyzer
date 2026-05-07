import { Request, Response } from 'express';
import { UserContextService } from '../services/user-context.service';
import { BuilderSessionService } from '../services/builder-session.service';
import { ChatService } from '../services/chat.service';
import { ResumeDraftService } from '../services/resume-draft.service';
import { ResumeAIService } from '../services/resume-ai.service';
import { AVAILABLE_MODELS } from '../providers/groq.provider';
import { ApiResponse } from '../utils/api-response';
import { asyncHandler } from '../utils/async-handler';
import { ResumeData } from '../types/resume.types';

/**
 * BuilderController
 * 
 * Handles HTTP requests for the resume builder flow:
 * - Start a new session
 * - Get session details
 * - Send a chat message (skeleton — AI integration in Phase 5)
 * 
 * Controllers are THIN — they only:
 * 1. Extract data from the request
 * 2. Call the appropriate service(s)
 * 3. Format and send the response
 * 
 * No business logic lives here.
 */
export class BuilderController {
    private userContextService: UserContextService;
    private sessionService: BuilderSessionService;
    private chatService: ChatService;
    private draftService: ResumeDraftService;
    private aiService: ResumeAIService;

    constructor() {
        this.userContextService = new UserContextService();
        this.sessionService = new BuilderSessionService();
        this.chatService = new ChatService();
        this.draftService = new ResumeDraftService();
        this.aiService = new ResumeAIService();
    }

    /**
     * POST /api/v1/builder/session/start
     * 
     * Starts a new resume builder session.
     * Creates a session + empty draft, returns both IDs.
     */
    startSession = asyncHandler(async (req: Request, res: Response) => {
        // 1. Resolve user identity from x-user-id header
        const user = await this.userContextService.resolveUser(req.externalUserId!);

        // 2. Create session + draft
        const { session, draft } = await this.sessionService.startSession(
            user.id,
            req.body.title
        );

        // 3. Return response
        ApiResponse.created(res, {
            sessionId: session.id,
            draftId: draft.id,
            status: session.status,
            message: 'Resume builder session started. Send your first message to begin!',
        });
    });

    /**
     * GET /api/v1/builder/session/list
     * 
     * Lists all sessions for the current user.
     */
    listSessions = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.userContextService.resolveUser(req.externalUserId!);
        const sessions = await this.sessionService.getUserSessions(user.id);

        ApiResponse.success(res, {
            sessions: sessions.map((s) => ({
                id: s.id,
                title: s.title,
                status: s.status,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
            })),
        });
    });

    /**
     * GET /api/v1/builder/session/:sessionId
     * 
     * Gets session details including draft summary and recent messages.
     */
    getSession = asyncHandler(async (req: Request, res: Response) => {
        // 1. Resolve user
        const user = await this.userContextService.resolveUser(req.externalUserId!);

        // 2. Get session (throws 404 if not found/not owned)
        const session = await this.sessionService.getSession(req.params.sessionId as string, user.id);

        // 3. Get the draft for this session
        const draft = await this.draftService.getDraftBySession(session.id);

        // 4. Get recent chat messages
        const recentMessages = await this.chatService.getRecentMessages(session.id, 50);

        // 5. Return response
        ApiResponse.success(res, {
            session: {
                id: session.id,
                status: session.status,
                title: session.title,
                createdAt: session.createdAt,
                updatedAt: session.updatedAt,
            },
            draft: draft
                ? {
                    id: draft.id,
                    resumeJson: draft.resumeJson as ResumeData,
                    completionScore: draft.completionScore,
                    missingFields: draft.missingFields,
                    status: draft.status,
                }
                : null,
            recentMessages: recentMessages.map((msg) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                createdAt: msg.createdAt,
            })),
        });
    });

    /**
     * POST /api/v1/builder/session/:sessionId/message
     * 
     * The MAIN endpoint — send a chat message to the AI for resume building.
     * 
     * Flow:
     * 1. Validate user + session
     * 2. Save user message to chat history
     * 3. Load current context (draft + chat history)
     * 4. Call AI service (Gemini)
     * 5. Save updated draft to database
     * 6. Save assistant message to chat history
     * 7. Return structured response to frontend
     */
    sendMessage = asyncHandler(async (req: Request, res: Response) => {
        // 1. Resolve user
        const user = await this.userContextService.resolveUser(req.externalUserId!);

        // 2. Verify session ownership
        const session = await this.sessionService.getSession(req.params.sessionId as string, user.id);

        // 3. Get the current draft
        const draft = await this.draftService.getDraftBySession(session.id);
        if (!draft) {
            return ApiResponse.error(res, 'No draft found for this session', 404);
        }

        // 4. Save the user's message to chat history
        await this.chatService.saveUserMessage(session.id, req.body.message);

        // 5. Load recent chat history for AI context
        const chatHistory = await this.chatService.getRecentMessages(session.id, 20);

        // 6. Call the AI service — this is where the magic happens
        const aiResult = await this.aiService.processMessage(
            req.body.message,
            draft.resumeJson as ResumeData,
            chatHistory,
            draft.missingFields as string[],
            req.body.model  // optional model override from frontend
        );

        // 7. Save the updated draft to the database
        await this.draftService.updateDraftFromAI(
            draft.id,
            aiResult.resumeData,
            aiResult.completionScore,
            aiResult.missingFields
        );

        // 8. Save the assistant's response to chat history
        await this.chatService.saveAssistantMessage(
            session.id,
            aiResult.assistantMessage,
            {
                completionScore: aiResult.completionScore,
                missingFields: aiResult.missingFields,
                needsMoreInfo: aiResult.needsMoreInfo,
            }
        );

        // 9. Return the structured response to the frontend
        ApiResponse.success(res, {
            assistantMessage: aiResult.assistantMessage,
            resumeData: aiResult.resumeData,
            missingFields: aiResult.missingFields,
            completionScore: aiResult.completionScore,
            needsMoreInfo: aiResult.needsMoreInfo,
            nextQuestion: aiResult.nextQuestion,
            usedModel: aiResult.usedModel,
        });
    });

    /**
     * PATCH /api/v1/builder/session/:sessionId/rename
     */
    renameSession = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.userContextService.resolveUser(req.externalUserId!);
        const session = await this.sessionService.renameSession(
            req.params.sessionId as string,
            user.id,
            req.body.title
        );

        ApiResponse.success(res, {
            id: session.id,
            title: session.title,
            message: 'Session renamed successfully.',
        });
    });

    /**
     * DELETE /api/v1/builder/session/:sessionId
     */
    deleteSession = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.userContextService.resolveUser(req.externalUserId!);
        await this.sessionService.deleteSession(req.params.sessionId as string, user.id);

        ApiResponse.success(res, {
            message: 'Session deleted successfully.',
        });
    });

    /**
     * GET /api/v1/builder/models
     * Returns the list of available AI models.
     */
    listModels = asyncHandler(async (_req: Request, res: Response) => {
        ApiResponse.success(res, { models: AVAILABLE_MODELS });
    });
}
