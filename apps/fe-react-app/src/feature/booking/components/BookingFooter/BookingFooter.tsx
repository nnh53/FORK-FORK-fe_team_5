// src/pages/SeatSelectionPage/components/BookingFooter.tsx
import type { BookingSeat } from "@/interfaces/booking.interface";
import { formatVND } from "@/utils/currency.utils.ts";
import React, { useEffect, useState } from "react";

interface BookingFooterProps {
  selectedSeats: BookingSeat[];
  totalCost: number;
}

// Thời gian giữ ghế (ví dụ: 10 phút)
const HOLD_TIME_SECONDS = 10 * 60;

const BookingFooter: React.FC<BookingFooterProps> = ({ selectedSeats, totalCost }) => {
  const [remainingTime, setRemainingTime] = useState(HOLD_TIME_SECONDS);

  useEffect(() => {
    if (selectedSeats.length > 0) {
      setRemainingTime(HOLD_TIME_SECONDS);

      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setRemainingTime(HOLD_TIME_SECONDS);
    }
  }, [selectedSeats.length]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  // Đếm số lượng từng loại ghế
  const seatCounts = selectedSeats.reduce(
    (acc, seat) => {
      // Map database SeatType to display type
      let displayType: "standard" | "vip" | "double";
      if (seat.type === "VIP") {
        displayType = "vip";
      } else if (seat.type === "COUPLE") {
        displayType = "double";
      } else {
        displayType = "standard"; // REGULAR, PATH treated as standard
      }

      acc[displayType] = (acc[displayType] || 0) + 1;
      return acc;
    },
    {} as Record<"standard" | "vip" | "double", number>,
  );

  return (
    <div className="mt-8 grid grid-cols-2 items-center gap-4 border-t border-gray-200 p-4 md:grid-cols-4">
      {/* Các loại ghế */}
      <div className="grid grid-cols-3 gap-2 md:col-span-2">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-t-md bg-gray-200"></div>
          <div>
            <p className="text-xs text-gray-500">Ghế thường</p>
            <p className="font-bold">{seatCounts.standard || 0}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-t-md bg-yellow-400"></div>
          <div>
            <p className="text-xs text-gray-500">Ghế VIP</p>
            <p className="font-bold">{seatCounts.vip || 0}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-10 rounded-t-md bg-pink-400"></div>
          <div>
            <p className="text-xs text-gray-500">Ghế đôi</p>
            <p className="font-bold">{seatCounts.double || 0}</p>
          </div>
        </div>
      </div>

      {/* Tổng tiền */}
      <div className="text-center">
        <p className="text-sm text-gray-500">Tổng tiền</p>
        <p className="text-xl font-bold text-red-600">{formatVND(totalCost, 0, "đ")}</p>
      </div>

      {/* Thời gian còn lại */}
      <div className="text-center">
        <p className="text-sm text-gray-500">Thời gian còn lại</p>
        <p className="text-xl font-bold">{formatTime(remainingTime)}</p>
      </div>
    </div>
  );
};

export default BookingFooter;
