import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { users, User, NewUser } from '../db/schema/users';

/**
 * UserRepository
 * 
 * Handles all database operations for the users table.
 * 
 * This is a simple repository because users are lightweight in this project —
 * they're just a mapping from external user IDs to internal UUIDs.
 * When real auth is added later, this repository will grow.
 */
export class UserRepository {
    /**
     * Find a user by their external user ID (from x-user-id header).
     * Returns null if no user exists with that external ID.
     */
    async findByExternalId(externalUserId: string): Promise<User | null> {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.externalUserId, externalUserId))
            .limit(1);

        return result[0] || null;
    }

    /**
     * Find a user by their internal UUID.
     */
    async findById(id: string): Promise<User | null> {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        return result[0] || null;
    }

    /**
     * Create a new user record.
     * Called when we encounter a new external user ID for the first time.
     */
    async create(data: NewUser): Promise<User> {
        const result = await db.insert(users).values(data).returning();
        return result[0];
    }

    /**
     * Find user by external ID, or create one if it doesn't exist.
     * This is the main method used by UserContextService.
     */
    async findOrCreate(externalUserId: string): Promise<User> {
        const existing = await this.findByExternalId(externalUserId);
        if (existing) return existing;

        return this.create({ externalUserId });
    }
}
