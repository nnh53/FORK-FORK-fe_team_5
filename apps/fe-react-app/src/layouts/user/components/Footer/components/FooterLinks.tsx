import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { FooterLink } from "../constants/footerData";

interface FooterLinksProps {
  title: string;
  links: FooterLink[];
  className?: string;
}

const FooterLinks: React.FC<FooterLinksProps> = ({ title, links, className = "footer-column" }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on homepage
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, link: FooterLink) => {
    if (link.href && link.href.startsWith("#")) {
      e.preventDefault();

      const targetId = link.href.substring(1);

      if (isHomePage) {
        // If on homepage, scroll to section
        const element = document.getElementById(targetId);

        if (element) {
          // Calculate exact scroll position
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - 100; // 100px offset

          // Smooth scroll to exact position
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      } else {
        // If on other page, navigate to homepage with section info
        navigate("/home", {
          replace: false,
          state: { scrollToSection: targetId },
        });
      }
    }
  };
  return (
    <section className={className}>
      <h4>{title}</h4>
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link.label}>
              {link.to ? (
                <Link to={link.to}>{link.label}</Link>
              ) : (
                <a
                  href={link.href}
                  onClick={(e) => handleClick(e, link)}
                  target={link.isExternal ? "_blank" : "_self"}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};

export default FooterLinks;
