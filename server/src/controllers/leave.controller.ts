import { Request, Response } from "express";
import { supabase } from "../config/supabaseClient";
import { sendLeaveStatusEmail } from "../services/email.service";
import {
  addLeaveToCalendar,
  isCalendarConnected,
  removeLeaveFromCalendar,
} from "../services/calendar.service";

// --------------------------------------------------
// Member applies for leave
// --------------------------------------------------
export const applyLeave = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { start_date, end_date, reason, leave_type_id } = req.body;

  if (!start_date || !end_date || !reason || !leave_type_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

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
    leave_type_id,
    status: "pending",
  });

  if (error) {
    console.error("applyLeave error:", error);
    return res.status(500).json({ error: error.message, details: error.details });
  }

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

  if (error) {
    console.error("getUserLeaves error:", error);
    return res.status(500).json({ error: error.message, details: error.details });
  }

  const formatted =
    data?.map((r: any) => ({
      id: r.id,
      start_date: r.start_date,
      end_date: r.end_date,
      reason: r.reason,
      status: r.status,
      created_at: r.created_at,
      leave_type_name: Array.isArray(r.leave_types)
        ? r.leave_types[0]?.name
        : r.leave_types?.name,
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
      users:user_id (name, email),
      leave_types:leave_type_id (name)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllLeaveRequests error:", error);
    return res.status(500).json({ error: error.message, details: error.details });
  }

  const formatted =
    data?.map((r: any) => {
      const user = Array.isArray(r.users) ? r.users[0] : r.users;
      const leaveType = Array.isArray(r.leave_types)
        ? r.leave_types[0]
        : r.leave_types;

      return {
        id: r.id,
        start_date: r.start_date,
        end_date: r.end_date,
        reason: r.reason,
        status: r.status,
        created_at: r.created_at,
        user_name: user?.name ?? null,
        user_email: user?.email ?? null,
        leave_type_name: leaveType?.name ?? null,
      };
    }) || [];

  res.json({ requests: formatted });
};

// --------------------------------------------------
// Manager/Admin approve/reject
// --------------------------------------------------
export const updateLeaveStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: "approved" | "rejected" | "cancelled" };
  const requester = (req as any).user;

  if (!["approved", "rejected", "cancelled"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  // Fetch leave first to check ownership and populate related data
  const { data: existing, error: fetchError } = await supabase
    .from("leave_requests")
    .select(
      `
      id, start_date, end_date, reason, status, user_id,
      users:user_id (name, email),
      leave_types:leave_type_id (name)
    `
    )
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return res.status(404).json({ error: "Leave request not found" });
  }

  // Load requester's role for authorization
  const { data: roleRow } = await supabase
    .from("users")
    .select("role")
    .eq("id", requester.id)
    .single();

  const requesterRole = roleRow?.role as string | undefined;

  // Authorization rules:
  // - approved/rejected: manager or admin only
  // - cancelled: only the owner of the leave (member/any role if owner)
  const isManagerOrAdmin = ["manager", "admin"].includes(requesterRole || "");
  const isOwner = requester?.id === existing.user_id;

  if ((status === "approved" || status === "rejected") && !isManagerOrAdmin) {
    return res.status(403).json({ error: "Not authorized to update this status" });
  }
  if (status === "cancelled" && !isOwner) {
    return res.status(403).json({ error: "Only the requester can cancel this leave" });
  }

  const { data, error } = await supabase
    .from("leave_requests")
    .update({ status })
    .eq("id", id)
    .select(
      `
      id, start_date, end_date, reason, status, user_id,
      users:user_id (name, email),
      leave_types:leave_type_id (name)
    `
    )
    .single();

  if (error) {
    console.error("updateLeaveStatus error:", error);
    return res.status(500).json({ error: error.message, details: error.details });
  }

  const user = Array.isArray(data?.users) ? data.users[0] : data?.users;
  const leaveType = Array.isArray(data?.leave_types)
    ? data.leave_types[0]
    : data?.leave_types;

  if (user?.email) {
    sendLeaveStatusEmail({
      email: user.email,
      name: user?.name || undefined,
      leaveType: leaveType?.name || "Leave",
      startDate: data.start_date,
      endDate: data.end_date,
      status,
    }).catch((err) => {
      console.error("Email send error:", err.message);
    });
  }

  try {
    const connected = await isCalendarConnected(data.user_id);
    if (connected) {
      if (status === "approved") {
        await addLeaveToCalendar({
          userId: data.user_id,
          leaveRequestId: data.id,
          leaveType: leaveType?.name || "Leave",
          startDate: data.start_date,
          endDate: data.end_date,
          reason: data.reason,
          userEmail: user?.email,
          userName: user?.name,
        });
      } else if (status === "rejected" || status === "cancelled") {
        await removeLeaveFromCalendar({
          userId: data.user_id,
          leaveRequestId: data.id,
        });
      }
    } else {
      console.log(
        // `📅 User ${data.user_id} has not connected Google Calendar. Skipping...`
      );
    }
  } catch (err: any) {
    console.error("Calendar sync error:", err.message);
  }

  res.json({ success: true });
};

// --------------------------------------------------
// Delete leave request (user or admin)
// --------------------------------------------------
export const deleteLeave = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  try {
    const { data: leave, error: fetchError } = await supabase
      .from("leave_requests")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (fetchError || !leave) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    if (
      leave.user_id !== user.id &&
      !["admin", "manager"].includes(user.role)
    ) {
      return res.status(403).json({ error: "Not authorized to delete this leave" });
    }

    // ✅ Remove from calendar BEFORE deleting from DB
    try {
      const connected = await isCalendarConnected(leave.user_id);
      if (connected) {
        await removeLeaveFromCalendar({
          userId: leave.user_id,
          leaveRequestId: leave.id,
        });
      }
    } catch (err: any) {
      console.error("Calendar remove error:", err.message);
    }

    // ✅ Now delete from DB
    const { error: deleteError } = await supabase
      .from("leave_requests")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("deleteLeave DB error:", deleteError);
      return res.status(500).json({ error: deleteError.message });
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error("deleteLeave error:", err.message);
    res.status(500).json({ error: "Failed to delete leave request" });
  }
};

// --------------------------------------------------
// Fetch all leave types
// --------------------------------------------------
export const getLeaveTypes = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("leave_types")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("getLeaveTypes error:", error);
    return res.status(500).json({ error: error.message, details: error.details });
  }

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

  if (error) {
    console.error("addLeaveType error:", error);
    return res.status(500).json({ error: error.message, details: error.details });
  }

  res.json({ success: true });
};

// --------------------------------------------------
// Admin deletes leave type
// --------------------------------------------------
export const deleteLeaveType = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { count, error: checkError } = await supabase
    .from("leave_requests")
    .select("*", { count: "exact", head: true })
    .eq("leave_type_id", id);

  if (checkError) {
    console.error("deleteLeaveType check error:", checkError);
    return res
      .status(500)
      .json({ error: checkError.message, details: checkError.details });
  }

  if (count && count > 0) {
    return res
      .status(400)
      .json({ error: "Cannot delete leave type in use by requests" });
  }

  const { error } = await supabase.from("leave_types").delete().eq("id", id);

  if (error) {
    console.error("deleteLeaveType error:", error);
    return res.status(500).json({ error: error.message, details: error.details });
  }

  res.json({ success: true });
};
