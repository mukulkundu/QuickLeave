// middleware/auth.ts
import { Request, Response, NextFunction } from "express"
import { supabase } from "../config/supabaseClient"

export async function requireAuth(req: any, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: "Missing token" })

    const token = authHeader.replace("Bearer ", "")
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid token" })
    }

    req.user = data.user
    next()
  } catch {
    res.status(401).json({ error: "Unauthorized" })
  }
}

export function requireRole(role: "admin" | "manager" | "member") {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", req.user.id)
        .single()

      if (error || !data) {
        return res.status(403).json({ error: "No role assigned" })
      }

      if (data.role !== role) {
        return res.status(403).json({ error: "Forbidden" })
      }

      next()
    } catch {
      res.status(403).json({ error: "Forbidden" })
    }
  }
}
