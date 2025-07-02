export type SeatStatus = "AVAILABLE" | "MAINTENANCE";
export type SeatTypeEnum = "COUPLE" | "PATH" | "REGULAR" | "VIP" | "AISLE" | "BLOCKED";
export type BookingStatus = "AVAILABLE" | "MAINTENANCE" | "BOOKED" | "RESERVED";

// Database seat entity - matches the real API response structure
export interface Seat {
  id: number;
  name: string;
  roomId: number;
  row: string;
  column: string;
  status: SeatStatus;
  type: SeatType;
  discarded: boolean;
  seatLinkId?: number | null;
}

export interface SeatType {
  id: number;
  price: number;
  name: SeatTypeEnum;
  seatCount: number;
}

// Legacy interface for backward compatibility (DB-aligned version)
export interface SeatLegacy {
  id: string;
  name: string;
  seat_type_id: number;
  seat_column: string;
  seat_row: string;
  status: SeatStatus;
  type: SeatTypeEnum;
  cinema_room_id: string;
  seat_link_id?: string;
}

export interface SeatRequest {
  name: string;
  roomId: number;
  row: string;
  column: string;
  status: SeatStatus;
  type: SeatType;
  seatLinkId?: number | null;
}

export interface SeatUpdateRequest {
  name?: string;
  roomId?: number;
  row?: string;
  column?: string;
  status?: SeatStatus;
  type?: SeatType;
  seatLinkId?: number | null;
}

// Seat booking status for booking system
export interface BookingSeat {
  id: string;
  seatId: number; // Reference to seat.id (now number)
  bookingId: string; // Reference to booking.id
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}

export interface SeatMap {
  gridData: Seat[];
  roomId: number; // Changed to number to match API
}
