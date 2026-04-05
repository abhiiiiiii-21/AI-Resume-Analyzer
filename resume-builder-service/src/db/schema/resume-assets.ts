import { pgTable, uuid, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { resumes } from './resumes';

/**
 * Asset Type Enum
 * 
 * Currently only PDF, but designed to support other types later
 * (e.g., DOCX, PNG preview).
 */
export const assetTypeEnum = pgEnum('asset_type', ['PDF']);

/**
 * Resume Assets Table Schema
 * 
 * Tracks generated files (PDFs) associated with a finalized resume.
 * 
 * Why a separate table?
 * - A resume might have multiple PDF versions (regenerated)
 * - Clean audit trail of generated files
 * - Easy to extend to other asset types later
 * - Keeps the resumes table clean
 */
export const resumeAssets = pgTable('resume_assets', {
    /** Unique asset ID */
    id: uuid('id').defaultRandom().primaryKey(),

    /** The resume this asset belongs to */
    resumeId: uuid('resume_id')
        .notNull()
        .references(() => resumes.id, { onDelete: 'cascade' }),

    /** Type of asset (currently only PDF) */
    assetType: assetTypeEnum('asset_type').notNull().default('PDF'),

    /** File path or storage URL for the asset */
    storagePath: varchar('storage_path', { length: 1000 }).notNull(),

    /** When this asset was created */
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

/** TypeScript type for a resume asset row */
export type ResumeAsset = typeof resumeAssets.$inferSelect;

/** TypeScript type for inserting a new resume asset */
export type NewResumeAsset = typeof resumeAssets.$inferInsert;
