import React from "react";
import type { GridCell, SelectedSeat } from "../../../../interfaces/seatmap.interface";

interface GridSeatProps {
  cell: GridCell;
  selectedSeats: SelectedSeat[];
  onSeatSelect: (cell: GridCell) => void;
}

const GridSeat: React.FC<GridSeatProps> = ({ cell, selectedSeats, onSeatSelect }) => {
  if (cell.type !== "seat") {
    // Render empty space, aisle, or blocked area
    return (
      <div className="w-7 h-7 flex items-center justify-center">
        {cell.type === "aisle" && <div className="w-3 h-full bg-gradient-to-b from-gray-100 to-gray-200 rounded-full shadow-inner"></div>}
        {cell.type === "blocked" && (
          <div className="w-7 h-7 bg-gradient-to-b from-gray-500 to-gray-600 rounded-t-md shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-red-500 opacity-20"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs">✕</div>
          </div>
        )}
      </div>
    );
  }

  // Skip rendering cells that are consumed by double seats (secondary part)
  if (cell.isConsumedByDoubleSeat || cell.seatType === "d") {
    return <div className="w-0 h-0 invisible" />;
  }

  const isSelected = selectedSeats.some((seat) => seat.gridRow === cell.row && seat.gridCol === cell.col);

  const getSeatClass = () => {
    const baseClass =
      "text-xs font-bold flex items-center justify-center cursor-pointer transition-all duration-300 rounded-t-md relative shadow-md hover:shadow-lg transform hover:-translate-y-0.5";

    // Determine width based on seat type - double seats span 2 columns
    const widthClass = cell.seatType === "D" ? "w-16" : "w-7";
    const heightClass = "h-7";

    if (cell.status === "taken") {
      return `${baseClass} ${widthClass} ${heightClass} bg-gradient-to-b from-red-400 to-red-600 text-white cursor-not-allowed shadow-inner opacity-75`;
    }

    if (isSelected || cell.status === "selected") {
      return `${baseClass} ${widthClass} ${heightClass} bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-blue-200 ring-2 ring-blue-300 ring-opacity-75`;
    }

    // Available seats with beautiful gradients
    switch (cell.seatType) {
      case "V":
        return `${baseClass} ${widthClass} ${heightClass} bg-gradient-to-b from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-gray-800 shadow-yellow-200`;
      case "D":
        return `${baseClass} ${widthClass} ${heightClass} bg-gradient-to-b from-pink-300 to-pink-500 hover:from-pink-400 hover:to-pink-600 text-gray-800 shadow-pink-200`;
      case "S":
      default:
        return `${baseClass} ${widthClass} ${heightClass} bg-gradient-to-b from-gray-100 to-gray-300 hover:from-gray-200 hover:to-gray-400 text-gray-800 shadow-gray-200`;
    }
  };

  const handleClick = () => {
    if (cell.status !== "taken" && cell.status !== "maintenance") {
      onSeatSelect(cell);
    }
  };

  return (
    <button
      className={getSeatClass()}
      onClick={handleClick}
      disabled={cell.status === "taken" || cell.status === "maintenance"}
      aria-label={`Ghế ${cell.displayRow}${cell.displayCol}`}
    >
      <span className="relative z-10">{cell.displayCol}</span>
      {/* Seat type indicator */}
      {cell.seatType === "V" && <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-600 rounded-full"></div>}
      {cell.seatType === "D" && <div className="absolute top-0 right-0 w-2 h-2 bg-pink-600 rounded-full"></div>}
    </button>
  );
};

export default GridSeat;
