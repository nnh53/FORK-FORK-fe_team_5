import { Icon } from "@iconify/react";
import React from "react";

interface SocialLink {
  icon: string;
  href?: string;
  ariaLabel?: string;
}

interface SocialLinksProps {
  className?: string;
  links?: SocialLink[];
}

const defaultSocialLinks: SocialLink[] = [
  { icon: "tabler:brand-facebook", href: "#", ariaLabel: "Visit our Facebook page" },
  { icon: "tabler:brand-twitter", href: "#", ariaLabel: "Follow us on Twitter" },
  { icon: "tabler:brand-instagram", href: "#", ariaLabel: "Follow us on Instagram" },
  { icon: "tabler:brand-youtube", href: "#", ariaLabel: "Subscribe to our YouTube channel" },
];

const SocialLinks: React.FC<SocialLinksProps> = ({ className = "social-links", links = defaultSocialLinks }) => {
  return (
    <nav className={className} aria-label="Social media links">
      {links.map((link, index) => (
        <a key={index} href={link.href} className="social-icon" aria-label={link.ariaLabel} target="_blank" rel="noopener noreferrer">
          <Icon icon={link.icon} />
        </a>
      ))}
    </nav>
  );
};

export default SocialLinks;
