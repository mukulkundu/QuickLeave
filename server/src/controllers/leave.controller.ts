import { Request, Response } from "express";
import { supabase } from "../config/supabaseClient";

// ✅ Member applies for leave
export const applyLeave = async (req: Request, res: Response) => {
  const user = (req as any).user; // injected by requireAuth
  const { start_date, end_date, reason, leave_type_id, half_day } = req.body;

  if (!start_date || !end_date || !reason) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const { error } = await supabase.from("leave_requests").insert({
    user_id: user.id,
    start_date,
    end_date,
    reason,
    leave_type_id: leave_type_id || null,
    half_day: half_day || false,
    status: "pending",
  });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
};

// ✅ Member fetches own leave history
export const getUserLeaves = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const { data, error } = await supabase
    .from("leave_requests")
    .select("id, start_date, end_date, reason, status, created_at, leave_types(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ leaves: data });
};

// ✅ Manager/Admin fetch all leave requests
export const getAllLeaveRequests = async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("leave_requests")
    .select(
      "id, start_date, end_date, reason, status, created_at, half_day, users(email), leave_types(name)"
    )
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  // flatten user email so frontend doesn't deal with nested objects
  const formatted =
    data?.map((r: any) => ({
      id: r.id,
      start_date: r.start_date,
      end_date: r.end_date,
      reason: r.reason,
      status: r.status,
      created_at: r.created_at,
      half_day: r.half_day,
      user_email: r.users?.email || null,
      leave_type: r.leave_types?.name || null,
    })) || [];

  res.json({ requests: formatted });
};

// ✅ Manager/Admin approve/reject
export const updateLeaveStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const { error } = await supabase
    .from("leave_requests")
    .update({ status })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
};
