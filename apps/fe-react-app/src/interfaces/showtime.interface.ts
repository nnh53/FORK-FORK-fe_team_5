export enum ShowtimeStatus {
  SCHEDULE = "SCHEDULE",
  ONSCREEN = "ONSCREEN",
  COMPLETE = "COMPLETE",
}

export interface Showtime {
  id: number;
  movieId: number;
  roomId: number | undefined; // Changed from null to undefined to match backend API
  roomName?: string; // Từ backend
  showDateTime: string; // Thay đổi từ show_date_time
  endDateTime: string; // Thay đổi từ show_end_time
  status: string; // Backend trả về string, không phải enum
}

export type ShowtimeFormData = Omit<Showtime, "id" | "roomName">;
