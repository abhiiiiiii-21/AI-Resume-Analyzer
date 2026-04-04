/**
 * AppError — Custom error class for the application.
 * 
 * Extends the built-in Error class to include:
 * - HTTP status code (e.g. 400, 404, 500)
 * - Whether the error is "operational" (expected) vs a bug
 * 
 * Use this to throw meaningful errors from services/controllers.
 * The global error middleware will catch these and format the response.
 * 
 * Example:
 *   throw new AppError('Session not found', 404);
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        // Maintains proper stack trace in V8 engines
        Error.captureStackTrace(this, this.constructor);
    }
}
