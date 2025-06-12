import React from "react";

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-5 h-5 rounded-t-md ${color}`}></div>
    <span className="text-sm">{label}</span>
  </div>
);

const SeatLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
      <LegendItem color="bg-gray-200" label="Ghế trống" />
      <LegendItem color="bg-blue-500" label="Ghế đang chọn" />
      <LegendItem color="bg-red-500" label="Ghế đã bán" />
      <LegendItem color="bg-yellow-400" label="Ghế VIP" />
      <LegendItem color="bg-pink-400 w-10" label="Ghế đôi" />
    </div>
  );
};

export default SeatLegend;
