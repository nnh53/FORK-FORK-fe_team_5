// Database-aligned seat interfaces for FCinema

// Database enums to match schema
export type SeatStatus = "AVAILABLE" | "MAINTENANCE";
export type SeatType = "COUPLE" | "PATH" | "REGULAR" | "VIP";
export type SeatTypeName = "SINGLE" | "DOUBLE" | "PATH" | "PATH_VIP";
export type BookingStatus = "AVAILABLE" | "MAINTENANCE" | "BOOKED" | "RESERVED";

// Database seat entity - matches the 'seat' table in database
export interface DatabaseSeat {
  id: string; // Primary key
  name: string; // Seat name/identifier
  seat_type_id: number; // Foreign key to seat_type table
  seat_column: string; // Column identifier (A, B, C, etc.)
  seat_row: string; // Row identifier (1, 2, 3, etc.)
  status: SeatStatus; // Database enum: status_available_maintenance_t
  type: SeatType; // Database enum: type_couple_path_regular_vip_t
  cinema_room_id: string; // Foreign key to cinema_room
  seat_link_id?: string; // Self-reference for linked seats (couple seats)
}

// Database seat type entity - matches the 'seat_type' table
export interface DatabaseSeatType {
  id: number; // Primary key
  price: number; // Seat price
  name: SeatTypeName; // Database enum: name_single_double_path_path_vip_t
}

// Frontend seat representation for seat map grid
export interface SeatMapSeat {
  id: string;
  row: string; // seat_row from database
  column: string; // seat_column from database
  seatTypeId: number; // seat_type_id from database
  roomId: string; // cinema_room_id from database
  status: BookingStatus; // Include booking statuses
  type: SeatType; // From database
  linkedSeatId?: string; // seat_link_id from database
  price?: number; // From seat_type table
  seatTypeName?: SeatTypeName; // From seat_type table
}

// Seat creation/update request
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

// Seat update request (partial)
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

// Transformed seat for frontend display
export interface DisplaySeat extends SeatMapSeat {
  displayRow: string; // Formatted row for display (A, B, C...)
  displayColumn: string; // Formatted column for display (1, 2, 3...)
  isSelected?: boolean;
  isAvailable: boolean;
  formattedPrice: string; // Formatted price with currency
}
