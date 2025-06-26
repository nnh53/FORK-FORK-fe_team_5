import { ROUTES } from "@/routes/route.constants";
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
  menuItems = [
    { label: "Home", to: ROUTES.HOME, id: "home" },
    { label: "Movies", to: ROUTES.MOVIES_SELECTION, id: "movies" },
    { label: "Membership", to: ROUTES.ACCOUNT, id: "membership" },
  ],
  onMenuItemClick,
}: NavigationProps) => {
  const handleItemClick = (item: MenuItem) => {
    if (onMenuItemClick) {
      onMenuItemClick(item);
    }
  };

  return (
    <nav className={`${className} ${isMenuOpen ? "active" : ""} ${navClassName}`}>
      <ul>
        {menuItems.map((item) => (
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
