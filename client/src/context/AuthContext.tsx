import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import { AuthContext } from "./authTypes";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      console.log("Initial session:", data.session);
      setSession(data.session);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
};

