import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { clerkAuth } from "../middlewares/clerkAuth";

const router = Router();
const controller = new DashboardController();

/**
 * GET /api/dashboard/stats
 * Returns aggregate stats for the user
 */
router.get("/stats", clerkAuth, controller.getStats);

/**
 * GET /api/dashboard/drafts
 * Returns recent resume drafts
 */
router.get("/drafts", clerkAuth, controller.getDrafts);

/**
 * GET /api/dashboard/ats-record
 * Returns ATS scan history
 */
router.get("/ats-record", clerkAuth, controller.getATSRecords);

/**
 * POST /api/dashboard/ats-record
 * Persists a new ATS scan result
 */
router.post("/ats-record", clerkAuth, controller.saveATSRecord);

export default router;
