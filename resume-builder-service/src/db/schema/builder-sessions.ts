import { pgTable, uuid, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';

/**
 * Session Status Enum
 * 
 * ACTIVE    — user is currently building their resume in this session
 * COMPLETED — user finalized a resume from this session
 * ABANDONED — user left without finalizing (can be set by cleanup logic later)
 */
export const sessionStatusEnum = pgEnum('session_status', [
    'ACTIVE',
    'COMPLETED',
    'ABANDONED',
]);

/**
 * Builder Sessions Table Schema
 * 
 * A session represents one resume-building conversation.
 * Each session belongs to a user and may produce one resume draft.
 * 
 * Why sessions?
 * - Users can have multiple resume-building attempts
 * - Each attempt has its own chat history
 * - Keeps conversations isolated from each other
 */
export const builderSessions = pgTable('builder_sessions', {
    /** Unique session ID */
    id: uuid('id').defaultRandom().primaryKey(),

    /** The user who owns this session */
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),

    /** Current status of this session */
    status: sessionStatusEnum('status').notNull().default('ACTIVE'),

    /** Optional label for the session (e.g., "Backend Engineer Resume") */
    title: varchar('title', { length: 500 }),

    /** Reference to the current resume draft being built in this session */
    currentResumeDraftId: uuid('current_resume_draft_id'),

    /** When this session was created */
    createdAt: timestamp('created_at').defaultNow().notNull(),

    /** When this session was last updated */
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/** TypeScript type for a session row */
export type BuilderSession = typeof builderSessions.$inferSelect;

/** TypeScript type for inserting a new session */
export type NewBuilderSession = typeof builderSessions.$inferInsert;
