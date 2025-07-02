import type { Seat, SeatMap } from "./seat.interface";

// Cinema room interface matching the real API response
export interface CinemaRoom {
  id: number;
  name: string;
  type: string;
  fee: number;
  capacity: number;
  status: "ACTIVE" | "MAINTENANCE" | "CLOSED";
  width: number;
  length: number;
  seats: Seat[]; // Direct seats array from API
}

// Extended cinema room with seat map for UI components
export interface CinemaRoomWithSeatMap extends CinemaRoom {
  seatMap: SeatMap | null; // Optional seat map, can be null if not set
}

// Legacy interface for backward compatibility
export interface CinemaRoomLegacy {
  id: string;
  roomNumber: number;
  type: string;
  fee: number;
  name: string;
  capacity: number;
  status: "ACTIVE" | "MAINTENANCE" | "CLOSED";
  width: number;
  length: number;
  seatMap: SeatMap | null;
}
