import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { resumeAssets, ResumeAsset, NewResumeAsset } from '../db/schema/resume-assets';

/**
 * ResumeAssetRepository
 * 
 * Handles database operations for resume assets (generated PDF files).
 * Each finalized resume can have one or more PDF versions.
 */
export class ResumeAssetRepository {
    /**
     * Save a new asset record (e.g., after generating a PDF).
     */
    async create(data: NewResumeAsset): Promise<ResumeAsset> {
        const result = await db.insert(resumeAssets).values(data).returning();
        return result[0];
    }

    /**
     * Find all assets for a specific resume.
     */
    async findByResumeId(resumeId: string): Promise<ResumeAsset[]> {
        return db
            .select()
            .from(resumeAssets)
            .where(eq(resumeAssets.resumeId, resumeId));
    }

    /**
     * Find the latest asset for a resume (most recently generated).
     */
    async findLatestByResumeId(resumeId: string): Promise<ResumeAsset | null> {
        const result = await db
            .select()
            .from(resumeAssets)
            .where(eq(resumeAssets.resumeId, resumeId))
            .orderBy(resumeAssets.createdAt)
            .limit(1);

        return result[0] || null;
    }
}
