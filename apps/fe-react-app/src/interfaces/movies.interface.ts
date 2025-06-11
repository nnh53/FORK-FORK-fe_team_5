export enum MovieStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  director: string;
  releaseYear: number;
  duration: number; // in minutes
  rating: number; // 1-10
  description: string;
  poster: string;
  status: MovieStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MovieFormData extends Omit<Movie, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

export interface MovieHistory {
  receiptId: string;
  movieName: string;
  room: string;
  movieSlot: string;
  seats: string[];
  usedPoints: number;
  availablePoints: number;
}
