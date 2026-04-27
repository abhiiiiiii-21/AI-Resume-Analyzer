import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { clerkAuth } from "../middlewares/clerkAuth";

const router = Router();
const controller = new UserController();

/**
 * POST /api/user/sync
 * No auth needed — called right after login before session is established.
 * Body: { id: string, email: string }
 */
router.post("/sync", controller.sync);

/**
 * GET /api/user/me
 * Auth required — returns the current user's profile from our DB.
 */
router.get("/me", clerkAuth, controller.getMe);

export default router;