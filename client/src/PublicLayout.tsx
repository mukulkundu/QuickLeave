import { Outlet, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"

export default function PublicLayout() {
  const { session } = useAuth()
  const location = useLocation()

  // If user is already authenticated and trying to access login/signup, redirect to dashboard
  // But allow auth callback to proceed
  if (session && (location.pathname === "/")) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Outlet />
    </div>
  )
}