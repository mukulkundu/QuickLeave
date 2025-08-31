import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom"
import { AuthProvider } from "./context/AuthContext";

import PublicLayout from "./PublicLayout"
import ProtectedLayout from "./ProtectedLayout"

import Landing from "./pages/Landing/Landing"
import Login from "./pages/Auth/Login"
import Signup from "./pages/Auth/Signup"

import Dashboard from "./pages/Features/Dashboard"
import ApplyLeave from "./pages/Features/ApplyLeave"
import LeaveHistory from "./pages/Features/LeaveHistory"
import ManageRequests from "./pages/Features/ManageRequests"
import Settings from "./pages/Features/Settings"
import AuthCallback from "./pages/Auth/AuthCallback";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/v1/callback" element={<AuthCallback />} />
      </Route>

      {/* Protected layout */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/apply" element={<ApplyLeave />} />
        <Route path="/history" element={<LeaveHistory />} />
        <Route path="/requests" element={<ManageRequests />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </>
  )
)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
