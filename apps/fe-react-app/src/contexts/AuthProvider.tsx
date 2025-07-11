import type { AuthLoginData } from "@/interfaces/auth.interface";
import type { UserLoginResponse } from "@/interfaces/users.interface";
import { clearAuthData } from "@/utils/auth.utils";
import { getCookie, parseRoles, setCookie } from "@/utils/cookie.utils";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthLoginData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie("access_token");
    const roles = parseRoles(getCookie("user_roles"));
    const id = getCookie("user_id");
    const fullName = getCookie("fullName");

    console.log("AuthProvider initialization:", { token: !!token, roles, id, fullName });

    if (token && roles.length > 0 && id && fullName) {
      setIsLoggedIn(true);
      setUser({
        token,
        roles,
        id,
        fullName,
      });
      console.log("User logged in from cookies:", { roles, id, fullName });
    } else {
      console.log("No valid auth data found in cookies");
    }
  }, []);

  const authLogin = (userData: Partial<UserLoginResponse>) => {
    if (!userData.token || !userData.roles) {
      console.error("Invalid login data");
      return;
    }

    setIsLoggedIn(true);
    const authData: AuthLoginData = {
      token: userData.token,
      roles: userData.roles,
      id: userData.id || "",
      fullName: userData.fullName || "",
    };
    setUser(authData);
    setCookie("access_token", userData.token, 1); // Set to expire in 1 day
    setCookie("user_roles", JSON.stringify(userData.roles), 1);
    if (userData.id) setCookie("user_id", userData.id, 1);
    if (userData.fullName) setCookie("fullName", userData.fullName, 1);
    if (userData.refresh_token) setCookie("refresh_token", userData.refresh_token, 7); // Set refresh token to expire in 7 days
  };

  const authLogout = () => {
    console.log("Logging out user...");

    // Clear all local auth data
    setIsLoggedIn(false);
    setUser(null);
    clearAuthData(); // This will clear all cookies

    console.log("User logged out successfully");

    // Redirect to home page
    navigate("/");
  };

  const getToken = () => getCookie("access_token");

  return <AuthContext.Provider value={{ isLoggedIn, user, authLogin, authLogout, getToken }}>{children}</AuthContext.Provider>;
};
