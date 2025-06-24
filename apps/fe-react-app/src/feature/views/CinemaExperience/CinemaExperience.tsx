import { forwardRef } from "react";
import { ChairGrid, ExperienceText } from "./components";
import "./styles/CinemaExperience.css";

interface CinemaExperienceProps {
  className?: string;
}

const CinemaExperience = forwardRef<HTMLElement, CinemaExperienceProps>(({ className }, ref) => {
  return (
    <section className={`experience-section ${className || ""}`} ref={ref}>
      <div className="experience-content">
        <ExperienceText />
        <ChairGrid />
      </div>
    </section>
  );
});

CinemaExperience.displayName = "CinemaExperience";

export default CinemaExperience;
