import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";
import { supabase } from "../config/supabaseClient";

const router = Router();

/**
 * GET /admin/users
 * Fetch all users (admins only)
 */
router.get("/users", requireAuth, requireRole(["admin"]), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users") // 👈 make sure your table is named `users` or `profiles`
      .select("id, email, role, created_at");

    if (error) throw error;

    res.json({ users: data ?? [] });
  } catch (err: any) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

/**
 * POST /admin/update-role
 * Promote/demote user by email
 */
router.post("/update-role", requireAuth, requireRole(["admin"]), async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ error: "Email and role are required" });
  }

  if (!["manager", "member"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const { error } = await supabase
      .from("users")
      .update({ role })
      .eq("email", email);

    if (error) throw error;

    res.json({ success: true, message: `User ${email} updated to ${role}` });
  } catch (err: any) {
    console.error("Error updating role:", err.message);
    res.status(500).json({ error: "Failed to update role" });
  }
});

export default router;
