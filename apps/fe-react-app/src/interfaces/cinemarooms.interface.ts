import type { components } from "@/schema-from-be";
import type { Seat, SeatMap } from "./seat.interface";

// Cinema room interface matching the real API response
export type CinemaRoom = Omit<components["schemas"]["CinemaRoomResponse"], "seats"> & {
  seats: Seat[];
};

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
