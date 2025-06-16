import type { AuthLoginData } from "@/interfaces/auth.interface";
import type { UserLoginResponse } from "@/interfaces/users.interface";
import { logout } from "@/utils/api.utils";
import { eraseCookie, getCookie, parseRoles, setCookie } from "@/utils/cookie.utils";
import { useEffect, useState } from "react";
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
    const username = getCookie("username");

    if (token && roles.length > 0 && id && username) {
      setIsLoggedIn(true);
      setUser({
        token,
        roles,
        id: parseInt(id, 10),
        username,
      });
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
      id: userData.id || 0,
      username: userData.username || "",
    };
    setUser(authData);
    setCookie("access_token", userData.token, 1); // Set to expire in 1 day
    setCookie("user_roles", JSON.stringify(userData.roles), 1);
    if (userData.id) setCookie("user_id", userData.id.toString(), 1);
    if (userData.username) setCookie("username", userData.username, 1);
    if (userData.refresh_token) setCookie("refresh_token", userData.refresh_token, 7); // Set refresh token to expire in 7 days
  };

  const authLogout = async () => {
    const token = getCookie("access_token");
    if (token) {
      await logout(token);
    }
    setIsLoggedIn(false);
    setUser(null);
    eraseCookie("access_token");
    eraseCookie("user_roles");
    eraseCookie("user_id");
    eraseCookie("username");
    eraseCookie("refresh_token");
    navigate("/");
  };

  const getToken = () => getCookie("access_token");

  return <AuthContext.Provider value={{ isLoggedIn, user, authLogin, authLogout, getToken }}>{children}</AuthContext.Provider>;
};
