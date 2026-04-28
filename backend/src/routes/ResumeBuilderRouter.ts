import { Router } from "express";
import { ResumeBuilderController } from "../controllers/ResumeBuilderController";
import { clerkAuth } from "../middlewares/clerkAuth";

const router = Router();
const controller = new ResumeBuilderController();

/**
 * POST /api/resume-builder/save
 * Creates or updates a resume draft
 */
router.post("/save", clerkAuth, controller.saveDraft);

/**
 * GET /api/resume-builder/list
 * Returns all drafts for the user
 */
router.get("/list", clerkAuth, controller.getDrafts);
router.get("/:id", clerkAuth, controller.getDraftById);

/**
 * DELETE /api/resume-builder/:id
 * Deletes a draft
 */
router.delete("/:id", clerkAuth, controller.deleteDraft);

export default router;
