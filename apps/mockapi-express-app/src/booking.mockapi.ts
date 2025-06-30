import { Booking, BookingCombo, BookingPromotion, BookingRequest, BookingSnack } from "../../fe-react-app/src/interfaces/booking.interface.ts";

// Mock data theo database schema
let bookings: Booking[] = [
  {
    id: 1,
    user_id: "USER001",
    booking_date_time: new Date("2025-06-16T19:00:00"),
    showtime_id: 1,
    promotion_id: 1,
    loyalty_point_used: 50,
    total_price: 200000,
    payment_method: "BANKING",
    payment_status: "PAID",
    booking_status: "SUCCESS",
    pay_os_code: "PAY001",
    staff_id: undefined,
  },
  {
    id: 2,
    user_id: "USER002",
    booking_date_time: new Date("2025-06-17T15:30:00"),
    showtime_id: 2,
    promotion_id: undefined,
    loyalty_point_used: 0,
    total_price: 120000,
    payment_method: "CASH",
    payment_status: "PENDING",
    booking_status: "PENDING",
    pay_os_code: undefined,
    staff_id: undefined,
  },
  {
    id: 3,
    user_id: "USER003",
    booking_date_time: new Date("2025-06-19T20:00:00"),
    showtime_id: 3,
    promotion_id: 2,
    loyalty_point_used: 100,
    total_price: 180000,
    payment_method: "CASH",
    payment_status: "PENDING",
    booking_status: "SUCCESS",
    pay_os_code: undefined,
    staff_id: "STAFF001",
  },
  {
    id: 4,
    user_id: "USER004",
    booking_date_time: new Date("2025-06-19T18:30:00"),
    showtime_id: 4,
    promotion_id: undefined,
    loyalty_point_used: 0,
    total_price: 100000,
    payment_method: "BANKING",
    payment_status: "PAID",
    booking_status: "SUCCESS",
    pay_os_code: "PAY002",
    staff_id: undefined,
  },
];

// Mock snacks data theo database schema
export const availableSnacks: BookingSnack[] = [
  {
    id: 1,
    name: "Bắp rang bơ",
    description: "Bắp rang bơ thơm ngon",
    price: 25000,
    category: "FOOD",
    size: "MEDIUM",
    flavor: "Bơ",
    img: "https://via.placeholder.com/100x100",
    status: "AVAILABLE",
  },
  {
    id: 2,
    name: "Coca Cola",
    description: "Nước ngọt có ga",
    price: 20000,
    category: "DRINK",
    size: "LARGE",
    flavor: "Cola",
    img: "https://via.placeholder.com/100x100",
    status: "AVAILABLE",
  },
  {
    id: 3,
    name: "Kẹo bông gòn",
    description: "Kẹo bông gòn ngọt ngào",
    price: 15000,
    category: "FOOD",
    size: "SMALL",
    flavor: "Dâu",
    img: "https://via.placeholder.com/100x100",
    status: "AVAILABLE",
  },
];

// Mock combos data theo database schema
export const availableCombos: BookingCombo[] = [
  {
    id: 1,
    name: "Combo Bắp Nước",
    description: "1 Bắp rang bơ + 1 Nước ngọt",
    img: "https://via.placeholder.com/100x100",
    status: "AVAILABLE",
    total_price: 45000,
  },
  {
    id: 2,
    name: "Combo Couple",
    description: "2 Bắp rang bơ + 2 Nước ngọt",
    img: "https://via.placeholder.com/100x100",
    status: "AVAILABLE",
    total_price: 90000,
  },
  {
    id: 3,
    name: "Combo Family",
    description: "3 Bắp rang bơ + 3 Nước ngọt + 1 Kẹo",
    img: "https://via.placeholder.com/100x100",
    status: "AVAILABLE",
    total_price: 150000,
  },
];

// Mock promotions data theo database schema
export const availablePromotions: BookingPromotion[] = [
  {
    id: 1,
    title: "Giảm giá 10%",
    description: "Giảm 10% cho đơn hàng từ 200k",
    discount_value: 0.1,
    min_purchase: 200000,
    start_time: new Date("2025-06-01T00:00:00"),
    end_time: new Date("2025-06-30T23:59:59"),
    status: 1,
    type: 1,
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 2,
    title: "Giảm 50k",
    description: "Giảm 50k cho hóa đơn từ 300k",
    discount_value: 50000,
    min_purchase: 300000,
    start_time: new Date("2025-06-15T00:00:00"),
    end_time: new Date("2025-07-15T23:59:59"),
    status: 1,
    type: 2,
    image: "https://via.placeholder.com/300x200",
  },
];

// Booking API functions
export const bookingAPI = {
  getAll: () => bookings,

  getById: (id: number) => bookings.find((booking) => booking.id === id),

  getByUserId: (userId: string) => bookings.filter((booking) => booking.user_id === userId),

  getByUserPhone: (phone: string) => {
    // This would need to be implemented with a join to user table in real API
    // For now, just return empty array
    return [];
  },

  create: (data: BookingRequest): Booking => {
    const newBooking: Booking = {
      id: bookings.length + 1,
      user_id: data.user_id,
      booking_date_time: new Date(),
      showtime_id: data.showtime_id,
      promotion_id: data.promotion_id,
      loyalty_point_used: data.loyalty_point_used || 0,
      total_price: calculateTotalAmount(data),
      payment_method: data.payment_method,
      payment_status: data.payment_method === "CASH" ? "PENDING" : "PAID",
      booking_status: data.staff_id ? "SUCCESS" : "PENDING",
      pay_os_code: undefined,
      staff_id: data.staff_id,
    };

    bookings.push(newBooking);
    return newBooking;
  },

  update: (id: number, data: Partial<Booking>): Booking | null => {
    const index = bookings.findIndex((booking) => booking.id === id);
    if (index === -1) return null;

    bookings[index] = {
      ...bookings[index],
      ...data,
    };

    return bookings[index];
  },

  delete: (id: number): Booking | null => {
    const index = bookings.findIndex((booking) => booking.id === id);
    if (index === -1) return null;

    const deletedBooking = bookings[index];
    bookings.splice(index, 1);
    return deletedBooking;
  },

  confirmBooking: (id: number): Booking | null => {
    return bookingAPI.update(id, {
      booking_status: "SUCCESS",
      payment_status: "PAID",
    });
  },

  cancelBooking: (id: number): Booking | null => {
    return bookingAPI.update(id, {
      booking_status: "CANCEL",
      payment_status: "CANCEL",
    });
  },

  // Get available combos
  getCombos: () => availableCombos,

  // Get available snacks
  getSnacks: () => availableSnacks,

  // Get available promotions
  getPromotions: () => availablePromotions,
};

// Helper functions
function calculateTotalAmount(data: BookingRequest): number {
  // Base ticket price (sẽ được tính dựa trên seat_type và showtime)
  const ticketPrice = 100000;
  let total = data.seat_ids.length * ticketPrice;

  // Add combo prices
  if (data.combos) {
    for (const combo of data.combos) {
      const comboData = availableCombos.find((c) => c.id === combo.combo_id);
      if (comboData && comboData.total_price) {
        total += comboData.total_price * combo.quantity;
      }
    }
  }

  // Add snack prices
  if (data.snacks) {
    for (const snack of data.snacks) {
      const snackData = availableSnacks.find((s) => s.id === snack.snack_id);
      if (snackData) {
        total += snackData.price * snack.quantity;
      }
    }
  }

  // Apply loyalty point discount (1 point = 1000 VND)
  if (data.loyalty_point_used) {
    total -= data.loyalty_point_used * 1000;
  }

  // Apply promotion discount
  if (data.promotion_id) {
    const promotion = availablePromotions.find((p) => p.id === data.promotion_id);
    if (promotion && total >= promotion.min_purchase) {
      if (promotion.type === 1) {
        // Percentage discount
        total = total * (1 - promotion.discount_value);
      } else if (promotion.type === 2) {
        // Fixed amount discount
        total -= promotion.discount_value;
      }
    }
  }

  return Math.max(total, 0);
}
