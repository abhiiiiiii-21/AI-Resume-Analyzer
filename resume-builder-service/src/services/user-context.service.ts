import { UserRepository } from '../repositories/user.repository';
import { User } from '../db/schema/users';

/**
 * UserContextService
 * 
 * Resolves external user identity (from x-user-id header) to an internal
 * user record. This is the bridge between the auth layer and our database.
 * 
 * Why this service exists:
 * - The frontend sends an external user ID via x-user-id header
 * - Our database needs internal UUIDs for foreign keys
 * - This service handles the mapping (find-or-create pattern)
 * - When JWT auth is added later, only this service needs to change
 */
export class UserContextService {
    private userRepo: UserRepository;

    constructor() {
        this.userRepo = new UserRepository();
    }

    /**
     * Resolve an external user ID to an internal user record.
     * Creates the user if they don't exist yet (first-time user).
     * 
     * @param externalUserId - The value from the x-user-id header
     * @returns The internal User record with our UUID
     */
    async resolveUser(externalUserId: string): Promise<User> {
        return this.userRepo.findOrCreate(externalUserId);
    }
}
