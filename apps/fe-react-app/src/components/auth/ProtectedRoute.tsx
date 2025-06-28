import { useAuth } from "@/hooks/useAuth";
import { getUserCookieToken } from "@/utils/auth.utils";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectPath = "/login" }) => {
  const { isLoggedIn } = useAuth();
  const token = getUserCookieToken();

  if (!isLoggedIn && !token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
