import type { BookingSeat, BookingUser } from "@/interfaces/booking.interface";
import { formatVND } from "@/utils/currency.utils";
import React from "react";

type DisplaySeatType = "standard" | "vip" | "double";

interface PaymentInfoProps {
  user: BookingUser;
  selectedSeats: BookingSeat[];
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ user, selectedSeats = [] }) => {
  const groupedSeats = selectedSeats.reduce(
    (acc, seat) => {
      // Map database SeatType to display type
      let displayType: DisplaySeatType;
      if (seat.type === "VIP") {
        displayType = "vip";
      } else if (seat.type === "COUPLE") {
        displayType = "double";
      } else {
        displayType = "standard"; // REGULAR, PATH treated as standard
      }

      if (!acc[displayType]) {
        acc[displayType] = [];
      }
      acc[displayType].push(seat.name); // Use seat name (e.g., "A1", "B2")
      return acc;
    },
    {} as Record<DisplaySeatType, string[]>,
  );

  const getPricePerSeat = (type: DisplaySeatType) => {
    if (type === "vip") return 90000;
    if (type === "double") return 150000;
    return 75000;
  };

  return (
    <div className="space-y-4">
      <h3 className="border-l-4 border-red-600 pl-3 text-lg font-bold">THÔNG TIN THANH TOÁN</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <span className="font-semibold">Họ tên:</span> {user.fullName}
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
              <p className="text-sm text-gray-500">{seats.join(", ")}</p>
            </div>
            <p className="font-semibold">{`${seats.length} x ${formatVND(getPricePerSeat(type as DisplaySeatType))}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentInfo;
