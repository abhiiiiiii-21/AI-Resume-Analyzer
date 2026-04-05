import { Request, Response } from 'express';
import { UserContextService } from '../services/user-context.service';
import { BuilderSessionService } from '../services/builder-session.service';
import { ChatService } from '../services/chat.service';
import { ResumeDraftService } from '../services/resume-draft.service';
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

    constructor() {
        this.userContextService = new UserContextService();
        this.sessionService = new BuilderSessionService();
        this.chatService = new ChatService();
        this.draftService = new ResumeDraftService();
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
     * Send a chat message to the AI for resume building.
     * This is a SKELETON — full AI integration will be added in Phase 5.
     * For now, it saves the message and returns a placeholder response.
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

        // 4. Save the user's message
        await this.chatService.saveUserMessage(session.id, req.body.message);

        // ──────────────────────────────────────────────
        // PHASE 5 WILL REPLACE THIS BLOCK:
        // - Call Gemini AI with context
        // - Parse structured response
        // - Merge into draft
        // - Save assistant message
        // ──────────────────────────────────────────────
        const placeholderResponse = {
            assistantMessage: '[AI integration pending — Phase 5] Your message was received and saved.',
            resumeData: draft.resumeJson as ResumeData,
            missingFields: draft.missingFields as string[],
            completionScore: draft.completionScore,
            needsMoreInfo: true,
            nextQuestion: 'AI integration will be added in Phase 5.',
        };

        // Save placeholder assistant message
        await this.chatService.saveAssistantMessage(
            session.id,
            placeholderResponse.assistantMessage
        );

        // 5. Return response
        ApiResponse.success(res, placeholderResponse);
    });
}
