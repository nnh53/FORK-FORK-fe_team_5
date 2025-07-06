// Shared types for staff sales components

export interface UIShowtime {
  id: string;
  movieId: number;
  cinemaRoomId: string;
  date: string;
  startTime: string;
  endTime: string;
  format: string;
  availableSeats: number;
  price: number;
}

export type StaffSalesStep = "movie" | "showtime" | "seats" | "snacks" | "customer" | "payment";

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}
