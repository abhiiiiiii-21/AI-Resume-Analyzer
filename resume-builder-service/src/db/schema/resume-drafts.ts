import { pgTable, uuid, varchar, timestamp, jsonb, integer, pgEnum } from 'drizzle-orm/pg-core';
import { builderSessions } from './builder-sessions';
import { users } from './users';

/**
 * Draft Status Enum
 * 
 * DRAFT     — still being built, user hasn't finalized yet
 * FINALIZED — user marked this draft as complete
 */
export const draftStatusEnum = pgEnum('draft_status', ['DRAFT', 'FINALIZED']);

/**
 * Resume Drafts Table Schema
 * 
 * Stores the in-progress resume data for a builder session.
 * As the user chats, the AI extracts and merges resume data into this draft.
 * 
 * Key fields:
 * - resumeJson: The structured ResumeData object (the core contract)
 * - completionScore: How complete the resume is (0-100)
 * - missingFields: Array of fields that still need information
 * 
 * Why JSONB for resumeJson?
 * - Resume structure is complex and nested
 * - No need to normalize every field into separate tables
 * - Easy to query and update as a whole
 * - Matches the frontend contract directly
 */
export const resumeDrafts = pgTable('resume_drafts', {
    /** Unique draft ID */
    id: uuid('id').defaultRandom().primaryKey(),

    /** The session this draft was created from */
    sessionId: uuid('session_id')
        .notNull()
        .references(() => builderSessions.id, { onDelete: 'cascade' }),

    /** The user who owns this draft */
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),

    /** Title for this draft (e.g., "Backend Engineer Resume") */
    title: varchar('title', { length: 500 }),

    /** Target job role the resume is aimed at */
    targetRole: varchar('target_role', { length: 255 }),

    /** 
     * The structured resume data as JSONB.
     * This matches the ResumeData TypeScript interface exactly.
     */
    resumeJson: jsonb('resume_json').notNull().default({}),

    /** Completion score (0-100) — how ready is this resume? */
    completionScore: integer('completion_score').notNull().default(0),

    /** 
     * List of fields that are missing or need improvement.
     * Stored as JSONB array, e.g. ["education.endDate", "projects[0].impact"]
     */
    missingFields: jsonb('missing_fields').notNull().default([]),

    /** Current status of this draft */
    status: draftStatusEnum('status').notNull().default('DRAFT'),

    /** When this draft was created */
    createdAt: timestamp('created_at').defaultNow().notNull(),

    /** When this draft was last updated */
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/** TypeScript type for a resume draft row */
export type ResumeDraft = typeof resumeDrafts.$inferSelect;

/** TypeScript type for inserting a new resume draft */
export type NewResumeDraft = typeof resumeDrafts.$inferInsert;
