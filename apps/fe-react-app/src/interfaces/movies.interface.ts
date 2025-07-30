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

export type { Showtime } from "./showtime.interface";

export type Movie = components["schemas"]["MovieResponse"] & { categoryIds?: number[] };

export type MovieFormData = components["schemas"]["MovieRequest"] & {
  posterFile?: File;
  bannerFile?: File;
};

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

export type ApiSpotlight = components["schemas"]["SpotlightResponse"];
