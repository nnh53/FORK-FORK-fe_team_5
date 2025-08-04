// src/pages/SeatSelectionPage/components/BookingSummary.tsx
import React from "react";

import type { Promotion } from "@/interfaces/promotion.interface.ts";
import { formatVND } from "@/utils/currency.utils.ts";
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
  selection: { date: string; time: string; format: string; roomId?: string; roomName?: string; showtimeId?: string };
  cinemaName: string;
  selectedSeats: BookingSelectedSeat[];
  totalCost: number; // This is just ticket cost
  comboCost?: number; // Add combo cost
  snackCost?: number; // Add snack cost
  pointsDiscount?: number; // Add points discount
  voucherDiscount?: number; // Add voucher discount
  promotionDiscount?: number; // Add promotion discount
  finalTotal?: number; // Add final total after all discounts
  // Detailed combo and snack information
  selectedCombos?: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  selectedSnacks?: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  // Room information
  roomType?: string;
  roomFee?: number;
  includeRoomFeeInTotal?: boolean; // If true, totalCost already includes room fee
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
  selectedCombos = [],
  selectedSnacks = [],
  roomType,
  roomFee = 0,
  includeRoomFeeInTotal = false,
  showContinueButton = false,
  showBackButton = false,
  onContinueClick,
  continueText = "TIẾP TỤC",
}) => {
  const navigate = useNavigate();

  // Calculate display values
  const subtotal = includeRoomFeeInTotal ? totalCost + comboCost + snackCost : totalCost + comboCost + snackCost + roomFee;
  const totalDiscounts = pointsDiscount + voucherDiscount;
  const displayTotal = finalTotal !== undefined ? finalTotal : subtotal - totalDiscounts;

  return (
    <div className="sticky top-16 max-h-[calc(100vh-80px)] overflow-y-auto rounded-lg bg-white p-3 shadow-md sm:top-24 sm:max-h-[calc(100vh-120px)] sm:p-4 lg:p-6">
      <div className="flex gap-3 sm:gap-4">
        <img src={movie.posterUrl} alt={movie.title} className="h-auto w-16 flex-shrink-0 rounded-md sm:w-20 lg:w-24" />
        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-2 text-base font-bold sm:text-lg lg:text-xl">{movie.title}</h2>
          <p className="text-xs text-gray-600 sm:text-sm">{selection.format}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2 border-t pt-3 text-xs sm:mt-6 sm:space-y-3 sm:pt-4 sm:text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Rạp chiếu</span>
          <span className="max-w-[60%] truncate text-right font-semibold">{cinemaName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Ngày chiếu</span>
          <span className="font-semibold">{selection.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Giờ chiếu</span>
          <span className="font-semibold">{selection.time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Phòng chiếu</span>
          <div className="text-right">
            <div className="font-semibold">{selection.roomName || `Phòng ${selection.roomId}` || "Chưa chọn phòng"}</div>
            {roomType && <div className="text-xs text-gray-500">{roomType}</div>}
          </div>
        </div>
        <div className="flex items-start justify-between">
          <span className="flex-shrink-0 text-gray-500">Ghế ngồi</span>
          <span className="w-1/2 text-right text-xs font-semibold break-words sm:text-sm">
            {selectedSeats.map((s) => s.name).join(", ") || "Chưa chọn ghế"}
          </span>
        </div>
      </div>
      <div className="mt-4 space-y-2 border-t pt-3 sm:mt-6 sm:pt-4">
        {/* Ticket cost */}
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-gray-600">
            {includeRoomFeeInTotal && roomFee > 0 ? `Tiền vé + phí phòng (${selectedSeats.length} ghế):` : `Tiền vé (${selectedSeats.length} ghế):`}
          </span>
          <span className="font-semibold">{formatVND(totalCost)}</span>
        </div>
        {/* Room fee breakdown - show details when included in total */}
        {includeRoomFeeInTotal && roomFee > 0 && selectedSeats.length > 0 && (
          <div className="pl-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>• Tiền vé:</span>
              <span>{formatVND(totalCost - roomFee * selectedSeats.length)}</span>
            </div>
            <div className="flex justify-between">
              <span>• Phí phòng ({formatVND(roomFee)}/ghế):</span>
              <span>{formatVND(roomFee * selectedSeats.length)}</span>
            </div>
          </div>
        )}
        {/* Room fee separate line - when not included in total */}
        {roomFee > 0 && !includeRoomFeeInTotal && (
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Phí phòng ({formatVND(roomFee)}/ghế):</span>
            <span className="font-semibold">{formatVND(roomFee * selectedSeats.length)}</span>
          </div>
        )}
        {/* Combo cost - detailed breakdown */}
        {selectedCombos.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-700 sm:text-sm">Combo bắp nước:</div>
            {selectedCombos.map((combo) => (
              <div key={combo.id} className="flex justify-between pl-2 text-xs sm:text-sm">
                <span className="max-w-[60%] truncate text-gray-600">
                  {combo.name} x{combo.quantity}
                </span>
                <span className="font-semibold">{formatVND(combo.price * combo.quantity)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Snack cost - detailed breakdown */}
        {selectedSnacks.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-700 sm:text-sm">Đồ ăn vặt:</div>
            {selectedSnacks.map((snack) => (
              <div key={snack.id} className="flex justify-between pl-2 text-xs sm:text-sm">
                <span className="max-w-[60%] truncate text-gray-600">
                  {snack.name} x{snack.quantity}
                </span>
                <span className="font-semibold">{formatVND(snack.price * snack.quantity)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Fallback: show total combo/snack cost if no detailed data but has cost */}
        {comboCost > 0 && selectedCombos.length === 0 && (
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Combo bắp nước:</span>
            <span className="font-semibold">{formatVND(comboCost)}</span>
          </div>
        )}
        {snackCost > 0 && selectedSnacks.length === 0 && (
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Đồ ăn vặt:</span>
            <span className="font-semibold">{formatVND(snackCost)}</span>
          </div>
        )}
        {/* Subtotal */}
        {(comboCost > 0 || snackCost > 0 || totalDiscounts > 0) && (
          <div className="flex justify-between border-t pt-2 text-xs sm:text-sm">
            <span className="text-gray-600">Tạm tính:</span>
            <span className="font-semibold">{formatVND(subtotal)}</span>
          </div>
        )}
        {/* Discounts */}
        {pointsDiscount > 0 && (
          <div className="flex justify-between text-xs text-green-600 sm:text-sm">
            <span>Giảm từ điểm:</span>
            <span>-{formatVND(pointsDiscount)}</span>
          </div>
        )}
        {voucherDiscount > 0 && (
          <div className="flex justify-between text-xs text-green-600 sm:text-sm">
            <span>Giảm từ voucher:</span>
            <span>-{formatVND(voucherDiscount)}</span>
          </div>
        )}
        {selectedPromotion && (
          <div className="flex justify-between text-xs text-green-600 sm:text-sm">
            <span>Giảm từ khuyến mãi:</span>
            <span>{promotionDiscount > 0 ? `-${formatVND(promotionDiscount)}` : "0VND"}</span>
          </div>
        )}
        {/* Final total */}
        <div className="flex justify-between border-t pt-2 text-lg font-bold sm:text-xl">
          <span>TỔNG TIỀN</span>
          <span className="text-red-600">{formatVND(displayTotal)}</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      {(showContinueButton || showBackButton) && (
        <div className={`mt-4 w-full sm:mt-6 ${showBackButton ? "flex items-center gap-2 sm:gap-3" : ""}`}>
          {showBackButton && (
            <button
              onClick={() => {
                // Navigate back to booking page with preserved state
                const bookingState = JSON.parse(localStorage.getItem("bookingState") || "{}");
                navigate("/booking", { state: bookingState });
              }}
              className="w-full rounded-lg bg-gray-200 py-2 text-sm font-bold text-gray-800 transition hover:bg-gray-300 sm:py-3 sm:text-base"
            >
              QUAY LẠI
            </button>
          )}
          {showContinueButton && onContinueClick && (
            <button
              onClick={onContinueClick}
              className={`${showBackButton ? "w-1/2" : "w-full"} rounded-lg bg-red-600 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50 sm:py-3 sm:text-base`}
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
