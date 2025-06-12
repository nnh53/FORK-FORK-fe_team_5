import React from "react";
import type { SeatType } from "../../booking-page/BookingPage.tsx";

interface SeatProps {
  seatData: SeatType;
  onClick: (seat: SeatType) => void;
}

const Seat: React.FC<SeatProps> = ({ seatData, onClick }) => {
  const getSeatClass = () => {
    const baseClass = "w-7 h-7 rounded-t-md text-xs font-bold flex items-center justify-center cursor-pointer transition-colors duration-200";

    if (seatData.status === "taken") {
      return `${baseClass} bg-red-500 text-white cursor-not-allowed`;
    }
    if (seatData.status === "selected") {
      return `${baseClass} bg-blue-500 text-white`;
    }

    // Available seats
    if (seatData.type === "vip") {
      return `${baseClass} bg-yellow-400 hover:bg-yellow-500`;
    }
    if (seatData.type === "double") {
      return `${baseClass} w-16 bg-pink-400 hover:bg-pink-500`;
    }
    return `${baseClass} bg-gray-200 hover:bg-gray-300`;
  };

  return (
    <button
      className={getSeatClass()}
      onClick={() => seatData.status !== "taken" && onClick(seatData)}
      disabled={seatData.status === "taken"}
      aria-label={`Ghế ${seatData.id}`}
    >
      {seatData.number}
    </button>
  );
};

export default Seat;
