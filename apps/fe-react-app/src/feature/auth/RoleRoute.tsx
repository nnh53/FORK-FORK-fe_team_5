import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { Role } from "../../interfaces/roles.interface";

export function RoleRouteToEachPage(roleName: Role): string {
  switch (roleName) {
    case "ROLE_MANAGER":
      return "/managers";
    case "ROLE_STAFF":
      return "/staffs";
    case "ROLE_MEMBER":
      return "/members";
    case "ROLE_GUEST":
      return "/welcome";
    default:
      return "/";
  }
}

interface RoleRouteProps {
  allowedRoles: Role[];
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
