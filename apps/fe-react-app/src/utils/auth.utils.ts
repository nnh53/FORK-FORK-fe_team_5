import type { AuthenticationResponse } from "@/type-from-be";
import { getCookie, setCookie } from "./cookie.utils";

export const getUserCookieToken = (): string | null => {
  return getCookie("access_token");
};

export const isTokenValid = () => {
  const token = getUserCookieToken();
  return !!token; // Return true if token exists
};

export const saveAuthData = (authData: AuthenticationResponse) => {
  if (authData.token) {
    setCookie("access_token", authData.token, 1);
  }
  if (authData.refresh_token) {
    setCookie("refresh_token", authData.refresh_token, 7);
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
