// src/pages/SeatSelectionPage/components/BookingSummary.tsx
import React from "react";

import { useNavigate } from "react-router-dom";
import type { MovieCardProps } from "../../../../components/movie/MovieCard/MovieCard.tsx";
import type { SeatType } from "../../booking-page/BookingPage.tsx";

interface BookingSummaryProps {
  movie: MovieCardProps;
  selection: { date: string; time: string; format: string };
  cinemaName: string;
  selectedSeats: SeatType[];
  totalCost: number;
  actionText: string;
  onActionClick: () => void;
  showBackButton?: boolean;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  movie,
  selection,
  cinemaName,
  selectedSeats,
  totalCost,
  actionText,
  onActionClick,
  showBackButton = false,
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
      <div className="flex gap-4">
        <img src={movie.posterUrl} alt={movie.title} className="w-24 h-auto rounded-md" />
        <div>
          <h2 className="text-xl font-bold">{movie.title}</h2>
          <p className="text-sm text-gray-600">{selection.format}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3 text-sm border-t pt-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Rạp chiếu</span> <span className="font-semibold">{cinemaName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Ngày chiếu</span> <span className="font-semibold">{selection.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Giờ chiếu</span> <span className="font-semibold">{selection.time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Phòng chiếu</span> <span className="font-semibold">P1</span>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-gray-500">Ghế ngồi</span>
          <span className="font-semibold text-right w-1/2 break-words">{selectedSeats.map((s) => s.id).join(", ")}</span>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between text-xl font-bold">
          <span>TỔNG TIỀN</span>
          <span className="text-red-600">{totalCost.toLocaleString("vi-VN")}đ</span>
        </div>
      </div>

      <div className={`mt-6 w-full ${showBackButton ? "flex items-center gap-3" : ""}`}>
        {showBackButton ? (
          <>
            <button onClick={() => navigate(-1)} className="w-1/2 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition">
              QUAY LẠI
            </button>
            <button
              onClick={onActionClick}
              className="w-1/2 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50"
              disabled={selectedSeats.length === 0}
            >
              {actionText}
            </button>
          </>
        ) : (
          <button
            onClick={onActionClick}
            className="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50"
            disabled={selectedSeats.length === 0}
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingSummary;
