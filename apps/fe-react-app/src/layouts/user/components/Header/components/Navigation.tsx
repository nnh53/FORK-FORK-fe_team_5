import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/Shadcn/ui/navigation-menu";
import { ROUTES } from "@/routes/route.constants";
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
  // Default menu items - explicitly type as MenuItem[]
  const defaultMenuItems: MenuItem[] = [
    { label: "Home", to: ROUTES.HOME, id: "home" },
    { label: "Movies", to: ROUTES.MOVIES_SELECTION, id: "movies" },
    { label: "Trending", to: ROUTES.HOME, id: "trending" },
    { label: "Cinemas", to: ROUTES.HOME, id: "cinemas" },
    { label: "Chairs", to: ROUTES.HOME, id: "chairs" },
    { label: "Promotions", to: ROUTES.HOME, id: "promotions" },
    { label: "Foods", to: ROUTES.HOME, id: "foods" },
  ];

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
