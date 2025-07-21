import { Icon } from "@iconify/react";
import React from "react";

const SeatLegend: React.FC = () => (
  <div className="mt-6 flex flex-wrap justify-center gap-4">
    <div className="flex items-center gap-2">
      <div className="h-4 w-4 rounded border border-blue-300 bg-blue-100"></div>
      <span className="text-sm">Ghế thường</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="h-4 w-4 rounded border border-yellow-300 bg-yellow-100"></div>
      <span className="text-sm">Ghế VIP</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="h-4 w-8 rounded border border-purple-300 bg-purple-100"></div>
      <span className="text-sm">Ghế đôi</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="flex h-4 w-4 items-center justify-center rounded border border-gray-200 bg-gray-50">
        <Icon icon="mdi:walk" className="h-3 w-3 text-gray-400" />
      </div>
      <span className="text-sm">Lối đi</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="flex h-4 w-4 items-center justify-center rounded border border-red-300 bg-red-100">
        <Icon icon="mdi:close" className="h-3 w-3 text-red-500" />
      </div>
      <span className="text-sm">Chặn</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="h-4 w-4 rounded bg-red-500"></div>
      <span className="text-sm">Đã đặt</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="h-4 w-4 rounded bg-green-500"></div>
      <span className="text-sm">Đã chọn</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="relative h-4 w-4 rounded border border-gray-300 bg-gray-100 opacity-50">
        <Icon icon="mdi:wrench" className="absolute right-0 top-0 h-2 w-2 text-orange-600" style={{ transform: "translate(25%, -25%)" }} />
      </div>
      <span className="text-sm">Bảo trì</span>
    </div>
  </div>
);

export default SeatLegend;
