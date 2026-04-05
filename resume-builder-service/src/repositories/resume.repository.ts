import { eq, and, desc } from 'drizzle-orm';
import { db } from '../config/db';
import { resumes, Resume, NewResume } from '../db/schema/resumes';

/**
 * ResumeRepository
 * 
 * Handles all database operations for finalized resumes.
 * Finalized resumes are the "done" product that users can download as PDF.
 */
export class ResumeRepository {
    /**
     * Create a new finalized resume.
     * Called when user decides their draft is ready.
     */
    async create(data: NewResume): Promise<Resume> {
        const result = await db.insert(resumes).values(data).returning();
        return result[0];
    }

    /**
     * Find a resume by its ID.
     */
    async findById(id: string): Promise<Resume | null> {
        const result = await db
            .select()
            .from(resumes)
            .where(eq(resumes.id, id))
            .limit(1);

        return result[0] || null;
    }

    /**
     * Find a resume by ID, but only if it belongs to the given user.
     */
    async findByIdAndUser(id: string, userId: string): Promise<Resume | null> {
        const result = await db
            .select()
            .from(resumes)
            .where(and(eq(resumes.id, id), eq(resumes.userId, userId)))
            .limit(1);

        return result[0] || null;
    }

    /**
     * Get all finalized resumes for a user, newest first.
     */
    async findAllByUser(userId: string): Promise<Resume[]> {
        return db
            .select()
            .from(resumes)
            .where(eq(resumes.userId, userId))
            .orderBy(desc(resumes.createdAt));
    }

    /**
     * Update a resume (e.g., set pdfUrl after PDF generation).
     */
    async update(id: string, data: Partial<NewResume>): Promise<Resume> {
        const result = await db
            .update(resumes)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(resumes.id, id))
            .returning();

        return result[0];
    }

    /**
     * Delete a resume by ID.
     */
    async delete(id: string): Promise<void> {
        await db.delete(resumes).where(eq(resumes.id, id));
    }
}
