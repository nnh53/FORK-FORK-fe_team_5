import type { ROLE_TYPE } from "@/interfaces/roles.interface";
import type { AuthenticationResponse } from "@/type-from-be";

// Auth data structure for localStorage
export interface AuthData {
  token: string;
  roles: ROLE_TYPE;
  fullName: string;
  id: string;
}

// Save auth data to localStorage
export const saveAuthData = (authResponse: AuthenticationResponse): void => {
  if (authResponse) {
    localStorage.setItem("token", authResponse.token || "");
    localStorage.setItem("roles", authResponse.roles || "");
    localStorage.setItem("fullName", authResponse.fullName || "");
    localStorage.setItem("id", authResponse.id || "");

    // Save complete auth data as JSON
    localStorage.setItem("authData", JSON.stringify(authResponse));
  }
};

// Get auth data from localStorage
export const getAuthData = (): AuthData | null => {
  try {
    const authDataStr = localStorage.getItem("authData");
    if (authDataStr) {
      return JSON.parse(authDataStr) as AuthData;
    }
    return null;
  } catch (error) {
    console.error("Error parsing auth data from localStorage:", error);
    return null;
  }
};

// Get specific auth field from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export const getAuthRoles = (): ROLE_TYPE | null => {
  return localStorage.getItem("roles") as ROLE_TYPE | null;
};

export const getAuthFullName = (): string | null => {
  return localStorage.getItem("fullName");
};

export const getAuthId = (): string | null => {
  return localStorage.getItem("id");
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token && token.length > 0;
};

// Clear auth data from localStorage
export const clearAuthData = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("roles");
  localStorage.removeItem("fullName");
  localStorage.removeItem("id");
  localStorage.removeItem("authData");
};

// Check if user has specific role
export const hasRole = (role: ROLE_TYPE): boolean => {
  const userRole = getAuthRoles();
  return userRole === role;
};

// Check if user is admin
export const isAdmin = (): boolean => {
  return hasRole("ADMIN" as ROLE_TYPE);
};

// Check if user is staff
export const isStaff = (): boolean => {
  return hasRole("STAFF" as ROLE_TYPE);
};

// Check if user is member
export const isMember = (): boolean => {
  return hasRole("MEMBER" as ROLE_TYPE);
};
