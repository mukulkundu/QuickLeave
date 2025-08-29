import { Outlet, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"

export default function ProtectedLayout() {
  const isAuthenticated = true // TODO: replace with real auth
  const userRole: "employee" | "manager" = "manager" // fake role for demo

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

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
