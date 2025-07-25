import type { BookingUser } from "@/interfaces/booking.interface";
import { formatVND } from "@/utils/currency.utils";
import React from "react";

type DisplaySeatType = "standard" | "vip" | "double";

// Interface for selected seat with price information
interface SelectedSeatWithPrice {
  id: string;
  row: string;
  number: number;
  name: string;
  type: "standard" | "vip" | "double";
  price: number;
  status: "selected";
}

interface PaymentInfoProps {
  user: BookingUser;
  selectedSeats: SelectedSeatWithPrice[];
  roomFee?: number; // Add room fee prop
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ user, selectedSeats = [], roomFee = 0 }) => {
  const groupedSeats = selectedSeats.reduce(
    (acc, seat) => {
      // seat.type is already mapped to display type in BookingPage
      const displayType: DisplaySeatType = seat.type;

      if (!acc[displayType]) {
        acc[displayType] = { seats: [], price: seat.price };
      }
      acc[displayType].seats.push(seat.name); // Use seat name (e.g., "A1", "B2")
      return acc;
    },
    {} as Record<DisplaySeatType, { seats: string[]; price: number }>,
  );

  return (
    <div className="space-y-4">
      <h3 className="border-l-4 border-red-600 pl-3 text-lg font-bold">THÔNG TIN THANH TOÁN</h3>
      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
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
        {Object.entries(groupedSeats).map(([type, seatGroup]) => (
          <div key={type} className="flex items-center justify-between border-t pt-2">
            <div>
              <p className="font-semibold capitalize">{`Ghế ${type === "standard" ? "thường" : type}`}</p>
              <p className="text-xs text-gray-500">{seatGroup.seats.join(", ")}</p>
            </div>
            <p className="font-semibold">{`${seatGroup.seats.length} x ${formatVND(seatGroup.price + roomFee)}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentInfo;
