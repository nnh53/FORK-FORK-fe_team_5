export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
  MOMO = "momo",
  BANKING = "banking",
}
export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  showtimeId: string;
  cinemaRoomId: string;
  seats: string[]; // Array of seat IDs like ["A1", "A2"]
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: PaymentMethod;
  bookingDate: Date;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
  combos?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  discount?: {
    type: "points" | "voucher" | "promotion";
    amount: number;
    description: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
export interface BookingCreateRequest {
  userId?: string;
  movieId: string;
  showtimeId: string;
  cinemaRoomId: string;
  seats: string[];
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
  paymentMethod: PaymentMethod;
  combos?: {
    id: string;
    quantity: number;
  }[];
  usePoints?: number;
  memberId?: string;
  voucherCode?: string;
  isStaffBooking?: boolean; // New field to identify staff bookings
}
export interface Combo {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}
