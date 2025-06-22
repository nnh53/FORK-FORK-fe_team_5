import React from "react";
import { Link } from "react-router-dom";
import type { FooterLink } from "../constants/footerData";

interface FooterLinksProps {
  title: string;
  links: FooterLink[];
  className?: string;
}

const FooterLinks: React.FC<FooterLinksProps> = ({ title, links, className = "footer-column" }) => {
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
                <a href={link.href} target={link.isExternal ? "_blank" : "_self"} rel={link.isExternal ? "noopener noreferrer" : undefined}>
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
