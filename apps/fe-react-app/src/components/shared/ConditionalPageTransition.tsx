import React, { type ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface ConditionalPageTransitionProps {
  children: ReactNode;
}

const ConditionalPageTransition: React.FC<ConditionalPageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const isAuthRoute =
    location.pathname.startsWith("/auth") ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/logviareg" ||
    location.pathname.includes("auth");

  if (isAuthRoute) {
    return <>{children}</>;
  }
  return <>{children}</>;
};

export default ConditionalPageTransition;
