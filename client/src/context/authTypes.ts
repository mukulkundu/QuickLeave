import { createContext } from "react";
import type { Session } from "@supabase/supabase-js";

export interface AuthContextType {
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
