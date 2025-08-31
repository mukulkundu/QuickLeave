import { createContext } from "react";
import type { Session } from "@supabase/supabase-js";

export type AuthContextType = {
  session: Session | null | undefined; // undefined = loading, null = no session, Session = authenticated
};

export const AuthContext = createContext<AuthContextType>({ session: undefined });
