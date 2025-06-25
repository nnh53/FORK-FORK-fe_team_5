import { forwardRef } from "react";
import WelcomePanel from "./components/WelcomePanel";
import "./HeroSection.css";

interface HeroSectionProps {
  className?: string;
}

const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(({ className }, ref) => {
  return (
    <section className={`hero-section panel ${className || ""}`} ref={ref}>
      <div className="hero-bg"></div>
      <div className="hero-content">
        <WelcomePanel />

      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
