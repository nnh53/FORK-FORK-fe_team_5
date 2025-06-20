interface MenuItem {
  label: string;
  href: string;
  id?: string;
}

interface NavigationProps {
  /** Whether the mobile menu is open */
  isMenuOpen?: boolean;
  /** Custom CSS class name for the navigation container */
  className?: string;
  /** Additional CSS class name for the nav element */
  navClassName?: string;
  /** CSS class name for navigation links */
  linkClassName?: string;
  /** Custom menu items array */
  menuItems?: MenuItem[];
  /** Callback function when a menu item is clicked */
  onMenuItemClick?: (item: MenuItem) => void;
}

/**
 * Navigation component for the header
 * Renders a list of navigation menu items
 */
const Navigation = ({
  isMenuOpen = false,
  className = "nav-menu",
  navClassName = "",
  linkClassName = "nav-link",
  menuItems = [
    { label: "Home", href: "#", id: "home" },
    { label: "Movies", href: "#", id: "movies" },
    { label: "Theaters", href: "#", id: "theaters" },
    { label: "Offers", href: "#", id: "offers" },
    { label: "Membership", href: "#", id: "membership" },
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
          <li key={item.id || item.label}>
            <a href={item.href} className={linkClassName} onClick={() => handleItemClick(item)}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;

