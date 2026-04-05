import { Router } from 'express';
import builderRoutes from './builder.routes';
import resumeRoutes from './resume.routes';

/**
 * Main Route Aggregator
 * 
 * All feature-level route files are combined here into a single router.
 * This router is mounted at /api/v1 in app.ts.
 */
const router = Router();

/**
 * Health check endpoint.
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
router.use('/resumes', resumeRoutes);

export default router;
