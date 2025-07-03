import { forwardRef } from "react";

interface ParallaxSectionProps {
  className?: string;
}

const ParallaxSection = forwardRef<HTMLElement, ParallaxSectionProps>(({ className }, ref) => {
  return (
    <section className={`parallax-section ${className || ""}`} ref={ref}>
      <div className="parallax-layer" data-depth="0.1"></div>
      <div className="parallax-layer" data-depth="0.2"></div>
      <div className="parallax-layer" data-depth="0.3"></div>
      <div className="parallax-content">
        <h2
          style={{
            background: "linear-gradient(to right, #946b38, #392819)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            fontWeight: "800",
          }}
        >
          The Ultimate Movie Experience
        </h2>
        <p>Feel the magic of cinema</p>
      </div>
    </section>
  );
});

ParallaxSection.displayName = "ParallaxSection";

export default ParallaxSection;
