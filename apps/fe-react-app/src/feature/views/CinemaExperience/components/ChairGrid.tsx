import { siteConfig } from "@/config/config";
import React from "react";
import ChairCard from "./ChairCard";
import "./css/ChairGrid.css";

interface ChairGridProps {
  className?: string;
}

const ChairGrid: React.FC<ChairGridProps> = ({ className }) => {
  const { chairs } = siteConfig.chairSection;

  return (
    <div className={`chair-grid ${className || ""}`}>
      {chairs.map((chair) => (
        <ChairCard key={chair.alt} imageSrc={chair.imageSrc} alt={chair.alt} title={chair.title} />
      ))}
    </div>
  );
};

export default ChairGrid;
