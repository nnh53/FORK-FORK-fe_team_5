import type { SeatMap } from "./seat.interface";

export interface CinemaRoom {
  id: string;
  roomNumber: number;
  type: string;
  fee: number;
  name: string;
  capacity: number;
  status: "ACTIVE" | "MAINTENANCE" | "CLOSED";
  width: number;
  length: number;
  seatMap: SeatMap | null; // Optional seat map, can be null if not set
}
