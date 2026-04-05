import { Router } from 'express';
import { ResumeController } from '../controllers/resume.controller';
import { userContextMiddleware } from '../middleware/user-context.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateSectionSchema, finalizeResumeSchema } from '../validators/resume.validators';

/**
 * Resume Routes
 * 
 * Registers all routes for resume management.
 * All routes require x-user-id header.
 * 
 * Routes:
 *   PATCH /drafts/:draftId/section/:sectionName → Manual section update
 *   POST  /drafts/:draftId/finalize             → Finalize a draft
 *   GET   /                                     → List all resumes
 *   GET   /:resumeId                            → Get single resume
 *   DELETE /:resumeId                           → Delete resume
 *   POST  /:resumeId/export-pdf                 → Generate PDF
 */
const router = Router();
const controller = new ResumeController();

// All resume routes require user context
router.use(userContextMiddleware);

// --- Draft operations (under /builder/drafts prefix in main router) ---
// These are mounted at /api/v1/builder in the main router

// --- Resume CRUD operations ---
// List all user resumes
router.get('/', controller.getAllResumes);

// Get a single resume
router.get('/:resumeId', controller.getResumeById);

// Delete a resume
router.delete('/:resumeId', controller.deleteResume);

// Export resume as PDF
router.post('/:resumeId/export-pdf', controller.exportPdf);

export default router;
