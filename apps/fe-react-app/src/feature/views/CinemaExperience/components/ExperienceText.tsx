import { siteConfig } from "@/config/config";
import React from "react";
import "./css/ExperienceText.css";

interface ExperienceTextProps {
  onButtonClick?: () => void;
  className?: string;
}

const ExperienceText: React.FC<ExperienceTextProps> = ({ onButtonClick, className }) => {
  const { title, description } = siteConfig.chairSection;

  return (
    <div className={`experience-text ${className || ""}`}>
      <h2 className="experience-title">{title}</h2>
      <p className="experience-description">{description}</p>
      <button className="learn-button" onClick={onButtonClick}>
        Learn More
      </button>
    </div>
  );
};

export default ExperienceText;
