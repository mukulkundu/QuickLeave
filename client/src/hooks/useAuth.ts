import { useContext } from "react";
import { AuthContext, type AuthContextType } from "../context/authTypes";

export const useAuth = (): AuthContextType => useContext(AuthContext);
