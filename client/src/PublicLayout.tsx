import { Outlet, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"

export default function PublicLayout() {
  const { session } = useAuth()
  const location = useLocation()

  // If user is already authenticated and trying to access landing page, redirect to dashboard
  // But allow auth callback to proceed and preserve original location if coming from protected route
  if (session && (location.pathname === "/")) {
    // Check if user was redirected here from a protected route (preserve original location)
    const from = (location.state as any)?.from?.pathname
    if (from) {
      return <Navigate to={from} replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Outlet />
    </div>
  )
}