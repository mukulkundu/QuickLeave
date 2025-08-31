import { Request, Response } from "express";
import { supabase } from "../config/supabaseClient";

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["manager", "member"].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Admin cannot be reassigned." });
    }

    const { data, error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: "Role updated", user: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
