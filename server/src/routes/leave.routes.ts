import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";
import {
  applyLeave,
  getUserLeaves,
  getAllLeaveRequests,
  updateLeaveStatus,
} from "../controllers/leave.controller";

const router = Router();

/**
 * Member applies for leave
 * POST /leave
 */
router.post("/", requireAuth, requireRole(["member", "manager", "admin"]), applyLeave);

/**
 * Member fetches own leave history
 * GET /leave/my
 */
router.get("/my", requireAuth, requireRole(["member", "manager", "admin"]), getUserLeaves);

/**
 * Manager/Admin fetch all leave requests
 * GET /leave/all
 */
router.get("/all", requireAuth, requireRole(["manager", "admin"]), getAllLeaveRequests);

/**
 * Manager/Admin approve/reject
 * PATCH /leave/:id/status
 */
router.patch("/:id/status", requireAuth, requireRole(["manager", "admin"]), updateLeaveStatus);

export default router;
