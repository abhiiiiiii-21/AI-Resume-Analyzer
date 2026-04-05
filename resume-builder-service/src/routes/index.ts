import { Router } from 'express';
import builderRoutes from './builder.routes';

/**
 * Main Route Aggregator
 * 
 * All feature-level route files are combined here into a single router.
 * This router is mounted at /api/v1 in app.ts.
 * 
 * As we add feature routes (builder, resume), they'll be registered here.
 */
const router = Router();

/**
 * Health check endpoint.
 * Quick way to verify the service is running.
 * 
 * GET /api/v1/health
 */
router.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Resume Builder Service is running',
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
        },
    });
});

// Feature routes
router.use('/builder', builderRoutes);
// router.use('/resumes', resumeRoutes); // Phase 6

export default router;

