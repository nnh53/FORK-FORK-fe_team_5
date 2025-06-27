export enum ShowtimeStatus {
  SCHEDULE = "SCHEDULE",
  ONSCREEN = "ONSCREEN",
  COMPLETE = "COMPLETE",
}

export interface Showtime {
  showtime_id: string;
  movie_id: string;
  room_id: string;
  show_date_time: string;
  show_end_time: string;
  status: ShowtimeStatus;
}

export type ShowtimeFormData = Omit<Showtime, "showtime_id">;
