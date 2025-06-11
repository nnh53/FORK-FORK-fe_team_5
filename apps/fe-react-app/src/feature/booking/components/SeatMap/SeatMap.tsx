// src/pages/SeatSelectionPage/components/SeatMap.tsx
import React from 'react';
import type { SeatType } from '../../booking-page/BookingPage.tsx';
import SeatLegend from '../SeatLegend/SeatLegend.tsx';
import Seat from '../Seat/Seat.tsx';

interface SeatMapProps {
  seatMap: { rows: string[]; seats: SeatType[] };
  selectedSeats: SeatType[];
  onSeatSelect: (seat: SeatType) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ seatMap, selectedSeats, onSeatSelect }) => {
  return (
    <div className="flex flex-col items-center">
      <SeatLegend />

      {/* Màn hình chiếu */}
      <div
        className="w-full md:w-4/5 h-2 my-6 bg-gray-300 rounded-full
                            shadow-[0_0_20px_5px_rgba(200,200,200,0.7)]"
      ></div>
      <p className="text-gray-400 text-sm mb-8">MÀN HÌNH CHIẾU</p>

      {/* Sơ đồ ghế */}
      <div className="flex flex-col gap-2 w-full">
        {seatMap.rows.map((row) => (
          <div key={row} className="flex items-center justify-center gap-2">
            <span className="w-6 text-center font-semibold text-gray-500">{row}</span>
            {seatMap.seats
              .filter((s) => s.row === row)
              .map((seat) => (
                <Seat
                  key={seat.id}
                  seatData={{ ...seat, status: selectedSeats.some((s) => s.id === seat.id) ? 'selected' : seat.status }}
                  onClick={onSeatSelect}
                />
              ))}
            <span className="w-6 text-center font-semibold text-gray-500">{row}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatMap;
