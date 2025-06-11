// src/components/Footer/SocialLinks.tsx
import React from "react";
import type { SocialLink } from "../../../type/userLayout.ts";

interface SocialLinksProps {
  links: SocialLink[];
}

const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => {
  return (
    <div className="flex space-x-6">
      {links.map((link) => (
        <a
          key={link.iconClass}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-red-500 transition duration-300"
          aria-label={link.iconClass}
        >
          <i className={`${link.iconClass} text-2xl`}></i>
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
