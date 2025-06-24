import React from "react";
import "./css/ChairCard.css";

interface ChairCardProps {
  imageSrc: string;
  alt: string;
  title: string;
  className?: string;
}

const ChairCard: React.FC<ChairCardProps> = ({ imageSrc, alt, title, className }) => {
  return (
    <div className={`chair-card ${className || ""}`}>
      <img src={imageSrc} alt={alt} className="chair-image" />
      <div className="chair-overlay">{title}</div>
    </div>
  );
};

export default ChairCard;
