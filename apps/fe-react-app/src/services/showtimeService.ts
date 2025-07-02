import { type Showtime, type ShowtimeFormData } from "@/interfaces/showtime.interface";
import type { ShowtimeResponse } from "@/type-from-be";
import { $api } from "@/utils/api";

// React Query hooks using $api - dựa trên API documentation thực tế
export const useShowtimes = () => {
  return $api.useQuery("get", "/showtimes", {});
};

export const useShowtime = (id: number) => {
  return $api.useQuery("get", "/showtimes/{id}", {
    params: { path: { id } },
  });
};

export const useShowtimesByMovie = (movieId: number) => {
  return $api.useQuery("get", "/showtimes/movie/{movieId}", {
    params: { path: { movieId } },
  });
};

export const useShowtimesByRoom = (roomId: number) => {
  return $api.useQuery("get", "/showtimes/room/{roomId}", {
    params: { path: { roomId } },
  });
};

export const useShowtimeSearch = () => {
  return $api.useQuery("get", "/showtimes/search");
};

export const useShowtimeSeats = (showtimeId: number) => {
  return $api.useQuery("get", "/showtimes/seats/{showtimeId}", {
    params: { path: { showtimeId } },
  });
};

export const useCreateShowtime = () => {
  return $api.useMutation("post", "/showtimes");
};

export const useUpdateShowtime = () => {
  return $api.useMutation("put", "/showtimes/{id}");
};

export const useDeleteShowtime = () => {
  return $api.useMutation("delete", "/showtimes/{id}");
};

// Utility functions to transform API responses to Showtime interface
export const transformShowtimeResponse = (showtimeResponse: ShowtimeResponse): Showtime => {
  return {
    id: showtimeResponse.id ?? 0,
    movieId: showtimeResponse.movieId ?? 0,
    roomId: showtimeResponse.roomId, // Keep as undefined if not provided
    roomName: showtimeResponse.roomName,
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

export const prepareUpdateShowtimeData = (data: Showtime) => {
  return transformShowtimeToRequest(data);
};

// Legacy service object for backward compatibility
export const showtimeService = {
  getShowtimesByMovieId: async (movieId: string) => {
    // This function would need to be called within a component using React Query
    // For now, we'll throw an error suggesting to use the hook instead
    throw new Error("Use useShowtimesByMovie hook instead of showtimeService.getShowtimesByMovieId");
  },

  getAllShowtimes: async () => {
    throw new Error("Use useShowtimes hook instead of showtimeService.getAllShowtimes");
  },

  getShowtimeById: async (id: string) => {
    throw new Error("Use useShowtime hook instead of showtimeService.getShowtimeById");
  },
};
