import type { ROLE_TYPE } from "@/interfaces/roles.interface";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function RoleRouteToEachPage(roleName: ROLE_TYPE): string {
  switch (roleName) {
    case "MANAGER":
      return "/managers";
    case "STAFF":
      return "/staffs";
    case "MEMBER":
      return "/members";
    case "GUEST":
      return "/welcome";
    case "ADMIN":
      return "/admin";
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

  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  console.log("Allowed Roles: ", allowedRoles);

  const userRoles = user?.roles || [];
  const hasAllowedRole = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAllowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
