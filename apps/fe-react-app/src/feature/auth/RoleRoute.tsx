import type { ROLE_TYPE } from "@/interfaces/roles.interface";
import { getUserCookieToken } from "@/utils/auth.utils";
import { getCookie, parseRoles } from "@/utils/cookie.utils";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function RoleRouteToEachPage(roleName: ROLE_TYPE): string {
  switch (roleName) {
    case "ADMIN":
      return "/admin";
    case "STAFF":
      return "/staff";
    case "MEMBER":
    default:
      return "/";
  }
}

interface RoleRouteProps {
  allowedRoles: ROLE_TYPE[];
}

const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles }) => {
  const { isLoggedIn, user } = useAuth();
  const token = getUserCookieToken();
  const storedRoles = getCookie("user_roles");

  // If not logged in or no token, redirect to login
  if (!isLoggedIn || !token) {
    return <Navigate to="/auth/login" replace />;
  }

  const roles = user?.roles || parseRoles(storedRoles);

  console.log("Current user roles:", roles);
  console.log("Allowed roles:", allowedRoles);

  const hasAllowedRole = roles.some((role: ROLE_TYPE) => allowedRoles.includes(role));
  console.log("Has allowed role:", hasAllowedRole);

  // If user doesn't have required role, redirect to unauthorized page
  if (!hasAllowedRole) {
    console.log("Access denied: User roles do not match allowed roles");
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
