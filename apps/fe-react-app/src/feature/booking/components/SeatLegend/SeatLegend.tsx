import { Icon } from "@iconify/react";
import React from "react";

const SeatLegend: React.FC = () => (
  <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs sm:mt-6 sm:gap-4 sm:text-sm">
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="h-3 w-3 rounded border border-blue-300 bg-blue-100 sm:h-4 sm:w-4"></div>
      <span>Ghế thường</span>
    </div>
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="h-3 w-3 rounded border border-yellow-300 bg-yellow-100 sm:h-4 sm:w-4"></div>
      <span>Ghế VIP</span>
    </div>
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="h-3 w-6 rounded border border-purple-300 bg-purple-100 sm:h-4 sm:w-8"></div>
      <span>Ghế đôi</span>
    </div>
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="flex h-3 w-3 items-center justify-center rounded border border-gray-200 bg-gray-50 sm:h-4 sm:w-4">
        <Icon icon="mdi:walk" className="h-2 w-2 text-gray-400 sm:h-3 sm:w-3" />
      </div>
      <span>Lối đi</span>
    </div>
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="flex h-3 w-3 items-center justify-center rounded border border-red-300 bg-red-100 sm:h-4 sm:w-4">
        <Icon icon="mdi:close" className="h-2 w-2 text-red-500 sm:h-3 sm:w-3" />
      </div>
      <span>Chặn</span>
    </div>
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="h-3 w-3 rounded bg-red-500 sm:h-4 sm:w-4"></div>
      <span>Đã đặt</span>
    </div>
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="h-3 w-3 rounded bg-green-500 sm:h-4 sm:w-4"></div>
      <span>Đã chọn</span>
    </div>
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="relative h-3 w-3 rounded border border-gray-300 bg-gray-100 opacity-50 sm:h-4 sm:w-4">
        <Icon
          icon="mdi:wrench"
          className="absolute top-0 right-0 h-1.5 w-1.5 text-orange-600 sm:h-2 sm:w-2"
          style={{ transform: "translate(25%, -25%)" }}
        />
      </div>
      <span>Bảo trì</span>
    </div>
  </div>
);

export default SeatLegend;
