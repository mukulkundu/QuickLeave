import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"

export default function ProtectedLayout() {
  const { session } = useAuth()
  
  // Show loading while session is being determined
  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }
  
  // If no session, redirect to login
  if (!session) {
    return <Navigate to="/login" replace />
  }

  const userRole: "employee" | "manager" = "manager" // You can get this from session.user.user_metadata if stored

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role={userRole} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}