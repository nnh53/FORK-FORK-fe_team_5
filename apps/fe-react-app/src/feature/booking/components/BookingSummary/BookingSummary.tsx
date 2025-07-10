// src/pages/SeatSelectionPage/components/BookingSummary.tsx
import React from "react";

import type { Promotion } from "@/interfaces/promotion.interface.ts";
import { useNavigate } from "react-router-dom";
import type { MovieCardProps } from "../../../../components/movie/MovieCard.tsx";

// Interface for seats in booking context
interface BookingSelectedSeat {
  id: string;
  row: string;
  number: number;
  name: string; // Display name for the seat
  type: "standard" | "vip" | "double";
  status: "available" | "taken" | "selected";
}

interface BookingSummaryProps {
  movie: MovieCardProps;
  selection: { date: string; time: string; format: string; roomId?: string; showtimeId?: string };
  cinemaName: string;
  selectedSeats: BookingSelectedSeat[];
  totalCost: number; // This is just ticket cost
  comboCost?: number; // Add combo cost
  snackCost?: number; // Add snack cost
  pointsDiscount?: number; // Add points discount
  voucherDiscount?: number; // Add voucher discount
  promotionDiscount?: number; // Add promotion discount
  finalTotal?: number; // Add final total after all discounts
  // Navigation props
  showContinueButton?: boolean;
  selectedPromotion?: Promotion | null;
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
  snackCost = 0,
  pointsDiscount = 0,
  voucherDiscount = 0,
  promotionDiscount = 0,
  selectedPromotion = null,
  finalTotal,
  showContinueButton = false,
  showBackButton = false,
  onContinueClick,
  continueText = "TIẾP TỤC",
}) => {
  const navigate = useNavigate();

  // Calculate display values
  const subtotal = totalCost + comboCost + snackCost;
  const totalDiscounts = pointsDiscount + voucherDiscount;
  const displayTotal = finalTotal !== undefined ? finalTotal : subtotal - totalDiscounts;

  return (
    <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto rounded-lg bg-white p-6 shadow-md">
      <div className="flex gap-4">
        <img src={movie.posterUrl} alt={movie.title} className="h-auto w-24 rounded-md" />
        <div>
          <h2 className="text-xl font-bold">{movie.title}</h2>
          <p className="text-sm text-gray-600">{selection.format}</p>
        </div>
      </div>
      <div className="mt-6 space-y-3 border-t pt-4 text-sm">
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
          <span className="text-gray-500">Phòng chiếu</span>
          <span className="font-semibold">{selection.roomId ? `${selection.roomId}` : "Chưa chọn phòng"}</span>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-gray-500">Ghế ngồi</span>
          <span className="w-1/2 break-words text-right font-semibold">{selectedSeats.map((s) => s.name).join(", ")}</span>
        </div>{" "}
      </div>
      <div className="mt-6 space-y-2 border-t pt-4">
        {/* Ticket cost */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tiền vé ({selectedSeats.length} ghế):</span>
          <span className="font-semibold">{totalCost.toLocaleString("vi-VN")}VND</span>
        </div>
        {/* Combo cost */}
        {comboCost > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Combo bắp nước:</span>
            <span className="font-semibold">{comboCost.toLocaleString("vi-VN")}VND</span>
          </div>
        )}
        {/* Subtotal */}
        {(comboCost > 0 || totalDiscounts > 0) && (
          <div className="flex justify-between border-t pt-2 text-sm">
            <span className="text-gray-600">Tạm tính:</span>
            <span className="font-semibold">{subtotal.toLocaleString("vi-VN")}VND</span>
          </div>
        )}
        {/* Discounts */}
        {pointsDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Giảm từ điểm:</span>
            <span>-{pointsDiscount.toLocaleString("vi-VN")}VND</span>
          </div>
        )}
        {voucherDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Giảm từ voucher:</span>
            <span>-{voucherDiscount.toLocaleString("vi-VN")}VND</span>
          </div>
        )}{" "}
        {selectedPromotion && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Giảm từ khuyến mãi:</span>
            <span>{promotionDiscount > 0 ? `-${promotionDiscount.toLocaleString("vi-VN")}VND` : "0VND"}</span>
          </div>
        )}
        {/* Final total */}
        <div className="flex justify-between border-t pt-2 text-xl font-bold">
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
              className="w-full rounded-lg bg-gray-200 py-3 font-bold text-gray-800 transition hover:bg-gray-300"
            >
              QUAY LẠI
            </button>
          )}
          {showContinueButton && onContinueClick && (
            <button
              onClick={onContinueClick}
              className={`${showBackButton ? "w-1/2" : "w-full"} rounded-lg bg-red-600 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-50`}
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
