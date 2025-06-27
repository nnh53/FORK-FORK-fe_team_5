import type { SeatMapGrid } from "./seatmap.interface";

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

// Room status types
export type ComponentRoomStatus = "active" | "maintenance" | "closed";
export type ApiRoomStatus = "ACTIVE" | "MAINTENANCE" | "CLOSED";

// Cinema room interface with seat map integration for components
export interface CinemaRoomWithSeatMap {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: ComponentRoomStatus;
  hasSeatMap: boolean;
  seatMapData?: SeatMapGrid;
  roomNumber?: number;
  fee?: number;
  width: number;
  height: number;
}

// Alternative CinemaRoomWithSeatMap that extends base CinemaRoom
export interface CinemaRoomWithSeatMapAlt extends Omit<CinemaRoom, "status" | "length"> {
  name: string;
  status: ComponentRoomStatus;
  height: number;
  hasSeatMap: boolean;
  seatMapData?: SeatMapGrid;
}

// Create room request interface for components
export interface CreateCinemaRoomRequest {
  name: string;
  type: string;
  capacity: number;
  status: ComponentRoomStatus;
  roomNumber?: number;
  fee?: number;
  width: number;
  height: number;
}

// Create room request interface for API
export interface CreateCinemaRoomApiRequest {
  name: string;
  roomNumber: number;
  type: string;
  fee: number;
  capacity: number;
  status: ApiRoomStatus;
  width: number;
  length: number;
}

// Update room request interface for components
export interface UpdateCinemaRoomRequest {
  name?: string;
  type?: string;
  capacity?: number;
  status?: ComponentRoomStatus;
  roomNumber?: number;
  fee?: number;
  width?: number;
  height?: number;
}

// Update room request interface for API
export interface UpdateCinemaRoomApiRequest {
  name?: string;
  roomNumber?: number;
  type?: string;
  fee?: number;
  capacity?: number;
  status?: ApiRoomStatus;
  width?: number;
  length?: number;
}

// Room statistics interface
export interface RoomStats {
  total: number;
  withSeatMap: number;
  active: number;
  maintenance: number;
  closed: number;
}
