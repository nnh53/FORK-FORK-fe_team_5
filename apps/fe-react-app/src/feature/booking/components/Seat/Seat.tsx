import type { BookingSeat } from "@/interfaces/booking.interface";
import React from "react";

interface SeatProps {
  seatData: BookingSeat;
  onClick: (seat: BookingSeat) => void;
}

const Seat: React.FC<SeatProps> = ({ seatData, onClick }) => {
  const getSeatClass = () => {
    const baseClass = "w-7 h-7 rounded-t-md text-xs font-bold flex items-center justify-center cursor-pointer transition-colors duration-200";

    // Check booking status first (UI state)
    if (seatData.bookingStatus === "taken") {
      return `${baseClass} bg-error text-error-content cursor-not-allowed`;
    }
    if (seatData.bookingStatus === "selected") {
      return `${baseClass} bg-primary text-primary-content`;
    }

    // Check if seat is in maintenance
    if (seatData.status === "MAINTENANCE") {
      return `${baseClass} bg-gray-400 text-gray-600 cursor-not-allowed`;
    }

    // Available seats - check database seat type
    if (seatData.type === "VIP") {
      return `${baseClass} bg-warning text-warning-content hover:bg-warning/80`;
    }
    if (seatData.type === "COUPLE") {
      return `${baseClass} w-16 bg-secondary text-secondary-content hover:bg-secondary/80`;
    }
    return `${baseClass} bg-base-300 text-base-content hover:bg-base-200`;
  };

  const isDisabled = seatData.bookingStatus === "taken" || seatData.status === "MAINTENANCE";

  // Extract seat number from name (e.g., "A1" -> "1", "B10" -> "10")
  const getSeatNumber = () => {
    const match = seatData.name.match(/\d+/);
    return match ? match[0] : seatData.name;
  };

  return (
    <button className={getSeatClass()} onClick={() => !isDisabled && onClick(seatData)} disabled={isDisabled} aria-label={`Ghế ${seatData.name}`}>
      {getSeatNumber()}
    </button>
  );
};

export default Seat;
