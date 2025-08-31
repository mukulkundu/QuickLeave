import { useEffect, useState, useContext, createContext } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const ApiContext = createContext<{ callApi: (url: string, options?: RequestInit) => Promise<any> } | null>(null);

export function useApi() {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApi must be used inside ProtectedLayout");
  return ctx;
}

type Role = "member" | "manager" | "admin";

export default function ProtectedLayout() {
  const { session } = useAuth();
  const location = useLocation();
  const [userRole, setUserRole] = useState<Role>("member");
  const [loadingRole, setLoadingRole] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    if (!session) return;

    const fetchRole = async () => {
      try {
        const res = await fetch("http://localhost:5000/users/me", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const data = await res.json();
        setUserRole(data.role as Role);
      } catch (err) {
        console.error("Failed to fetch role", err);
      } finally {
        setLoadingRole(false);
        setTimeout(() => setShowOverlay(false), 200); // quicker hide
      }
    };

    fetchRole();
  }, [session]);

  // ✅ If session is still undefined → auth still loading
  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg font-medium">Loading...</span>
      </div>
    );
  }

  // 🚪 No session → redirect to login, and preserve where user was trying to go
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ API helper
  const callApi = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(`http://localhost:5000${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }
    return res.json();
  };

  return (
    <ApiContext.Provider value={{ callApi }}>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar role={userRole} />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>

        {showOverlay && (
          <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
              loadingRole ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </ApiContext.Provider>
  );
}
