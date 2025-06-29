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
      return `${baseClass} bg-error text-error-content cursor-not-allowed`;
    }
    if (seatData.status === "selected") {
      return `${baseClass} bg-primary text-primary-content`;
    }

    // Available seats
    if (seatData.type === "vip") {
      return `${baseClass} bg-warning text-warning-content hover:bg-warning/80`;
    }
    if (seatData.type === "double") {
      return `${baseClass} w-16 bg-secondary text-secondary-content hover:bg-secondary/80`;
    }
    return `${baseClass} bg-base-300 text-base-content hover:bg-base-200`;
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
