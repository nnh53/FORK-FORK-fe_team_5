import type { components } from "@/schema-from-be";

export enum MovieStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  UPCOMING = "UPCOMING",
}

export enum MovieVersion {
  "2D" = "2D",
  "3D" = "3D",
  "4D" = "4D",
  IMAX = "IMAX",
}

export enum MovieGenre {
  ACTION = "ACTION",
  COMEDY = "COMEDY",
  DRAMA = "DRAMA",
  HORROR = "HORROR",
  SCIENCE = "SCIENCE",
  THRILLER = "THRILLER",
  ROMANCE = "ROMANCE",
  FANTASY = "FANTASY",
  CRIME = "CRIME",
}

export interface Showtime {
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

export interface Movie {
  id?: number;
  name?: string;
  ageRestrict?: number; // Required: Must be between 13-18 (backend constraint)
  fromDate?: string;
  toDate?: string;
  actor?: string;
  studio?: string;
  director?: string;
  duration?: number;
  trailer?: string;
  categories?: { id?: number; name?: string; description?: string }[]; // New categories field
  categoryIds?: number[]; // For form submission
  description?: string;
  status?: string; // Changed from enum to string
  poster?: string;
  showtimes?: Showtime[]; // Mảng rỗng, không null
}

export interface MovieFormData extends Movie {
  posterFile?: File;
}

export interface MovieHistory {
  receiptId: string;
  movieName: string;
  room: string;
  movieSlot: string;
  seats: string[];
  points: number;
}

export interface MovieSearchParams {
  search?: string;
  genre?: string;
  status?: "now-showing" | "coming-soon" | "all";
  page?: number;
  limit?: number;
}

export interface MovieSearchResponse {
  movies: Movie[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}

// API Movie interfaces from backend schema
export type ApiMovie = components["schemas"]["MovieResponse"];

export type ApiMovieCategory = components["schemas"]["MovieCategoryResponse"];

export type ApiShowtime = components["schemas"]["ShowtimeResponse"];
