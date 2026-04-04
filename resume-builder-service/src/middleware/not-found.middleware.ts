import { Request, Response } from 'express';

/**
 * Not Found Middleware
 * 
 * Catches any request that doesn't match a registered route.
 * Returns a clear 404 JSON response instead of Express's default HTML.
 * 
 * Must be registered AFTER all routes but BEFORE the error middleware.
 */
export const notFoundMiddleware = (_req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${_req.method} ${_req.originalUrl}`,
        errors: [],
    });
};
