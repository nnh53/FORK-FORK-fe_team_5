import { ROUTES } from "@/routes/route.constants";
import { forwardRef } from "react";
import { Link } from "react-router-dom";
import WelcomePanel from "../WelcomePanel/WelcomePanel";

interface HeroSectionProps {
  className?: string;
}

const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(({ className }, ref) => {
  return (
    <section className={`hero-section panel ${className || ""}`} ref={ref}>
      <div className="hero-bg"></div>
      <div className="hero-content">
        <WelcomePanel />
        <button className="cta-button">
          <Link to={ROUTES.BOOKING}>Book Now</Link>
        </button>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
