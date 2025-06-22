import React from "react";

interface FooterBottomProps {
  className?: string;
  copyrightText?: string;
}

const FooterBottom: React.FC<FooterBottomProps> = ({ className = "footer-bottom", copyrightText }) => {
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} F-Cinema. All Rights Reserved.`;

  return (
    <section className={className}>
      <p>{copyrightText || defaultCopyright}</p>
    </section>
  );
};

export default FooterBottom;
