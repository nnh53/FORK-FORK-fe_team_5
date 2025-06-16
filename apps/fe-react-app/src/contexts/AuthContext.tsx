import { createContext } from "react";
import type { AuthLoginData } from "../interfaces/auth.interface";
import type { UserLoginResponse } from "../interfaces/users.interface";

interface AuthContextType {
  isLoggedIn: boolean;
  user: AuthLoginData | null;
  authLogin: (userData: Partial<UserLoginResponse>) => void;
  authLogout: () => void;
  getToken: () => string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
