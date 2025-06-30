// src/pages/SeatSelectionPage/components/SeatMap.tsx
import type { BookingSeat } from "@/interfaces/booking.interface";
import React from "react";
import Seat from "../Seat/Seat.tsx";

interface SeatMapProps {
  seatMap: { rows: string[]; seats: BookingSeat[] };
  selectedSeats: BookingSeat[];
  onSeatSelect: (seat: BookingSeat) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ seatMap, selectedSeats, onSeatSelect }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Màn hình chiếu */}
      <div
        className="w-full md:w-4/5 h-2 my-6 bg-base-300 rounded-full
                            shadow-[0_0_20px_5px_rgba(0,0,0,0.1)]"
      ></div>
      <p className="text-base-content/60 text-sm mb-8">MÀN HÌNH CHIẾU</p>

      {/* Sơ đồ ghế */}
      <div className="flex flex-col gap-2 w-full">
        {seatMap.rows.map((row) => (
          <div key={row} className="flex items-center justify-center gap-2">
            <span className="w-6 text-center font-semibold text-base-content/70">{row}</span>
            {seatMap.seats
              .filter((s) => s.seat_row === row)
              .map((seat) => {
                // Check if seat is selected
                const isSelected = selectedSeats.some((s) => s.id === seat.id);

                return (
                  <Seat
                    key={seat.id}
                    seatData={{
                      ...seat,
                      bookingStatus: isSelected ? "selected" : seat.bookingStatus || "available",
                    }}
                    onClick={onSeatSelect}
                  />
                );
              })}
            <span className="w-6 text-center font-semibold text-base-content/70">{row}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatMap;
