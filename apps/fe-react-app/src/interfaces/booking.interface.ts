// Booking interfaces based on database schema

// Enums from database
export type PaymentMethod = "CASH" | "BANKING";
export type PaymentStatus = "PENDING" | "PAID" | "CANCEL";
export type BookingStatus = "PENDING" | "SUCCESS" | "FAIL" | "CANCEL";
export type SeatStatus = "AVAILABLE" | "MAINTENANCE";
export type SeatType = "COUPLE" | "PATH" | "REGULAR" | "VIP";
export type SeatTypeName = "SINGLE" | "DOUBLE" | "PATH" | "VIP";

// User interface (simplified for booking)
export interface BookingUser {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  loyalty_point: number;
}

// Movie interface (simplified for booking)
export interface BookingMovie {
  id: number;
  name: string;
  poster: string;
  duration: number;
  age_restrict: number;
  type: string;
  version: string;
}

// Cinema Room interface (simplified for booking)
export interface BookingCinemaRoom {
  id: number;
  room_number: number;
  type: string;
  capacity: number;
}

// Showtime interface
export interface BookingShowtime {
  id: number;
  room_id: number;
  movie_id: number;
  show_date_time: Date;
  end_date_time: Date;
  status: "CANCELLED" | "COMPLETED" | "ONSCREEN" | "SCHEDULE";
  // Populated fields
  movie?: BookingMovie;
  cinema_room?: BookingCinemaRoom;
}

// Seat Type interface
export interface BookingSeatType {
  id: number;
  price: number;
  name: SeatTypeName;
}

// Seat interface for booking
export interface BookingSeat {
  id: number;
  name: string;
  seat_type_id: number;
  seat_column: string;
  seat_row: string;
  status: SeatStatus;
  type: SeatType;
  cinema_room_id: number;
  seat_link_id?: number;
  // Populated fields
  seat_type?: BookingSeatType;
  // UI fields
  bookingStatus?: "available" | "taken" | "selected";
  price?: number; // Derived from seat_type
}

// Promotion interface
export interface BookingPromotion {
  id: number;
  title: string;
  description: string;
  discount_value: number;
  min_purchase: number;
  start_time: Date;
  end_time: Date;
  status: number; // tinyint
  type: number; // tinyint
  image: string;
}

// Snack interface
export interface BookingSnack {
  id: number;
  name: string;
  description: string;
  price: number;
  category: "DRINK" | "FOOD";
  size: "SMALL" | "MEDIUM" | "LARGE";
  flavor: string;
  img: string;
  status: "AVAILABLE" | "SOLD_OUT" | "UNAVAILABLE";
}

// Combo interface
export interface BookingCombo {
  id: number;
  name: string;
  description: string;
  img: string;
  status: "AVAILABLE" | "SOLD_OUT" | "UNAVAILABLE";
  snacks?: BookingSnack[]; // From combo_snack relationship
  total_price?: number; // Calculated from snacks
}

// Booking Seat relation
export interface BookingSeatRelation {
  id: number;
  seat_id: number;
  booking_id: number;
  // Populated fields
  seat?: BookingSeat;
}

// Booking Snack relation
export interface BookingSnackRelation {
  id: number;
  snack_id: number;
  booking_id: number;
  quantity: number;
  // Populated fields
  snack?: BookingSnack;
}

// Booking Combo relation
export interface BookingComboRelation {
  id: number;
  combo_id: number;
  booking_id: number;
  quantity: number;
  // Populated fields
  combo?: BookingCombo;
}

// Main Booking interface
export interface Booking {
  id: number;
  user_id?: string;
  booking_date_time?: Date;
  showtime_id?: number;
  promotion_id?: number;
  loyalty_point_used?: number;
  total_price?: number;
  payment_method?: PaymentMethod;
  payment_status?: PaymentStatus;
  booking_status?: BookingStatus;
  pay_os_code?: string;
  staff_id?: string;

  // Populated relationships
  user?: BookingUser;
  showtime?: BookingShowtime;
  promotion?: BookingPromotion;
  booking_seats?: BookingSeatRelation[];
  booking_snacks?: BookingSnackRelation[];
  booking_combos?: BookingComboRelation[];
}

// Request interfaces for API
export interface BookingRequest {
  user_id?: string;
  showtime_id: number;
  promotion_id?: number;
  loyalty_point_used?: number;
  payment_method: PaymentMethod;
  staff_id?: string;
  // Seat IDs to book
  seat_ids: number[];
  // Snacks to book
  snacks?: Array<{
    snack_id: number;
    quantity: number;
  }>;
  // Combos to book
  combos?: Array<{
    combo_id: number;
    quantity: number;
  }>;
}

export interface BookingUpdateRequest {
  promotion_id?: number;
  loyalty_point_used?: number;
  payment_method?: PaymentMethod;
  payment_status?: PaymentStatus;
  booking_status?: BookingStatus;
  pay_os_code?: string;
}

// UI-specific interfaces for booking process
export interface BookingState {
  // Movie selection
  movie?: BookingMovie;
  showtime?: BookingShowtime;
  cinema_room?: BookingCinemaRoom;

  // Seat selection
  selectedSeats: BookingSeat[];

  // Food & Beverage selection
  selectedSnacks: Array<{
    snack: BookingSnack;
    quantity: number;
  }>;
  selectedCombos: Array<{
    combo: BookingCombo;
    quantity: number;
  }>;

  // Promotion & Payment
  selectedPromotion?: BookingPromotion;
  loyaltyPointsUsed: number;
  paymentMethod: PaymentMethod;

  // Pricing
  seatsCost: number;
  snacksCost: number;
  combosCost: number;
  promotionDiscount: number;
  loyaltyDiscount: number;
  totalCost: number;
}

// Receipt interface (mirrors booking but for completed transactions)
export interface Receipt {
  id: number;
  user_id?: string;
  booking_date_time?: Date;
  showtime_id?: number;
  promotion_id?: number;
  loyalty_point_used?: number;
  total_price?: number;
  payment_method?: PaymentMethod;
  payment_status?: PaymentStatus;
  booking_status?: BookingStatus;
  pay_os_code?: string;
  staff_id?: string;
}

// Legacy interfaces for backward compatibility
export interface Combo {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}
