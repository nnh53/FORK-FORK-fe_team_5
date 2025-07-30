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
      return ROUTES.HOME;
    default:
      return ROUTES.HOME;
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
  if (!isLoggedIn && !token) {
    return <Navigate to="/auth/login" replace />;
  }
  const roles: ROLE_TYPE[] = user?.roles ?? parseRoles(storedRoles);

  console.log("Current user roles:", roles);
  console.log("Allowed roles:", allowedRoles);

  const hasAllowedRole = roles.some((role: ROLE_TYPE) => allowedRoles.includes(role));
  const isAdmin = roles.some((role: ROLE_TYPE) => role === "ADMIN");

  console.log("Has allowed role:", hasAllowedRole);
  console.log("Is Admin:", isAdmin);

  // If user doesn't have required role
  if (!hasAllowedRole) {
    // If user is admin but trying to access staff routes, redirect to admin dashboard
    if (isAdmin && allowedRoles.includes("STAFF")) {
      console.log("Admin trying to access staff route, redirecting to admin dashboard");
      return <Navigate to={RoleRouteToEachPage("ADMIN")} replace />;
    }

    console.log("Access denied: User roles do not match allowed roles");
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
