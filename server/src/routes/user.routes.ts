import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";
import { updateUserRole } from "../controllers/user.controller";
import { supabase } from "../config/supabaseClient";

const router = Router();

/**
 * GET /users/me
 * Get current user info (auto-create user row if missing)
 */
router.get("/me", requireAuth, async (req, res) => {
  const user = (req as any).user;

  try {
    // Try to fetch from users table
    const { data, error } = await supabase
      .from("users")
      .select("role, name")
      .eq("id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      return res.status(500).json({ error: error.message });
    }

    // Extract name from Google metadata
    const googleName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      null;

    // If no row found → insert default role + name
    if (!data) {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          id: user.id,
          email: user.email,
          role: "member", // default role
          name: googleName,
        })
        .select("role, name")
        .single();

      if (insertError) {
        return res.status(500).json({ error: insertError.message });
      }

      return res.json({
        id: user.id,
        email: user.email,
        role: newUser.role,
        name: newUser.name,
      });
    }

    // If row exists but missing name, update it
    if (!data.name && googleName) {
      await supabase
        .from("users")
        .update({ name: googleName })
        .eq("id", user.id);
    }

    // Existing user
    res.json({
      id: user.id,
      email: user.email,
      role: data.role,
      name: data.name || googleName, // fallback if missing
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /users/:id/role
 * Only admin can change user roles
 */
router.patch("/:id/role", requireAuth, requireRole(["admin"]), updateUserRole);

export default router;
