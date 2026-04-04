import { Response } from 'express';

/**
 * ApiResponse — Utility class for consistent API responses.
 * 
 * Every endpoint in this service uses the same response format:
 *   { success: true/false, message: "...", data: {...}, errors: [...] }
 * 
 * This class provides static helper methods so controllers don't
 * have to manually construct response objects every time.
 */
export class ApiResponse {
    /**
     * Send a success response.
     * @param res - Express response object
     * @param data - Payload to return
     * @param message - Optional human-readable message
     * @param statusCode - HTTP status (default 200)
     */
    static success(res: Response, data: any, message: string = 'Success', statusCode: number = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }

    /**
     * Send a created response (HTTP 201).
     */
    static created(res: Response, data: any, message: string = 'Created successfully') {
        return ApiResponse.success(res, data, message, 201);
    }

    /**
     * Send an error response.
     * @param res - Express response object
     * @param message - Human-readable error message
     * @param statusCode - HTTP status (default 500)
     * @param errors - Optional array of detailed error info
     */
    static error(res: Response, message: string, statusCode: number = 500, errors: any[] = []) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
        });
    }
}
