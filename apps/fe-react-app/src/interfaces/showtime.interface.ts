export interface Showtime {
  id: number;
  movieId: number;
  roomId: number;
  roomName?: string;
  showDateTime: string;
  endDateTime: string;
  status: string;
}

export type ShowtimeFormData = Omit<Showtime, "id">;
