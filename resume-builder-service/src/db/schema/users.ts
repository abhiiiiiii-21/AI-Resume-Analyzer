import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

/**
 * Users Table Schema
 * 
 * Lightweight user table that maps external user identities (from x-user-id header)
 * to internal user records. This is a placeholder — when real auth is added later,
 * this table can be extended with email, name, etc.
 * 
 * Why a separate table instead of just using x-user-id everywhere?
 * - Foreign keys need an internal ID to reference
 * - Easier to extend later with profile data
 * - Clean separation between external identity and internal records
 */
export const users = pgTable('users', {
    /** Internal unique user ID (auto-generated UUID) */
    id: uuid('id').defaultRandom().primaryKey(),

    /** External user ID — this comes from the x-user-id header */
    externalUserId: varchar('external_user_id', { length: 255 }).notNull().unique(),

    /** When this user record was first created */
    createdAt: timestamp('created_at').defaultNow().notNull(),

    /** When this user record was last updated */
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/** TypeScript type for a user row (inferred from schema) */
export type User = typeof users.$inferSelect;

/** TypeScript type for inserting a new user */
export type NewUser = typeof users.$inferInsert;
