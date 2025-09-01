import { Router, Request, Response } from "express";
import { requireAuth } from "../middlewares/requireAuth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";
import {
  getCalendarAuthUrl,
  handleCalendarCallback,
  isCalendarConnected,
  disconnectCalendar,
} from "../services/calendar.service";
import { deleteLeave } from "../controllers/leave.controller";

const router = Router();

/**
 * DELETE /calendar/leave/:id
 * Delete a leave (and remove from calendar if synced)
 */
router.delete("/leave/:id", requireAuth, deleteLeave);

/**
 * GET /calendar/auth-url
 * Get Google Calendar authorization URL
 */
router.get("/auth-url", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const authUrl = getCalendarAuthUrl(user.id);

    if (!authUrl) {
      return res.status(500).json({ error: "Failed to generate auth URL" });
    }

    res.json({ authUrl });
  } catch (err: any) {
    console.error("Error generating auth URL:", err.message);
    res.status(500).json({ error: "Failed to generate authorization URL" });
  }
});

/**
 * GET /calendar/callback
 * Handle OAuth callback from Google
 * 👉 Google redirects here with ?code=...&state=...
 */
router.get("/callback", async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;

    if (!code || typeof code !== "string") {
      return res.redirect(
        `${process.env.FRONTEND_URL}/dashboard?calendar=error&reason=missing_code`
      );
    }
    if (!state || typeof state !== "string") {
      return res.redirect(
        `${process.env.FRONTEND_URL}/dashboard?calendar=error&reason=missing_state`
      );
    }

    await handleCalendarCallback(code, state);

    // ✅ Redirect back to frontend with success
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?calendar=connected`);
  } catch (err: any) {
    console.error("Error handling calendar callback:", err.message);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?calendar=error`);
  }
});

/**
 * GET /calendar/status
 * Check if user's calendar is connected
 */
router.get("/status", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const isConnected = await isCalendarConnected(user.id);

    res.json({ isConnected });
  } catch (err: any) {
    console.error("Error checking calendar status:", err.message);
    res.status(500).json({ error: "Failed to check calendar status" });
  }
});

/**
 * DELETE /calendar/disconnect
 * Disconnect the logged-in user's Google Calendar
 */
router.delete(
  "/disconnect",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;

      await disconnectCalendar(user.id);

      res.json({
        success: true,
        message: "Google Calendar disconnected from your account",
      });
    } catch (err: any) {
      console.error("Error disconnecting calendar:", err.message);
      res.status(500).json({ error: "Failed to disconnect calendar" });
    }
  }
);

/**
 * DELETE /calendar/disconnect/:userId
 * Disconnect a user's Google Calendar
 * 🔒 Only admins/managers can force disconnect others
 */
router.delete(
  "/disconnect/:userId",
  requireAuth,
  requireRole(["admin", "manager"]),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      await disconnectCalendar(userId);

      res.json({
        success: true,
        message: `Google Calendar disconnected for user ${userId}`,
      });
    } catch (err: any) {
      console.error("Error disconnecting calendar:", err.message);
      res.status(500).json({ error: "Failed to disconnect calendar" });
    }
  }
);

export default router;
