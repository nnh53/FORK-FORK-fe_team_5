import React, { type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import PageTransition from "./PageTransition";

interface ConditionalPageTransitionProps {
  children: ReactNode;
}

const ConditionalPageTransition: React.FC<ConditionalPageTransitionProps> = ({ children }) => {
  const location = useLocation();
  
  // Check if current route is an auth route (including legacy routes)
  const isAuthRoute = location.pathname.startsWith('/auth') || 
                     location.pathname === '/login' || 
                     location.pathname === '/register' || 
                     location.pathname === '/forgot-password' ||
                     location.pathname === '/logviareg' ||
                     location.pathname.includes('auth');

  // If it's an auth route, don't apply PageTransition
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // For non-auth routes, apply PageTransition
  return <PageTransition>{children}</PageTransition>;
};

export default ConditionalPageTransition;
