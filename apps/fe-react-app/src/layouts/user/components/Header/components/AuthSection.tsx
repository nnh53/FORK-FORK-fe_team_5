import { Avatar, AvatarFallback, AvatarImage } from "@/components/Shadcn/ui/avatar";
import { Button } from "@/components/Shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Shadcn/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import type { ROLE_TYPE } from "@/interfaces/roles.interface";
import { ROUTES } from "@/routes/route.constants";
import { useGetUserById } from "@/services/userService";
import { getCookie } from "@/utils/cookie.utils";
import { IconDotsVertical, IconLayoutDashboard, IconLogout, IconNotification, IconUserCircle } from "@tabler/icons-react";
import { Link } from "react-router-dom";

interface AuthSectionProps {
  className?: string;
  loginText?: string;
  logoutText?: string;
  onLogoutClick?: () => void;
}

const AuthSection = ({ className = "header-actions", loginText = "Login", logoutText = "Logout", onLogoutClick }: AuthSectionProps) => {
  const { isLoggedIn, authLogout, user } = useAuth();

  // Check if user has any roles in cookies
  const userRoles = getCookie("user_roles");
  const fullName = getCookie("fullName");
  const hasRoles = userRoles && userRoles !== "null" && userRoles !== "";

  // User is considered authenticated if logged in OR has valid roles in cookies
  const isAuthenticated = isLoggedIn || hasRoles;

  // Parse user roles for dropdown menu items
  const roles: ROLE_TYPE[] = [];
  if (Array.isArray(user?.roles)) {
    roles.push(...user.roles);
  } else if (typeof user?.roles === "string") {
    roles.push(user.roles as ROLE_TYPE);
  }
  if (userRoles && typeof userRoles === "string") {
    try {
      const parsedRoles = JSON.parse(userRoles);
      if (Array.isArray(parsedRoles)) {
        roles.push(...(parsedRoles as ROLE_TYPE[]));
      }
    } catch {
      // Ignore parsing errors
    }
  }

  // Get user ID from cookies or context
  const userId = user?.id || getCookie("user_id");

  // Query user details by ID
  const { data: userDetails } = useGetUserById(userId || "");

  const handleLogout = () => {
    authLogout();
    if (onLogoutClick) {
      onLogoutClick();
    }
  };

  // Use real user data or fallback to cookie data
  const displayName = userDetails?.result?.fullName || fullName || "User";
  const displayEmail = userDetails?.result?.email || "user@fcinema.com";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={className}>
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-auto justify-start px-3 py-2">
              <Avatar className="mr-2 h-8 w-8 rounded-lg p-0">
                <AvatarImage src="https://ui.shadcn.com/avatars/shadcn.jpg" alt={displayName} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium">{displayName}</span>
              </div>
              <IconDotsVertical className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="https://ui.shadcn.com/avatars/shadcn.jpg" alt={displayName} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="text-muted-foreground truncate text-xs">{displayEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to={ROUTES.ACCOUNT} className="cursor-pointer">
                  <IconUserCircle className="mr-2 h-4 w-4" />
                  Account
                </Link>
              </DropdownMenuItem>

              {/* Add dashboard items based on specific roles */}
              {roles.includes("ADMIN") && (
                <DropdownMenuItem asChild>
                  <Link to={ROUTES.ADMIN.DASHBOARD} className="cursor-pointer">
                    <IconLayoutDashboard className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              {roles.includes("STAFF") && (
                <DropdownMenuItem asChild>
                  <Link to={ROUTES.STAFF.DASHBOARD} className="cursor-pointer">
                    <IconLayoutDashboard className="mr-2 h-4 w-4" />
                    Staff Dashboard
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem>
                <IconNotification className="mr-2 h-4 w-4" />
                More
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout className="mr-2 h-4 w-4" />
              {logoutText}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="default" asChild>
          <Link to={ROUTES.AUTH.LOGIN}>{loginText}</Link>
        </Button>
      )}
    </div>
  );
};

export default AuthSection;
