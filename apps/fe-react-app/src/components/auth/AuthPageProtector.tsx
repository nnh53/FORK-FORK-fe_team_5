import { RoleRouteToEachPage } from "@/feature/auth/RoleRoute";
import { useAuth } from "@/hooks/useAuth";
import type { ROLE_TYPE } from "@/interfaces/roles.interface";
import { ROUTES } from "@/routes/route.constants";
import { getCookie, parseRoles } from "@/utils/cookie.utils";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * AuthPageProtector prevents authenticated users from accessing login/register pages
 * If user is already authenticated, redirect them to their appropriate dashboard
 */
const AuthPageProtector: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const token = getCookie("access_token");
  const userRoles = getCookie("user_roles");

  // Check if user has valid authentication
  const hasValidAuth = token && userRoles && userRoles !== "null" && userRoles !== "";

  if (isLoggedIn || hasValidAuth) {
    console.log("User already authenticated, redirecting away from auth page");

    // Redirect to user's appropriate page based on role
    if (hasValidAuth) {
      const roles = parseRoles(userRoles);
      if (roles && roles.length > 0) {
        return <Navigate to={RoleRouteToEachPage(roles[0] as ROLE_TYPE)} replace />;
      }
    }

    // Fallback to account page
    return <Navigate to={ROUTES.ACCOUNT} replace />;
  }

  // If not authenticated, allow access to auth pages
  return <Outlet />;
};

export default AuthPageProtector;
