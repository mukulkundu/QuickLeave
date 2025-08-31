import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard"); // redirect after login
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

  return <p>Finishing sign-in, please wait...</p>;
}
