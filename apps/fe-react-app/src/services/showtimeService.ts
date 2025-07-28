import { type Showtime, type ShowtimeFormData } from "@/interfaces/showtime.interface";
import type { components } from "@/schema-from-be";
import { $api } from "@/utils/api";
type ShowtimeResponse = components["schemas"]["ShowtimeResponse"];

// React Query hooks using $api - dựa trên API documentation thực tế
export const queryShowtimes = () => {
  return $api.useQuery("get", "/showtimes", {});
};

export const queryShowtime = (id: number) => {
  return $api.useQuery("get", "/showtimes/{id}", {
    params: { path: { id } },
  });
};

export const queryShowtimesByMovie = (movieId: number) => {
  return $api.useQuery("get", "/showtimes/movie/{movieId}", {
    params: { path: { movieId } },
  });
};

import type { UseQueryOptions } from "@tanstack/react-query";

export const queryShowtimesByRoom = (
  roomId: number,
  options?: Omit<UseQueryOptions<any, any, any, any>, "queryKey" | "queryFn">,
) => {
  return $api.useQuery(
    "get",
    "/showtimes/room/{roomId}",
    {
      params: { path: { roomId } },
    },
    options,
  );
};

export const queryShowtimeSeats = (showtimeId: number) => {
  return $api.useQuery("get", "/seats/showtime/{showtimeId}", {
    params: { path: { showtimeId } },
  });
};

export const queryCreateShowtime = () => {
  return $api.useMutation("post", "/showtimes");
};

export const queryUpdateShowtime = () => {
  return $api.useMutation("put", "/showtimes/{id}");
};

export const queryDeleteShowtime = () => {
  return $api.useMutation("delete", "/showtimes/{id}");
};

// Utility functions to transform API responses to Showtime interface
export const transformShowtimeResponse = (showtimeResponse: ShowtimeResponse): Showtime => {
  return {
    id: showtimeResponse.id ?? 0,
    movieId: showtimeResponse.movieId ?? 0,
    roomId: showtimeResponse.roomId ?? 0,
    roomName: showtimeResponse.roomName ?? "",
    showDateTime: showtimeResponse.showDateTime ?? "",
    endDateTime: showtimeResponse.endDateTime ?? "",
    status: showtimeResponse.status ?? "SCHEDULE",
  };
};

export const transformShowtimesResponse = (showtimesResponse: ShowtimeResponse[]): Showtime[] => {
  return showtimesResponse.map(transformShowtimeResponse);
};

// Utility function to transform Showtime to backend format
export const transformShowtimeToRequest = (showtime: ShowtimeFormData | Showtime) => {
  return {
    movieId: showtime.movieId,
    roomId: showtime.roomId,
    showDateTime: showtime.showDateTime,
    endDateTime: showtime.endDateTime,
    ...(showtime.status && { status: showtime.status }),
  };
};

// Helper functions for form data preparation
export const prepareCreateShowtimeData = (data: ShowtimeFormData) => {
  return transformShowtimeToRequest(data);
};

export const prepareUpdateShowtimeData = (data: ShowtimeFormData | Showtime) => {
  return transformShowtimeToRequest(data);
};
