import { pgTable, uuid, varchar, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';
import { resumeDrafts } from './resume-drafts';
import { users } from './users';

/**
 * Resumes Table Schema (Finalized)
 * 
 * Stores the final, completed resume. Created when a user "finalizes" a draft.
 * 
 * Why separate from resume_drafts?
 * - Drafts are work-in-progress, resumes are the finished product
 * - Resumes have versioning (user might finalize multiple times)
 * - Resumes have template keys (which visual template to use)
 * - Resumes have PDF URLs (generated files)
 * - Clean separation: drafts = building, resumes = done
 */
export const resumes = pgTable('resumes', {
    /** Unique resume ID */
    id: uuid('id').defaultRandom().primaryKey(),

    /** The draft this resume was finalized from */
    draftId: uuid('draft_id')
        .notNull()
        .references(() => resumeDrafts.id, { onDelete: 'cascade' }),

    /** The user who owns this resume */
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),

    /** Title for the resume */
    title: varchar('title', { length: 500 }).notNull(),

    /** Which visual template to use for PDF generation */
    templateKey: varchar('template_key', { length: 100 }).notNull().default('modern-ats'),

    /** The finalized structured resume data (JSONB) */
    resumeJson: jsonb('resume_json').notNull(),

    /** URL/path to the generated PDF file (null if not yet generated) */
    pdfUrl: varchar('pdf_url', { length: 1000 }),

    /** Version number — incremented if user re-finalizes */
    version: integer('version').notNull().default(1),

    /** When this resume was finalized */
    createdAt: timestamp('created_at').defaultNow().notNull(),

    /** When this resume was last updated */
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/** TypeScript type for a resume row */
export type Resume = typeof resumes.$inferSelect;

/** TypeScript type for inserting a new resume */
export type NewResume = typeof resumes.$inferInsert;
