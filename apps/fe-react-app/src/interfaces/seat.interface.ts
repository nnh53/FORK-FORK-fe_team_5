export type SeatStatus = "AVAILABLE" | "MAINTENANCE";
export type SeatTypeEnum = "COUPLE" | "PATH" | "REGULAR" | "VIP" | "AISLE" | "BLOCKED";
export type BookingStatus = "AVAILABLE" | "MAINTENANCE" | "BOOKED" | "RESERVED";

// Database seat entity - matches the 'seat' table in database
export interface Seat {
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

export interface SeatType {
  id: number;
  price: number;
  name: SeatTypeEnum;
}

export interface SeatRequest {
  name: string;
  seat_type_id: number;
  seat_column: string;
  seat_row: string;
  status: SeatStatus;
  type: SeatType;
  cinema_room_id: string;
  seat_link_id?: string;
}

export interface SeatUpdateRequest {
  name?: string;
  seat_type_id?: number;
  seat_column?: string;
  seat_row?: string;
  status?: SeatStatus;
  type?: SeatType;
  seat_link_id?: string;
}

// Seat booking status for booking system
export interface BookingSeat {
  id: string;
  seatId: string; // Reference to seat.id
  bookingId: string; // Reference to booking.id
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}

export interface SeatMap {
  gridData: Seat[];
  roomId: string;
}
