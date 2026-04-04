import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';

/**
 * Global Error Middleware
 * 
 * This is the centralized error handler for the entire application.
 * It catches all errors thrown or passed via next(err) from any route.
 * 
 * Responsibilities:
 * - Detect if error is an expected AppError or an unknown bug
 * - Log the error for debugging
 * - Return a consistent JSON error response to the client
 * 
 * Must be registered LAST in the Express middleware chain (after all routes).
 */
export const errorMiddleware = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // If it's our custom AppError, use its status code
    if (err instanceof AppError) {
        console.error(`[AppError] ${err.statusCode} - ${err.message}`);
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: [],
        });
        return;
    }

    // For unknown/unexpected errors, log the full stack and return 500
    console.error('[UnhandledError]', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        errors: [],
    });
};
