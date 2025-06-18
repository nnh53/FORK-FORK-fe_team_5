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
  paymentMethod: "cash" | "card" | "momo" | "banking";
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
  paymentMethod: "cash" | "card" | "momo" | "banking";
  combos?: {
    id: string;
    quantity: number;
  }[];
  usePoints?: number;
  voucherCode?: string;
}

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
    paymentMethod: "momo",
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
    paymentMethod: "cash",
    bookingDate: new Date("2025-06-17T15:30:00"),
    customerInfo: {
      name: "Trần Thị B",
      phone: "0987654321",
      email: "tranthib@gmail.com",
    },
    createdAt: new Date("2025-06-16T09:15:00"),
    updatedAt: new Date("2025-06-16T09:15:00"),
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

  create: (data: BookingCreateRequest): Booking => {
    const newBooking: Booking = {
      id: `BK${String(bookings.length + 1).padStart(3, "0")}`,
      userId: data.userId || "GUEST",
      movieId: data.movieId,
      showtimeId: data.showtimeId,
      cinemaRoomId: data.cinemaRoomId,
      seats: data.seats,
      totalAmount: calculateTotalAmount(data),
      status: "pending",
      paymentStatus: data.paymentMethod === "cash" ? "pending" : "paid",
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

  return Math.max(total, 0);
}

function calculateDiscount(data: BookingCreateRequest): Booking["discount"] | undefined {
  if (data.usePoints && data.usePoints > 0) {
    return {
      type: "points",
      amount: data.usePoints * 1000,
      description: `Sử dụng ${data.usePoints} điểm`,
    };
  }

  if (data.voucherCode) {
    // Mock voucher discount
    return {
      type: "voucher",
      amount: 20000,
      description: `Voucher ${data.voucherCode}`,
    };
  }

  return undefined;
}
