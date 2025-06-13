export interface CinemaRoom {
  room_id: string;
  room_number: number;
  type: string;
  fee: number;
  capacity: number;
  status: "ACTIVE" | "MAINTENANCE" | "CLOSED";
  width: number;
  length: number;
}

export interface Seat {
  seat_id: string;
  room_id: string;
  row: string;
  number: number;
  type: string;
  status: "AVAILABLE" | "BOOKED" | "RESERVED" | "MAINTENANCE";
}
