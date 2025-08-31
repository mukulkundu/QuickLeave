import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("useeffect start");
    
    const handleAuth = async () => {
      const url = new URL(window.location.href);
      const hasCode = url.searchParams.get("code");
      const hasState = url.searchParams.get("state");

      if (hasCode && hasState) {
        // first-time redirect from Google → exchange code
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        console.log(data.session);
        

        if (error) {
          console.error("OAuth error:", error.message);
          navigate("/login");
          return;
        }

        if (data?.session) {
          navigate("/dashboard");
          return;
        }
      } else {
        // no code in URL → just check if already logged in
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          navigate("/dashboard");
          return;
        } else {
          navigate("/login");
          // console.log(data.session);
          
        }
      }
    };

    handleAuth();
  }, [navigate]);

  return <p>Finishing sign-in, please wait...</p>;
}
