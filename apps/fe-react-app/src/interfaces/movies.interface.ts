export enum MovieStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum MovieVersion {
  TWO_D = "2D",
  THREE_D = "3D",
  IMAX = "IMAX",
  FOUR_DX = "4DX",
}

export interface MovieGenre {
  id: string;
  name: string;
}

export interface CinemaRoom {
  id: string;
  name: string;
}

export interface Showtime {
  id: string;
  cinemaRoomId: string;
  startTime: string;
  endTime: string;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  genres?: MovieGenre[]; // For multiple genres (checkbox)
  director: string;
  actors?: string;
  releaseYear: number;
  startShowingDate?: string;
  endShowingDate?: string;
  productionCompany: string;
  duration: number; // in minutes
  rating: number; // 1-10
  description: string;
  poster: string;
  trailerUrl?: string;
  status: MovieStatus;
  version: MovieVersion;
  showtimes?: Showtime[];
  createdAt: string;
  updatedAt: string;
}

export interface MovieFormData extends Omit<Movie, "id" | "createdAt" | "updatedAt"> {
  id?: string;
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
