// Booking interfaces based on database schema
import type { SeatStatus, SeatTypeEnum } from "./seat.interface";

// Enums from database - use internal names to avoid conflicts
export type PaymentMethod = "CASH" | "ONLINE"; // Updated to match API
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED"; // Updated to match API
export type BookingStatus = "PENDING" | "SUCCESS" | "CANCELLED"; // Updated to match API
export type BookingSeatStatus = "AVAILABLE" | "MAINTENANCE";
export type BookingSeatTypeEnum = "COUPLE" | "PATH" | "REGULAR" | "VIP";
export type SeatTypeName = "SINGLE" | "DOUBLE" | "PATH" | "VIP";

// User interface (simplified for booking)
export type BookingUser = components["schemas"]["UserResponse"];

// Movie interface (simplified for booking)
export type BookingMovie = components["schemas"]["MovieResponse"];

// Cinema Room interface (simplified for booking)
export type BookingCinemaRoom = components["schemas"]["CinemaRoomResponse"];

// Showtime interface
export type BookingShowtime = components["schemas"]["ShowtimeResponse"];

// Seat Type interface
export type BookingSeatType = components["schemas"]["SeatTypeResponse"];

// Seat interface for booking
export interface BookingSeat {
  id: number;
  name: string;
  seat_type_id: number;
  seat_column: string;
  seat_row: string;
  status: SeatStatus;
  type: SeatTypeEnum;
  cinema_room_id: number;
  seat_link_id?: number;
  // Populated fields
  seat_type?: BookingSeatType;
  // UI fields
  bookingStatus?: "available" | "taken" | "selected";
  price?: number; // Derived from seat_type
}

// Promotion interface
export type BookingPromotion = components["schemas"]["PromotionResponse"];

// Snack interface
export type BookingSnack = components["schemas"]["SnackResponse"];

// Combo interface
export type BookingCombo = components["schemas"]["ComboResponse"];

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
export type Booking = components["schemas"]["BookingResponse"];

// Request interfaces for API
export type BookingRequest = components["schemas"]["BookingRequest"];

export type BookingUpdateRequest = components["schemas"]["BookingUpdate"];

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


// API Booking interfaces (from OpenAPI schema)
import type { components } from "@/schema-from-be";

// Booking Combo Response from API
export type ApiBookingCombo = components["schemas"]["BookingComboResponse"];

// Booking Snack Response from API
export type ApiBookingSnack = components["schemas"]["BookingSnackResponse"];

// Main API Booking interface matching the real API
export type ApiBooking = components["schemas"]["BookingResponse"];

// Booking Request for creating bookings
export type ApiBookingRequest = components["schemas"]["BookingRequest"];

// Booking Update Request
export type ApiBookingUpdate = components["schemas"]["BookingUpdate"];
