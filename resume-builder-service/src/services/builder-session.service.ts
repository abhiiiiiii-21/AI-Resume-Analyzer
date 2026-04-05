import { BuilderSessionRepository } from '../repositories/builder-session.repository';
import { ResumeDraftRepository } from '../repositories/resume-draft.repository';
import { BuilderSession } from '../db/schema/builder-sessions';
import { EMPTY_RESUME_DATA } from '../types/resume.types';
import { AppError } from '../utils/app-error';

/**
 * BuilderSessionService
 * 
 * Manages the lifecycle of resume builder sessions.
 * A session is one "conversation" where the user builds a resume.
 * 
 * Responsibilities:
 * - Start a new session (+ create an empty draft)
 * - Get session details
 * - List user's sessions
 * - Update session status
 */
export class BuilderSessionService {
    private sessionRepo: BuilderSessionRepository;
    private draftRepo: ResumeDraftRepository;

    constructor() {
        this.sessionRepo = new BuilderSessionRepository();
        this.draftRepo = new ResumeDraftRepository();
    }

    /**
     * Start a new resume builder session.
     * 
     * This does two things:
     * 1. Creates a session record
     * 2. Creates an empty resume draft linked to the session
     * 
     * @param userId - Internal user UUID
     * @param title - Optional session title
     * @returns The created session and draft
     */
    async startSession(userId: string, title?: string) {
        // 1. Create the session
        const session = await this.sessionRepo.create({
            userId,
            title: title || 'Untitled Resume',
            status: 'ACTIVE',
        });

        // 2. Create an empty draft for this session
        const draft = await this.draftRepo.create({
            sessionId: session.id,
            userId,
            title: title || 'Untitled Resume',
            resumeJson: EMPTY_RESUME_DATA,
            completionScore: 0,
            missingFields: [],
            status: 'DRAFT',
        });

        // 3. Link the draft to the session
        await this.sessionRepo.update(session.id, {
            currentResumeDraftId: draft.id,
        });

        return { session, draft };
    }

    /**
     * Get a session by ID with ownership check.
     * Throws 404 if session doesn't exist or doesn't belong to user.
     */
    async getSession(sessionId: string, userId: string): Promise<BuilderSession> {
        const session = await this.sessionRepo.findByIdAndUser(sessionId, userId);

        if (!session) {
            throw new AppError('Session not found', 404);
        }

        return session;
    }

    /**
     * Get all sessions for a user.
     */
    async getUserSessions(userId: string): Promise<BuilderSession[]> {
        return this.sessionRepo.findAllByUser(userId);
    }

    /**
     * Mark a session as completed (e.g., after finalization).
     */
    async completeSession(sessionId: string): Promise<BuilderSession> {
        return this.sessionRepo.update(sessionId, { status: 'COMPLETED' });
    }
}
