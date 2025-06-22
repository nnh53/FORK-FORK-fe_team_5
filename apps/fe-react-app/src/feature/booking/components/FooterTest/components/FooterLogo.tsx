import FCinemaLogo from "@/assets/FCinema_Logo.png";
import React from "react";
import SocialLinks from "./SocialLinks";

interface FooterLogoProps {
  className?: string;
}

const FooterLogo: React.FC<FooterLogoProps> = ({ className = "footer-column" }) => {
  return (
    <section className={className}>
      <header className="footer-logo">
        <img src={FCinemaLogo} alt="F-Cinema Logo" />
        <h3>F-Cinema</h3>
      </header>
      <p>Experience cinema like never before with the latest blockbusters and timeless classics in state-of-the-art theaters.</p>
      <SocialLinks />
    </section>
  );
};

export default FooterLogo;
