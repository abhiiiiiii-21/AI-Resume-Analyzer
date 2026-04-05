import { z } from 'zod';

/**
 * Resume Validators — Zod schemas for resume-related API endpoints.
 * 
 * These schemas validate request bodies for resume CRUD operations
 * and finalization.
 */

/**
 * Validates the body of PATCH /builder/drafts/:draftId/section/:sectionName
 * The data field contains the section-specific payload (flexible shape).
 */
export const updateSectionSchema = z.object({
    data: z.record(z.any()).or(z.array(z.any())),
});

/**
 * Validates the body of POST /builder/drafts/:draftId/finalize
 * Title is required for the final resume. Template key is optional.
 */
export const finalizeResumeSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(500, 'Title must be 500 characters or less'),
    templateKey: z
        .string()
        .max(100)
        .default('modern-ats'),
});

/** Inferred TypeScript types from schemas */
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
export type FinalizeResumeInput = z.infer<typeof finalizeResumeSchema>;
