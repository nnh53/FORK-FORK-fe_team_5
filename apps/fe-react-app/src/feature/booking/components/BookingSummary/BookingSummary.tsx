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
  totalCost: number; // This is just ticket cost
  comboCost?: number; // Add combo cost
  pointsDiscount?: number; // Add points discount
  voucherDiscount?: number; // Add voucher discount
  finalTotal?: number; // Add final total after all discounts
  // Navigation props
  showContinueButton?: boolean;
  showBackButton?: boolean;
  onContinueClick?: () => void;
  continueText?: string;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  movie,
  selection,
  cinemaName,
  selectedSeats,
  totalCost,
  comboCost = 0,
  pointsDiscount = 0,
  voucherDiscount = 0,
  finalTotal,
  showContinueButton = false,
  showBackButton = false,
  onContinueClick,
  continueText = "TIẾP TỤC",
}) => {
  const navigate = useNavigate();

  // Calculate display values
  const subtotal = totalCost + comboCost;
  const totalDiscounts = pointsDiscount + voucherDiscount;
  const displayTotal = finalTotal !== undefined ? finalTotal : subtotal - totalDiscounts;

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
        </div>{" "}
      </div>
      <div className="mt-6 border-t pt-4 space-y-2">
        {/* Ticket cost */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tiền vé ({selectedSeats.length} ghế):</span>
          <span className="font-semibold">{totalCost.toLocaleString("vi-VN")}đ</span>
        </div>
        {/* Combo cost */}
        {comboCost > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Combo bắp nước:</span>
            <span className="font-semibold">{comboCost.toLocaleString("vi-VN")}đ</span>
          </div>
        )}
        {/* Subtotal */}
        {(comboCost > 0 || totalDiscounts > 0) && (
          <div className="flex justify-between text-sm border-t pt-2">
            <span className="text-gray-600">Tạm tính:</span>
            <span className="font-semibold">{subtotal.toLocaleString("vi-VN")}đ</span>
          </div>
        )}
        {/* Discounts */}
        {pointsDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Giảm từ điểm:</span>
            <span>-{pointsDiscount.toLocaleString("vi-VN")}đ</span>
          </div>
        )}
        {voucherDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Giảm từ voucher:</span>
            <span>-{voucherDiscount.toLocaleString("vi-VN")}đ</span>
          </div>
        )}{" "}
        {/* Final total */}
        <div className="flex justify-between text-xl font-bold border-t pt-2">
          <span>TỔNG TIỀN</span>
          <span className="text-red-600">{displayTotal.toLocaleString("vi-VN")}đ</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      {(showContinueButton || showBackButton) && (
        <div className={`mt-6 w-full ${showBackButton ? "flex items-center gap-3" : ""}`}>
          {showBackButton && (
            <button
              onClick={() => {
                // Navigate back to booking page with preserved state
                const bookingState = JSON.parse(localStorage.getItem("bookingState") || "{}");
                navigate("/booking", { state: bookingState });
              }}
              className="w-1/2 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition"
            >
              QUAY LẠI
            </button>
          )}
          {showContinueButton && onContinueClick && (
            <button
              onClick={onContinueClick}
              className={`${showBackButton ? "w-1/2" : "w-full"} py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50`}
              disabled={selectedSeats.length === 0}
            >
              {continueText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingSummary;
