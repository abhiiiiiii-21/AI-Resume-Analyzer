import { Router } from 'express';
import { BuilderController } from '../controllers/builder.controller';
import { userContextMiddleware } from '../middleware/user-context.middleware';
import { validate } from '../middleware/validate.middleware';
import { startSessionSchema, sendMessageSchema } from '../validators/builder.validators';

/**
 * Builder Routes
 * 
 * Registers all routes for the resume builder flow.
 * All routes require x-user-id header (enforced by userContextMiddleware).
 * 
 * Routes:
 *   POST /session/start           → Start a new session
 *   GET  /session/:sessionId      → Get session details
 *   POST /session/:sessionId/message → Send a chat message
 */
const router = Router();
const controller = new BuilderController();

// All builder routes require user context (x-user-id header)
router.use(userContextMiddleware);

// Start a new builder session
router.post('/session/start', validate(startSessionSchema), controller.startSession);

// Get session details with draft and chat history
router.get('/session/:sessionId', controller.getSession);

// Send a message to the AI assistant
router.post(
    '/session/:sessionId/message',
    validate(sendMessageSchema),
    controller.sendMessage
);

export default router;
