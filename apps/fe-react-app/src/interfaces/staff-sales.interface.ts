import type { components } from "@/schema-from-be";

export interface UIShowtime extends Omit<components["schemas"]["ShowtimeResponse"], "id"> {
  id: string;
  cinemaRoomId: string;
  date: string;
  startTime: string;
  endTime: string;
  format: string;
  availableSeats: number;
  price: number;
}

export type StaffSalesStep =
  | "movie"
  | "showtime"
  | "seats"
  | "snacks"
  | "customer"
  | "payment";

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}
