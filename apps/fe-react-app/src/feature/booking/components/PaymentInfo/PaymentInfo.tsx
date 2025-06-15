import React from "react";
// ++ XÓA BỎ: import { useLocation } from "react-router-dom";
import type { SeatType } from "../../booking-page/BookingPage.tsx";

interface PaymentInfoProps {
  user: {
    name: string;
    phone: string;
    email: string;
  };
  selectedSeats: SeatType[];
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ user, selectedSeats = [] }) => {
  const groupedSeats = selectedSeats.reduce(
    (acc, seat) => {
      const key = seat.type;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(seat.id);
      return acc;
    },
    {} as Record<SeatType["type"], string[]>,
  );

  const getPricePerSeat = (type: SeatType["type"]) => {
    if (type === "vip") return 90000;
    if (type === "double") return 150000;
    return 75000;
  };

  return (
    <div className="space-y-4">
      <h3 className="border-l-4 border-red-600 pl-3 text-lg font-bold">THÔNG TIN THANH TOÁN</h3>
      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
        <div>
          <span className="font-semibold">Họ tên:</span> {user.name}
        </div>
        <div>
          <span className="font-semibold">Số điện thoại:</span> {user.phone}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user.email}
        </div>
      </div>
      <div className="space-y-2 text-sm">
        {Object.entries(groupedSeats).map(([type, seats]) => (
          <div key={type} className="flex items-center justify-between border-t pt-2">
            <div>
              <p className="font-semibold capitalize">{`Ghế ${type === "standard" ? "thường" : type}`}</p>
              <p className="text-xs text-gray-500">{seats.join(", ")}</p>
            </div>
            <p className="font-semibold">{`${seats.length} x ${getPricePerSeat(type as SeatType["type"]).toLocaleString("vi-VN")}đ`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentInfo;
