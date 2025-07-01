import { RoleRouteToEachPage } from "@/feature/auth/RoleRoute";
import { useAuth } from "@/hooks/useAuth";
import type { ROLE_TYPE } from "@/interfaces/roles.interface";
import { ROUTES } from "@/routes/route.constants";
import { getCookie, parseRoles } from "@/utils/cookie.utils";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * Hook to redirect authenticated users away from auth pages (login/register)
 * Business Rule: Authenticated users should not access login/register pages
 */
export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const token = getCookie("access_token");
    const userRoles = getCookie("user_roles");
    const hasValidAuth = token && userRoles && userRoles !== "null" && userRoles !== "";

    if (isLoggedIn || hasValidAuth) {
      console.log("User already authenticated, redirecting away from auth page");
      toast.info("Bạn đã đăng nhập rồi, đang chuyển hướng...");

      // Redirect to user's appropriate page based on role
      if (hasValidAuth) {
        const roles = parseRoles(userRoles);
        if (roles && roles.length > 0) {
          navigate(RoleRouteToEachPage(roles[0] as ROLE_TYPE));
          return;
        }
      }

      // Fallback to account page
      navigate(ROUTES.ACCOUNT);
    }
  }, [isLoggedIn, navigate]);
};
