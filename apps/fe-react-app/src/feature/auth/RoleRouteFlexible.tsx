import { useAuth } from "@/hooks/useAuth";
import type { ROLE_TYPE } from "@/interfaces/roles.interface";
import { ROUTES } from "@/routes/route.constants";
import { getUserCookieToken } from "@/utils/auth.utils";
import { getCookie, parseRoles } from "@/utils/cookie.utils";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export function RoleRouteToEachPage(roleName: ROLE_TYPE): string {
  switch (roleName) {
    case "ADMIN":
      return ROUTES.ADMIN.DASHBOARD;
    case "STAFF":
      return ROUTES.STAFF.DASHBOARD;
    case "MEMBER":
    default:
      return ROUTES.ACCOUNT;
  }
}

interface RoleRouteFlexibleProps {
  allowedRoles: ROLE_TYPE[];
  allowAdminAccess?: boolean; // New prop to allow admin access to staff routes
}

const RoleRouteFlexible: React.FC<RoleRouteFlexibleProps> = ({
  allowedRoles,
  allowAdminAccess = true, // Default to true for flexible access
}) => {
  const { isLoggedIn, user } = useAuth();
  const token = getUserCookieToken();
  const storedRoles = getCookie("user_roles");

  // If not logged in or no token, redirect to login
  if (!isLoggedIn || !token) {
    return <Navigate to="/auth/login" replace />;
  }

  const roles = user?.roles || parseRoles(storedRoles);

  console.log("FlexibleRoleRoute - Current user roles:", roles);
  console.log("FlexibleRoleRoute - Allowed roles:", allowedRoles);
  console.log("FlexibleRoleRoute - Allow admin access:", allowAdminAccess);

  const hasAllowedRole = roles.some((role: ROLE_TYPE) => allowedRoles.includes(role));
  const isAdmin = roles.some((role: ROLE_TYPE) => role === "ADMIN");

  console.log("FlexibleRoleRoute - Has allowed role:", hasAllowedRole);
  console.log("FlexibleRoleRoute - Is Admin:", isAdmin);

  // Check access permissions
  const hasAccess = hasAllowedRole || (isAdmin && allowAdminAccess);

  console.log("FlexibleRoleRoute - Has access:", hasAccess);

  // If user doesn't have access
  if (!hasAccess) {
    console.log("FlexibleRoleRoute - Access denied: User roles do not match allowed roles and admin access not permitted");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("FlexibleRoleRoute - Access granted");
  return <Outlet />;
};

export default RoleRouteFlexible;
