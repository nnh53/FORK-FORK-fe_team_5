import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/routes/route.constants";
import { getCookie, parseRoles } from "@/utils/cookie.utils";
import { Link } from "react-router-dom";

interface AuthSectionProps {
  className?: string;
  loginButtonClassName?: string;
  bookButtonClassName?: string;
  showBookButton?: boolean;
  loginText?: string;
  logoutText?: string;
  bookText?: string;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onBookClick?: () => void;
}

const AuthSection = ({
  className = "header-actions",
  loginButtonClassName = "login-button",
  bookButtonClassName = "book-button",
  showBookButton = true,
  loginText = "Login",
  logoutText = "Logout",
  bookText = "Book Now",
  onLoginClick,
  onLogoutClick,
  onBookClick,
}: AuthSectionProps) => {
  const { isLoggedIn, authLogout } = useAuth();

  // Check if user has any roles in cookies
  const userRoles = getCookie("user_roles");
  const fullName = getCookie("fullName");
  const hasRoles = userRoles && userRoles !== "null" && userRoles !== "";

  // User is considered authenticated if logged in OR has valid roles in cookies
  const isAuthenticated = isLoggedIn || hasRoles;

  const handleLogout = () => {
    authLogout();
    if (onLogoutClick) {
      onLogoutClick();
    }
  };

  // Get user roles for display
  const roles = hasRoles ? parseRoles(userRoles) : [];

  return (
    <div className={className}>
      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          {fullName && (
            <span className="text-sm text-gray-600">
              Welcome, {fullName}
              {roles.length > 0 && <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{roles[0]}</span>}
            </span>
          )}
          <button className={`${loginButtonClassName} bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded`} onClick={handleLogout}>
            {logoutText}
          </button>
        </div>
      ) : (
        <button className={loginButtonClassName} onClick={onLoginClick}>
          <Link to={ROUTES.AUTH.LOGIN}>{loginText}</Link>
        </button>
      )}
      {showBookButton && (
        <button className={bookButtonClassName} onClick={onBookClick}>
          <Link to={ROUTES.MOVIES_SELECTION}>{bookText}</Link>
        </button>
      )}
    </div>
  );
};

export default AuthSection;
