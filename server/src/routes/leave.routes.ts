import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";
import {
  applyLeave,
  getUserLeaves,
  getAllLeaveRequests,
  updateLeaveStatus,
  getLeaveTypes,
  addLeaveType,
  deleteLeaveType,
} from "../controllers/leave.controller";

const router = Router();

/**
 * Member applies for leave
 * POST /leave
 */
router.post(
  "/",
  requireAuth,
  requireRole(["member", "manager", "admin"]),
  applyLeave
);

/**
 * Member fetches own leave history
 * GET /leave/my
 */
router.get(
  "/my",
  requireAuth,
  requireRole(["member", "manager", "admin"]),
  getUserLeaves
);

/**
 * Manager/Admin fetch all leave requests
 * GET /leave/all
 */
router.get(
  "/all",
  requireAuth,
  requireRole(["manager", "admin"]),
  getAllLeaveRequests
);

/**
 * Update leave status
 * PATCH /leave/:id/status
 * - manager/admin: approve/reject
 * - member (owner): cancel
 */
router.patch(
  "/:id/status",
  requireAuth,
  requireRole(["member", "manager", "admin"]),
  updateLeaveStatus
);

/**
 * 🔽 Leave Types Management
 */

/**
 * Fetch leave types (all roles can read, used in dropdown)
 * GET /leave/types
 */
router.get(
  "/types",
  requireAuth,
  requireRole(["member", "manager", "admin"]),
  getLeaveTypes
);

/**
 * Add new leave type (admin only)
 * POST /leave/types
 */
router.post(
  "/types",
  requireAuth,
  requireRole(["admin"]),
  addLeaveType
);

/**
 * Delete leave type (admin only)
 * DELETE /leave/types/:id
 */
router.delete(
  "/types/:id",
  requireAuth,
  requireRole(["admin"]),
  deleteLeaveType
);

export default router;
