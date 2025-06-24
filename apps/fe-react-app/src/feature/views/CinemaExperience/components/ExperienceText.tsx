import React from "react";
import "./css/ExperienceText.css";

interface ExperienceTextProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

const ExperienceText: React.FC<ExperienceTextProps> = ({
  title = "Premium Cinema Experience",
  description = "Luxury seating, state-of-the-art sound systems, and crystal-clear projection technology. Our theaters are designed to provide the ultimate movie-watching experience.",
  buttonText = "Learn More",
  onButtonClick,
  className,
}) => {
  return (
    <div className={`experience-text ${className || ""}`}>
      <h2 className="experience-title">{title}</h2>
      <p className="experience-description">{description}</p>
      <button className="learn-button" onClick={onButtonClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default ExperienceText;

