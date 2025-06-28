import type { ROLE_TYPE } from "@/interfaces/roles.interface";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getCookie, parseRoles } from "@/utils/cookie.utils";
import { getUserCookieToken } from "@/utils/auth.utils";

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
  redirectPath: string;
}

const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, redirectPath = "/login" }) => {
  const { isLoggedIn, user } = useAuth();
  const token = getUserCookieToken();
  const storedRoles = getCookie("user_roles");

  if (!isLoggedIn || !token) {
    return <Navigate to={redirectPath} replace />;
  }

  const roles = user?.roles || (parseRoles(storedRoles) as ROLE_TYPE[]);

  console.log("Current user roles:", roles);
  console.log("Allowed roles:", allowedRoles);

  const hasAllowedRole = roles.some((role: ROLE_TYPE) => allowedRoles.includes(role));
  console.log("Has allowed role:", hasAllowedRole);

  if (!hasAllowedRole) {
    console.log("Access denied: User roles do not match allowed roles");
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
