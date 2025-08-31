import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      // Supabase automatically parses the fragment (#access_token, etc.)
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error.message);
        return;
      }

      if (data?.session) {
        console.log("✅ User signed in:", data.session.user);
        navigate("/dashboard"); // redirect user into app
      } else {
        console.warn("⚠️ No session found, redirecting to login");
        navigate("/login");
      }
    };

    handleAuth();
  }, [navigate]);

  return <p>Finishing sign-in, please wait...</p>;
}
