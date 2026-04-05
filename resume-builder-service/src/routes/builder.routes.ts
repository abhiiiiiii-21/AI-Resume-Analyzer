import { Router } from 'express';
import { BuilderController } from '../controllers/builder.controller';
import { ResumeController } from '../controllers/resume.controller';
import { userContextMiddleware } from '../middleware/user-context.middleware';
import { validate } from '../middleware/validate.middleware';
import { startSessionSchema, sendMessageSchema } from '../validators/builder.validators';
import { updateSectionSchema, finalizeResumeSchema } from '../validators/resume.validators';

/**
 * Builder Routes
 * 
 * Registers all routes for the resume builder flow.
 * All routes require x-user-id header (enforced by userContextMiddleware).
 * 
 * Routes:
 *   POST  /session/start                        → Start a new session
 *   GET   /session/:sessionId                   → Get session details
 *   POST  /session/:sessionId/message           → Send a chat message
 *   PATCH /drafts/:draftId/section/:sectionName → Manual section update
 *   POST  /drafts/:draftId/finalize             → Finalize a draft
 */
const router = Router();
const builderController = new BuilderController();
const resumeController = new ResumeController();

// All builder routes require user context (x-user-id header)
router.use(userContextMiddleware);

// --- Session routes ---
router.post('/session/start', validate(startSessionSchema), builderController.startSession);
router.get('/session/:sessionId', builderController.getSession);
router.post(
    '/session/:sessionId/message',
    validate(sendMessageSchema),
    builderController.sendMessage
);

// --- Draft routes (section update + finalize) ---
router.patch(
    '/drafts/:draftId/section/:sectionName',
    validate(updateSectionSchema),
    resumeController.updateSection
);
router.post(
    '/drafts/:draftId/finalize',
    validate(finalizeResumeSchema),
    resumeController.finalize
);

export default router;
