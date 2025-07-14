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
import { ROUTES } from "@/routes/route.constants";
import { useGetUserById } from "@/services/userService";
import { getCookie } from "@/utils/cookie.utils";
import { IconLayoutDashboard, IconLogout, IconUserCircle } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const AuthAvatar = () => {
  const { isLoggedIn, authLogout, user } = useAuth();
  const userRoles = getCookie("user_roles");
  // const fullName = getCookie("fullName");
  const hasRoles = userRoles && userRoles !== "null" && userRoles !== "";
  const isAuthenticated = isLoggedIn || hasRoles;

  const roles = user?.roles || [];
  if (userRoles && typeof userRoles === "string") {
    try {
      const parsedRoles = JSON.parse(userRoles);
      if (Array.isArray(parsedRoles)) {
        roles.push(...parsedRoles);
      }
    } catch {
      console.error("Failed to parse user roles from cookie:", userRoles);
    }
  }

  const userId = getCookie("user_id");
  const { data: userDetails } = useGetUserById(userId ?? "");

  const handleLogout = () => {
    authLogout();
  };

  const renderPrimaryMenuItem = () => {
    if (roles.includes("ADMIN")) {
      return (
        <DropdownMenuItem asChild>
          <Link to={ROUTES.ADMIN.DASHBOARD} className="cursor-pointer">
            <IconLayoutDashboard className="mr-2 h-4 w-4" />
            Admin Dashboard
          </Link>
        </DropdownMenuItem>
      );
    } else if (roles.includes("STAFF")) {
      return (
        <DropdownMenuItem asChild>
          <Link to={ROUTES.STAFF.DASHBOARD} className="cursor-pointer">
            <IconLayoutDashboard className="mr-2 h-4 w-4" />
            Staff Dashboard
          </Link>
        </DropdownMenuItem>
      );
    }
  };

  const displayName = userDetails?.result?.fullName || "";
  const displayEmail = userDetails?.result?.email;
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (!isAuthenticated) {
    return (
      <Button variant="default" asChild className="rounded-full">
        <Link to={ROUTES.AUTH.LOGIN}>Login</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://ui.shadcn.com/avatars/shadcn.jpg" alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
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
          {renderPrimaryMenuItem()}
          <DropdownMenuItem asChild>
            <Link to={ROUTES.ACCOUNT} className="cursor-pointer">
              <IconUserCircle className="mr-2 h-4 w-4" />
              Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <IconLogout className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthAvatar;
