import { z } from 'zod';

/**
 * Builder Validators — Zod schemas for builder-related API endpoints.
 * 
 * These schemas validate request bodies before they reach the controller.
 * Used by the validate() middleware in route definitions.
 */

/**
 * Validates the body of POST /builder/session/start
 * Title is optional — if not provided, a default will be used.
 */
export const startSessionSchema = z.object({
    title: z
        .string()
        .max(500, 'Title must be 500 characters or less')
        .optional(),
});

/**
 * Validates the body of POST /builder/session/:sessionId/message
 * Message is required and must not be empty.
 */
export const sendMessageSchema = z.object({
    message: z
        .string()
        .min(1, 'Message cannot be empty')
        .max(5000, 'Message must be 5000 characters or less'),
});

/** Inferred TypeScript types from schemas — use these in controllers */
export type StartSessionInput = z.infer<typeof startSessionSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
