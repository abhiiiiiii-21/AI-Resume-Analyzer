import { Request, Response, NextFunction } from 'express';

/**
 * asyncHandler — Wraps async route handlers to catch errors automatically.
 * 
 * Without this, every async controller method would need its own try-catch.
 * This wrapper catches any rejected promise and passes the error to
 * Express's global error middleware via next(err).
 * 
 * Usage:
 *   router.get('/example', asyncHandler(async (req, res) => { ... }));
 */
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
