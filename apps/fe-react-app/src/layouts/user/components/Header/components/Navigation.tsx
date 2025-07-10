import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/Shadcn/ui/navigation-menu";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/routes/route.constants";
import { getCookie, parseRoles } from "@/utils/cookie.utils";
import { cn } from "@/utils/utils";
import { Link } from "react-router-dom";

interface MenuItem {
  label: string;
  to: string;
  id?: string;
}

interface NavigationProps {
  isMenuOpen?: boolean;
  navClassName?: string;
  menuItems?: MenuItem[];
  onMenuItemClick?: (item: MenuItem) => void;
}

const Navigation = ({ isMenuOpen = false, navClassName = "", menuItems, onMenuItemClick }: NavigationProps) => {
  const { user } = useAuth();

  // Get user roles from context or cookies
  const userRoles = user?.roles || parseRoles(getCookie("user_roles"));
  const isAdmin = userRoles?.includes("ADMIN");
  const isStaff = userRoles?.includes("STAFF");

  // Default menu items - explicitly type as MenuItem[]
  const defaultMenuItems: MenuItem[] = [
    { label: "Home", to: ROUTES.HOME, id: "home" },
    { label: "Movies", to: ROUTES.MOVIES_SELECTION, id: "movies" },
    
  ];

  // Add dashboard items based on specific roles only
  if (isAdmin) {
    defaultMenuItems.push({ label: "Admin", to: ROUTES.ADMIN.DASHBOARD as string, id: "admin-dashboard" });
  }

  if (isStaff) {
    defaultMenuItems.push({ label: "Staff", to: ROUTES.STAFF.DASHBOARD as string, id: "staff-dashboard" });
  }

  const finalMenuItems = menuItems || defaultMenuItems;
  const handleItemClick = (item: MenuItem) => {
    if (onMenuItemClick) {
      onMenuItemClick(item);
    }
  };

  return (
    <NavigationMenu className={cn("", navClassName)}>
      <NavigationMenuList className={cn("gap-6", isMenuOpen ? "active" : "")}>
        {finalMenuItems.map((item) => (
          <NavigationMenuItem key={item.id ?? item.label}>
            {item.to === "#" ? (
              <NavigationMenuLink href={item.to} className={cn(navigationMenuTriggerStyle())} onClick={() => handleItemClick(item)}>
                {item.label}
              </NavigationMenuLink>
            ) : (
              <NavigationMenuLink asChild>
                <Link to={item.to} className={cn(navigationMenuTriggerStyle())} onClick={() => handleItemClick(item)}>
                  {item.label}
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navigation;
