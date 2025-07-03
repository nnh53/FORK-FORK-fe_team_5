import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/routes/route.constants";
import { getCookie, parseRoles } from "@/utils/cookie.utils";
import { Link } from "react-router-dom";

interface MenuItem {
  label: string;
  to: string;
  id?: string;
}

interface NavigationProps {
  isMenuOpen?: boolean;
  className?: string;
  navClassName?: string;
  linkClassName?: string;
  menuItems?: MenuItem[];
  onMenuItemClick?: (item: MenuItem) => void;
}

const Navigation = ({
  isMenuOpen = false,
  className = "nav-menu",
  navClassName = "",
  linkClassName = "nav-link",
  menuItems,
  onMenuItemClick,
}: NavigationProps) => {
  const { user } = useAuth();

  // Get user roles from context or cookies
  const userRoles = user?.roles || parseRoles(getCookie("user_roles"));
  const isAdmin = userRoles?.includes("ADMIN");
  const isStaff = userRoles?.includes("STAFF");

  // Default menu items - explicitly type as MenuItem[]
  const defaultMenuItems: MenuItem[] = [
    { label: "Home", to: ROUTES.HOME, id: "home" },
    { label: "Movies", to: ROUTES.MOVIES_SELECTION, id: "movies" },
    { label: "Membership", to: ROUTES.ACCOUNT, id: "membership" },
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
    <nav className={`${className} ${isMenuOpen ? "active" : ""} ${navClassName}`}>
      <ul>
        {finalMenuItems.map((item) => (
          <li key={item.id ?? item.label}>
            {item.to === "#" ? (
              <a href={item.to} className={linkClassName} onClick={() => handleItemClick(item)}>
                {item.label}
              </a>
            ) : (
              <Link to={item.to} className={linkClassName} onClick={() => handleItemClick(item)}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
