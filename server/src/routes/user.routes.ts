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
      .select("role")
      .eq("id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      return res.status(500).json({ error: error.message });
    }

    // If no row found → insert default role
    if (!data) {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          id: user.id,
          email: user.email,
          role: "member", // default role
        })
        .select("role")
        .single();

      if (insertError) {
        return res.status(500).json({ error: insertError.message });
      }

      return res.json({
        id: user.id,
        email: user.email,
        role: newUser.role,
      });
    }

    // Existing user
    res.json({
      id: user.id,
      email: user.email,
      role: data.role,
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
