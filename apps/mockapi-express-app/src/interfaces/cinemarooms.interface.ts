export interface CinemaRoom {
  id: string;
  roomNumber: number;
  type: string;
  fee: number;
  capacity: number;
  status: "ACTIVE" | "MAINTENANCE" | "CLOSED";
  width: number;
  length: number;
}

export interface Seat {
  id: string;
  roomId: string;
  row: string;
  number: number;
  type: string;
  status: "AVAILABLE" | "BOOKED" | "RESERVED" | "MAINTENANCE";
}
