import type { components } from "@/schema-from-be";
type AuthenticationResponse = components["schemas"]["AuthenticationResponse"];
import { eraseCookie, getCookie, setCookie } from "./cookie.utils";

export const getUserCookieToken = (): string | null => {
  return getCookie("access_token");
};

export const getUserIdFromCookie = (): string | null => {
  return getCookie("user_id");
};

export const isTokenValid = () => {
  const token = getUserCookieToken();
  return !!token; // Return true if token exists
};

export const saveAuthData = (authData: AuthenticationResponse) => {
  if (authData.token) {
    setCookie("access_token", authData.token, 1);
  }
  if (authData.roles) {
    setCookie("user_roles", JSON.stringify([authData.roles]), 1);
  }
  if (authData.id) {
    setCookie("user_id", authData.id.toString(), 1);
  }
  if (authData.fullName) {
    setCookie("fullName", authData.fullName, 1);
  }
};

export const clearAuthData = () => {
  eraseCookie("access_token");
  eraseCookie("refresh_token");
  eraseCookie("user_roles");
  eraseCookie("user_id");
  eraseCookie("fullName");
};
