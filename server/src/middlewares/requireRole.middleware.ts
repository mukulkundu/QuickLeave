import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabaseClient";

export const requireRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      return res.status(403).json({ error: "Unable to fetch role" });
    }

    if (!roles.includes(data.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
};
