import React from "react";
import ChairCard from "./ChairCard";
import "./css/ChairGrid.css";

interface ChairData {
  imageSrc: string;
  alt: string;
  title: string;
}

interface ChairGridProps {
  chairs?: ChairData[];
  className?: string;
}

const defaultChairs: ChairData[] = [
  {
    imageSrc: "/images/chair/normal.png",
    alt: "Normal Chair",
    title: "Normal Chair",
  },
  {
    imageSrc: "/images/chair/vip.png",
    alt: "VIP Chair",
    title: "VIP Chair",
  },
  {
    imageSrc: "/images/chair/premium.png",
    alt: "Premium Chair",
    title: "Premium Chair",
  },
  {
    imageSrc: "/images/chair/couple.png",
    alt: "Couple Chair",
    title: "Couple Chair",
  },
];

const ChairGrid: React.FC<ChairGridProps> = ({ chairs = defaultChairs, className }) => {
  return (
    <div className={`chair-grid ${className || ""}`}>
      {chairs.map((chair) => (
        <ChairCard key={chair.alt} imageSrc={chair.imageSrc} alt={chair.alt} title={chair.title} />
      ))}
    </div>
  );
};

export default ChairGrid;

