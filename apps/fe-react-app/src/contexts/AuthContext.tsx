import type { AuthLoginData } from "@/interfaces/auth.interface";
import type { UserLoginResponse } from "@/interfaces/users.interface";
import { createContext } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  user: AuthLoginData | null;
  authLogin: (userData: Partial<UserLoginResponse>) => void;
  authLogout: () => void;
  getToken: () => string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
