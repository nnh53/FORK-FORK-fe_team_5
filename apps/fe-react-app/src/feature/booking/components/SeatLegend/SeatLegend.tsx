import React from "react";

const LegendItem: React.FC<{ color: string; label: string; icon?: string }> = ({ color, label, icon }) => (
  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className={`w-6 h-6 rounded-t-md shadow-sm ${color} flex items-center justify-center text-xs font-bold relative`}>
      {icon && <span className="text-white">{icon}</span>}
      {color.includes("gradient") && <div className="absolute top-0 right-0 w-2 h-2 bg-white opacity-30 rounded-full"></div>}
    </div>
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </div>
);

const SeatLegend: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h3 className="text-center text-gray-600 font-semibold mb-4 text-sm tracking-wide">📋 CHÚ THÍCH</h3>
      <div className="flex flex-wrap justify-center gap-3">
        <LegendItem color="bg-gradient-to-b from-gray-100 to-gray-300" label="Ghế trống" icon="S" />
        <LegendItem color="bg-gradient-to-b from-blue-400 to-blue-600" label="Ghế đang chọn" icon="✓" />
        <LegendItem color="bg-gradient-to-b from-red-400 to-red-600" label="Ghế đã bán" icon="✕" />
        <LegendItem color="bg-gradient-to-b from-yellow-300 to-yellow-500" label="Ghế VIP" icon="V" />
        <LegendItem color="bg-gradient-to-b from-pink-300 to-pink-500 w-12" label="Ghế đôi" icon="D" />
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">
          <div className="w-3 h-6 bg-gradient-to-b from-gray-100 to-gray-200 rounded-full shadow-inner"></div>
          <span className="text-sm font-medium text-gray-700">Lối đi</span>
        </div>
        <LegendItem color="bg-gradient-to-b from-gray-500 to-gray-600" label="Khu vực cấm" icon="🚫" />
      </div>
    </div>
  );
};

export default SeatLegend;
