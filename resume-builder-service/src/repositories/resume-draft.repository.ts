import { eq, and } from 'drizzle-orm';
import { db } from '../config/db';
import { resumeDrafts, ResumeDraft, NewResumeDraft } from '../db/schema/resume-drafts';

/**
 * ResumeDraftRepository
 * 
 * Handles all database operations for resume drafts.
 * A draft is the in-progress resume data being built during a chat session.
 */
export class ResumeDraftRepository {
    /**
     * Create a new empty resume draft.
     * Called when a new builder session starts.
     */
    async create(data: NewResumeDraft): Promise<ResumeDraft> {
        const result = await db.insert(resumeDrafts).values(data).returning();
        return result[0];
    }

    /**
     * Find a draft by its ID.
     */
    async findById(id: string): Promise<ResumeDraft | null> {
        const result = await db
            .select()
            .from(resumeDrafts)
            .where(eq(resumeDrafts.id, id))
            .limit(1);

        return result[0] || null;
    }

    /**
     * Find a draft by ID, but only if it belongs to the given user.
     */
    async findByIdAndUser(id: string, userId: string): Promise<ResumeDraft | null> {
        const result = await db
            .select()
            .from(resumeDrafts)
            .where(and(eq(resumeDrafts.id, id), eq(resumeDrafts.userId, userId)))
            .limit(1);

        return result[0] || null;
    }

    /**
     * Find the draft associated with a specific session.
     */
    async findBySessionId(sessionId: string): Promise<ResumeDraft | null> {
        const result = await db
            .select()
            .from(resumeDrafts)
            .where(eq(resumeDrafts.sessionId, sessionId))
            .limit(1);

        return result[0] || null;
    }

    /**
     * Update a draft's data (resume JSON, score, missing fields, etc.).
     * This is called after every AI response to save updated resume data.
     */
    async update(id: string, data: Partial<NewResumeDraft>): Promise<ResumeDraft> {
        const result = await db
            .update(resumeDrafts)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(resumeDrafts.id, id))
            .returning();

        return result[0];
    }
}
