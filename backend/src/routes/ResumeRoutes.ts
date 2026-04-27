import { Router } from "express";
import { ResumeController } from "../controllers/ResumeController";
import { clerkAuth } from "../middlewares/clerkAuth";
import upload from "../middlewares/uploadMiddleware";

const router = Router();
const controller = new ResumeController();

/**
 * POST /api/resume/enhance
 * Auth required — verifies Clerk token first.
 * upload.single("resume") — multer handles the file upload.
 */
router.post("/enhance", clerkAuth, upload.single("resume"), controller.enhance);

/**
 * GET /api/resume/my-resumes
 * Auth required — returns all resumes for the logged-in user.
 */
router.get("/my-resumes", clerkAuth, controller.getMyResumes);

/**
 * GET /api/resume/roles
 * No auth needed — just returns available roles for the frontend.
 */
router.get("/roles", controller.getRoles);

/**
 * GET /api/resume/:id
 * Auth required — returns a specific resume.
 */
router.get("/:id", clerkAuth, controller.getResumeById);

export default router;