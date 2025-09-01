import { Request, Response } from "express";
import { supabase } from "../config/supabaseClient";

// --------------------------------------------------
// Member applies for leave
// --------------------------------------------------
export const applyLeave = async (req: Request, res: Response) => {
  const user = (req as any).user; // injected by requireAuth
  const { start_date, end_date, reason, leave_type_id } = req.body;

  if (!start_date || !end_date || !reason || !leave_type_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // ✅ Ensure leave_type_id exists
  const { data: lt, error: ltError } = await supabase
    .from("leave_types")
    .select("id")
    .eq("id", leave_type_id)
    .single();

  if (ltError || !lt) {
    return res.status(400).json({ error: "Invalid leave_type_id" });
  }

  const { error } = await supabase.from("leave_requests").insert({
    user_id: user.id,
    start_date,
    end_date,
    reason,
    leave_type_id, // only FK
    status: "pending",
  });

  if (error)
    return res
      .status(500)
      .json({ error: error.message, details: error.details });

  res.json({ success: true });
};

// --------------------------------------------------
// Member fetches own leave history
// --------------------------------------------------
export const getUserLeaves = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const { data, error } = await supabase
    .from("leave_requests")
    .select(
      `
      id, start_date, end_date, reason, status, created_at,
      leave_types (name)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error)
    return res
      .status(500)
      .json({ error: error.message, details: error.details });

  const formatted =
    data?.map((r: any) => ({
      id: r.id,
      start_date: r.start_date,
      end_date: r.end_date,
      reason: r.reason,
      status: r.status,
      created_at: r.created_at,
      leave_type_name: r.leave_types?.name || null, // ✅ renamed consistently
    })) || [];

  res.json({ leaves: formatted });
};

// --------------------------------------------------
// Manager/Admin fetch all leave requests
// --------------------------------------------------
export const getAllLeaveRequests = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("leave_requests")
    .select(
      `
      id, start_date, end_date, reason, status, created_at,
      users (email), leave_types (name)
    `
    )
    .order("created_at", { ascending: false });

  if (error)
    return res
      .status(500)
      .json({ error: error.message, details: error.details });

  const formatted =
    data?.map((r: any) => ({
      id: r.id,
      start_date: r.start_date,
      end_date: r.end_date,
      reason: r.reason,
      status: r.status,
      created_at: r.created_at,
      user_email: r.users?.email || null,
      leave_type_name: r.leave_types?.name || null, // ✅ renamed consistently
    })) || [];

  res.json({ requests: formatted });
};

// --------------------------------------------------
// Manager/Admin approve/reject
// --------------------------------------------------
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

  if (error)
    return res
      .status(500)
      .json({ error: error.message, details: error.details });

  res.json({ success: true });
};

// --------------------------------------------------
// Fetch all leave types (for dropdown options)
// --------------------------------------------------
export const getLeaveTypes = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("leave_types")
    .select("id, name")
    .order("name", { ascending: true });

  if (error)
    return res
      .status(500)
      .json({ error: error.message, details: error.details });

  res.json(data || []);
};

// --------------------------------------------------
// Admin adds new leave type
// --------------------------------------------------
export const addLeaveType = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Leave type name is required" });
  }

  const { error } = await supabase.from("leave_types").insert({ name });

  if (error)
    return res
      .status(500)
      .json({ error: error.message, details: error.details });

  res.json({ success: true });
};

// --------------------------------------------------
// Admin deletes leave type
// --------------------------------------------------
export const deleteLeaveType = async (req: Request, res: Response) => {
  const { id } = req.params;

  // ✅ Prevent deleting if linked to leave_requests
  const { count, error: checkError } = await supabase
    .from("leave_requests")
    .select("*", { count: "exact", head: true })
    .eq("leave_type_id", id);

  if (checkError)
    return res
      .status(500)
      .json({ error: checkError.message, details: checkError.details });

  if (count && count > 0) {
    return res
      .status(400)
      .json({ error: "Cannot delete leave type in use by requests" });
  }

  const { error } = await supabase.from("leave_types").delete().eq("id", id);

  if (error)
    return res
      .status(500)
      .json({ error: error.message, details: error.details });

  res.json({ success: true });
};
