import type { components } from "@/schema-from-be";

export type SeatStatus = "AVAILABLE" | "MAINTENANCE";
export type SeatTypeEnum = "COUPLE" | "PATH" | "REGULAR" | "VIP" | "BLOCK";
export type SeatBookingStatus = "AVAILABLE" | "MAINTENANCE" | "BOOKED" | "RESERVED";

// API Response seat entity
export type Seat = Omit<Required<components["schemas"]["SeatResponse"]>, "linkSeatId"> & {
  linkSeatId?: number | null;
  selected?: boolean;
  discarded?: boolean;
};

export type SeatType = components["schemas"]["SeatTypeResponse"];

// Database seat entity - matches the 'seat' table in database (legacy)
export interface DatabaseSeat {
  id: string;
  name: string;
  seat_type_id: number;
  column: string;
  row: string;
  status: SeatStatus;
  type: SeatTypeEnum;
  cinema_room_id: string;
  seat_link_id?: string;
}

export interface SeatRequest {
  name: string;
  seat_type_id: number;
  column: string;
  row: string;
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

// Seat booking relation for booking system
export interface SeatBookingRelation {
  id: string;
  seatId: string; // Reference to seat.id
  bookingId: string; // Reference to booking.id
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}

export interface SeatMap {
  gridData: Seat[];
  roomId: number;
}
