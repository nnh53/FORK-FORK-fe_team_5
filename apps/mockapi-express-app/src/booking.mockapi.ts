import { Booking, BookingCreateRequest, PaymentMethod } from "@interfaces/booking.interface.ts";
import { membersAPI } from "./members.mockapi.ts";
import { vouchersAPI } from "./vouchers.mockapi.ts";

// Mock data
let bookings: Booking[] = [
  {
    id: "BK001",
    userId: "USER001",
    movieId: "1",
    showtimeId: "ST001",
    cinemaRoomId: "ROOM001",
    seats: ["A1", "A2"],
    totalAmount: 200000,
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: PaymentMethod.MOMO,
    bookingDate: new Date("2025-06-16T19:00:00"),
    customerInfo: {
      name: "Nguyễn Văn A",
      phone: "0123456789",
      email: "nguyenvana@gmail.com",
    },
    combos: [
      {
        id: "COMBO001",
        name: "Combo Bắp Nước",
        price: 50000,
        quantity: 1,
      },
    ],
    createdAt: new Date("2025-06-15T10:30:00"),
    updatedAt: new Date("2025-06-15T10:30:00"),
  },
  {
    id: "BK002",
    userId: "USER002",
    movieId: "2",
    showtimeId: "ST002",
    cinemaRoomId: "ROOM002",
    seats: ["B5"],
    totalAmount: 120000,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: PaymentMethod.CASH,
    bookingDate: new Date("2025-06-17T15:30:00"),
    customerInfo: {
      name: "Trần Thị B",
      phone: "0987654321",
      email: "tranthib@gmail.com",
    },
    createdAt: new Date("2025-06-16T09:15:00"),
    updatedAt: new Date("2025-06-16T09:15:00"),
  },
  // Add more test data for confirmed bookings
  {
    id: "BK003",
    userId: "USER003",
    movieId: "3",
    showtimeId: "ST003",
    cinemaRoomId: "ROOM001",
    seats: ["C1", "C2"],
    totalAmount: 180000,
    status: "confirmed",
    paymentStatus: "pending", // Need payment
    paymentMethod: PaymentMethod.CASH,
    bookingDate: new Date("2025-06-19T20:00:00"),
    customerInfo: {
      name: "Lê Văn C",
      phone: "0555123456", // Member phone
      email: "levanc@gmail.com",
    },
    combos: [
      {
        id: "COMBO002",
        name: "Combo Couple",
        price: 90000,
        quantity: 1,
      },
    ],
    createdAt: new Date("2025-06-18T14:20:00"),
    updatedAt: new Date("2025-06-18T14:20:00"),
  },
  {
    id: "BK004",
    userId: "USER004",
    movieId: "1",
    showtimeId: "ST004",
    cinemaRoomId: "ROOM002",
    seats: ["D5"],
    totalAmount: 100000,
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: PaymentMethod.MOMO,
    bookingDate: new Date("2025-06-19T18:30:00"),
    customerInfo: {
      name: "Phạm Thị D",
      phone: "0987654321", // Another member phone
      email: "phamthid@gmail.com",
    },
    createdAt: new Date("2025-06-18T16:45:00"),
    updatedAt: new Date("2025-06-18T16:45:00"),
  },
];

// Mock combo data for booking
export const availableCombos = [
  {
    id: "COMBO001",
    name: "Combo Bắp Nước",
    description: "1 Bắp rang bơ + 1 Nước ngọt",
    price: 50000,
    image: "https://via.placeholder.com/100x100",
  },
  {
    id: "COMBO002",
    name: "Combo Couple",
    description: "2 Bắp rang bơ + 2 Nước ngọt",
    price: 90000,
    image: "https://via.placeholder.com/100x100",
  },
  {
    id: "COMBO003",
    name: "Combo Family",
    description: "3 Bắp rang bơ + 3 Nước ngọt + 1 Kẹo",
    price: 150000,
    image: "https://via.placeholder.com/100x100",
  },
];

// Booking API functions
export const bookingAPI = {
  getAll: () => bookings,

  getById: (id: string) => bookings.find((booking) => booking.id === id),

  getByUserId: (userId: string) => bookings.filter((booking) => booking.userId === userId),

  getByPhone: (phone: string) => bookings.filter((booking) => booking.customerInfo.phone === phone),
  create: (data: BookingCreateRequest): Booking => {
    const newBooking: Booking = {
      id: `BK${String(bookings.length + 1).padStart(3, "0")}`,
      userId: data.userId || "GUEST",
      movieId: data.movieId,
      showtimeId: data.showtimeId,
      cinemaRoomId: data.cinemaRoomId,
      seats: data.seats,
      totalAmount: calculateTotalAmount(data),
      status: data.isStaffBooking ? "confirmed" : "pending", // Staff bookings are auto-confirmed
      paymentStatus: data.paymentMethod === PaymentMethod.CASH ? "pending" : "paid",
      paymentMethod: data.paymentMethod,
      bookingDate: new Date(),
      customerInfo: data.customerInfo,
      combos: data.combos?.map((combo) => {
        const comboData = availableCombos.find((c) => c.id === combo.id);
        return {
          id: combo.id,
          name: comboData?.name || "Unknown Combo",
          price: comboData?.price || 0,
          quantity: combo.quantity,
        };
      }),
      discount: calculateDiscount(data),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Process member points deduction
    if (data.memberId && data.usePoints && data.usePoints > 0) {
      membersAPI.updatePoints(data.memberId, data.usePoints, "redeem", `Sử dụng điểm cho booking ${newBooking.id}`);
    }

    // Process voucher usage
    if (data.voucherCode) {
      vouchersAPI.applyVoucher(data.voucherCode, newBooking.id);
    }

    bookings.push(newBooking);
    return newBooking;
  },

  update: (id: string, data: Partial<Booking>): Booking | null => {
    const index = bookings.findIndex((booking) => booking.id === id);
    if (index === -1) return null;

    bookings[index] = {
      ...bookings[index],
      ...data,
      updatedAt: new Date(),
    };

    return bookings[index];
  },

  delete: (id: string): Booking | null => {
    const index = bookings.findIndex((booking) => booking.id === id);
    if (index === -1) return null;

    const deletedBooking = bookings[index];
    bookings.splice(index, 1);
    return deletedBooking;
  },

  confirmBooking: (id: string): Booking | null => {
    return bookingAPI.update(id, {
      status: "confirmed",
      paymentStatus: "paid",
    });
  },

  cancelBooking: (id: string): Booking | null => {
    return bookingAPI.update(id, {
      status: "cancelled",
      paymentStatus: "refunded",
    });
  },
};

// Helper functions
function calculateTotalAmount(data: BookingCreateRequest): number {
  // Base ticket price (assuming 100,000 VND per seat)
  const ticketPrice = 100000;
  let total = data.seats.length * ticketPrice;

  // Add combo prices
  if (data.combos) {
    for (const combo of data.combos) {
      const comboData = availableCombos.find((c) => c.id === combo.id);
      if (comboData) {
        total += comboData.price * combo.quantity;
      }
    }
  }

  // Apply point discount (1 point = 1000 VND)
  if (data.usePoints) {
    total -= data.usePoints * 1000;
  }

  // Apply voucher discount
  if (data.voucherCode) {
    const voucherResult = vouchersAPI.validateVoucher(data.voucherCode, total, data.movieId);
    if (voucherResult.isValid) {
      total -= voucherResult.discount;
    }
  }

  return Math.max(total, 0);
}

function calculateDiscount(data: BookingCreateRequest): Booking["discount"] | undefined {
  let totalDiscount = 0;
  const discounts: string[] = [];

  // Points discount
  if (data.usePoints && data.usePoints > 0) {
    totalDiscount += data.usePoints * 1000;
    discounts.push(`${data.usePoints} điểm`);
  }

  // Voucher discount
  if (data.voucherCode) {
    const subtotal =
      data.seats.length * 100000 +
      (data.combos?.reduce((sum, combo) => {
        const comboData = availableCombos.find((c) => c.id === combo.id);
        return sum + (comboData ? comboData.price * combo.quantity : 0);
      }, 0) || 0);

    const voucherResult = vouchersAPI.validateVoucher(data.voucherCode, subtotal - (data.usePoints || 0) * 1000, data.movieId);
    if (voucherResult.isValid) {
      totalDiscount += voucherResult.discount;
      discounts.push(`voucher ${data.voucherCode}`);
    }
  }

  if (totalDiscount > 0) {
    return {
      type: data.voucherCode ? "voucher" : "points",
      amount: totalDiscount,
      description: `Giảm từ ${discounts.join(" và ")}`,
    };
  }

  return undefined;
}
