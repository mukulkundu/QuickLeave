import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null); // ✅ clears context immediately
    navigate("/login", { replace: true });
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <h1 className="text-lg font-bold">App</h1>
      <button
        onClick={handleLogout}
        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </nav>
  );
}
