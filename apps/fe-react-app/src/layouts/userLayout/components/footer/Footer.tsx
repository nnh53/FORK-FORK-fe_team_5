import React from 'react';
import SocialLinks from './components/SocialLinks';
import FooterColumns, { type FooterColumnData } from './components/FooterColumns';
import type { SocialLink } from '../../type/userLayout.ts';

interface FooterProps {
  logoSrc: string;
  bgSrc: string;
  socialLinks: SocialLink[];
  columns: FooterColumnData[];
  copyrightText: string;
}

const Footer: React.FC<FooterProps> = ({ logoSrc, bgSrc, socialLinks, columns, copyrightText }) => {
  return (
    <footer
      className="w-full bg-repeat-x pt-6"
      style={{
        backgroundImage: `url(${bgSrc})`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'auto 100%',
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Top section: Logo and Social Links */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <img className="w-32" src={logoSrc} alt="FCinema Logo" />
          </div>
          <SocialLinks links={socialLinks} />
        </div>

        {/* Middle section: Footer Links and Contact Info */}
        <FooterColumns columns={columns} />

        {/* Bottom section: Copyright */}
        <div className="text-center text-gray-500 border-t border-gray-300">
          <p>{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
