interface MenuItem {
  label: string;
  href: string;
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
