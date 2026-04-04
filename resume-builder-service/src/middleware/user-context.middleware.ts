import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';

/**
 * User Context Middleware
 * 
 * Extracts the user identity from the `x-user-id` request header.
 * 
 * Why this exists:
 * - Authentication is NOT implemented in this project yet.
 * - Instead, the frontend passes user identity via x-user-id header.
 * - This middleware reads that header and attaches it to the request.
 * - Later, when JWT auth is added, this middleware can be replaced
 *   with a proper auth middleware that extracts userId from the token.
 * 
 * If x-user-id is missing, the request is rejected with 401.
 */
export const userContextMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    const userId = req.headers['x-user-id'] as string | undefined;

    if (!userId || userId.trim() === '') {
        throw new AppError('Missing x-user-id header. User identity is required.', 401);
    }

    // Attach to request object so controllers/services can access it.
    // We extend the Express Request type in our types file.
    (req as any).externalUserId = userId.trim();

    next();
};
