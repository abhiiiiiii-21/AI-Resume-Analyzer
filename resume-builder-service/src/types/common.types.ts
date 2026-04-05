/**
 * Common Types — Shared enums and types used across the application.
 * 
 * These mirror the database enums but exist as TypeScript types
 * so we can use them in service logic without importing from schema.
 */

/** Status of a builder session */
export enum SessionStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    ABANDONED = 'ABANDONED',
}

/** Status of a resume draft */
export enum DraftStatus {
    DRAFT = 'DRAFT',
    FINALIZED = 'FINALIZED',
}

/** Role of a chat message sender */
export enum MessageRole {
    USER = 'USER',
    ASSISTANT = 'ASSISTANT',
    SYSTEM = 'SYSTEM',
}

/**
 * Extend Express Request to include our custom properties.
 * 
 * The userContextMiddleware attaches these to every request.
 * This declaration tells TypeScript about them so we don't
 * need type casts everywhere.
 */
declare global {
    namespace Express {
        interface Request {
            /** External user ID from x-user-id header */
            externalUserId?: string;
            /** Internal user ID (resolved by UserContextService) */
            userId?: string;
        }
    }
}
