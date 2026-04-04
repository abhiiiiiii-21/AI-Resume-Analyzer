import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Validate Middleware Factory
 * 
 * Creates a middleware that validates the request body against
 * a Zod schema. If validation fails, returns a 400 response
 * with detailed error messages.
 * 
 * Usage:
 *   router.post('/example', validate(myZodSchema), controller.handler);
 * 
 * @param schema - A Zod schema to validate req.body against
 */
export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            // Extract readable error messages from Zod
            const errors = result.error.errors.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors,
            });
            return;
        }

        // Replace req.body with the parsed (and potentially transformed) data
        req.body = result.data;
        next();
    };
};
