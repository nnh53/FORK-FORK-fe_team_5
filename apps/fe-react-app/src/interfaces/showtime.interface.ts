export interface Showtime {
  id: string;
  movie_id: string;
  room_Id: string;
  show_date_time: string;
  show_end_time: string;
  status: ShowtimeStatus;
}

export type ShowtimeStatus = "SCHEDULE" | "ONSCREEN" | "COMPLETE";
