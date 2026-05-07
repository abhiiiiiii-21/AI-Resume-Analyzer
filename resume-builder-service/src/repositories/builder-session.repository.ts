import { eq, and, desc } from 'drizzle-orm';
import { db } from '../config/db';
import { builderSessions, BuilderSession, NewBuilderSession } from '../db/schema/builder-sessions';

/**
 * BuilderSessionRepository
 * 
 * Handles all database operations for builder sessions.
 * A session is one resume-building conversation — users can have many sessions.
 */
export class BuilderSessionRepository {
    /**
     * Create a new builder session.
     */
    async create(data: NewBuilderSession): Promise<BuilderSession> {
        const result = await db.insert(builderSessions).values(data).returning();
        return result[0];
    }

    /**
     * Find a session by its ID.
     */
    async findById(id: string): Promise<BuilderSession | null> {
        const result = await db
            .select()
            .from(builderSessions)
            .where(eq(builderSessions.id, id))
            .limit(1);

        return result[0] || null;
    }

    /**
     * Find a session by ID, but only if it belongs to the given user.
     * Prevents users from accessing each other's sessions.
     */
    async findByIdAndUser(id: string, userId: string): Promise<BuilderSession | null> {
        const result = await db
            .select()
            .from(builderSessions)
            .where(and(eq(builderSessions.id, id), eq(builderSessions.userId, userId)))
            .limit(1);

        return result[0] || null;
    }

    /**
     * Get all sessions for a user, newest first.
     */
    async findAllByUser(userId: string): Promise<BuilderSession[]> {
        return db
            .select()
            .from(builderSessions)
            .where(eq(builderSessions.userId, userId))
            .orderBy(desc(builderSessions.createdAt));
    }

    /**
     * Update a session's fields (e.g., status, title, currentResumeDraftId).
     */
    async update(id: string, data: Partial<NewBuilderSession>): Promise<BuilderSession> {
        const result = await db
            .update(builderSessions)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(builderSessions.id, id))
            .returning();

        return result[0];
    }

    /**
     * Delete a session by ID.
     */
    async delete(id: string): Promise<void> {
        await db.delete(builderSessions).where(eq(builderSessions.id, id));
    }
}
