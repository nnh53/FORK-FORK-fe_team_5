import { type Movie } from "@/interfaces/movies.interface";
import type { MovieResponse } from "@/type-from-be";
import { $api } from "@/utils/api";

// React Query hooks using $api
export const useMovies = () => {
  return $api.useQuery("get", "/movies", {});
};

export const useMovie = (id: number) => {
  return $api.useQuery("get", "/movies/{id}", {
    params: { path: { id } },
  });
};

export const useMovieSearch = () => {
  // For now, we'll use the basic getAll endpoint
  // Note: Backend might need to add search parameters support
  return $api.useQuery("get", "/movies");
};

export const useCreateMovie = () => {
  return $api.useMutation("post", "/movies");
};

export const useUpdateMovie = () => {
  return $api.useMutation("put", "/movies/{id}");
};

export const useDeleteMovie = () => {
  return $api.useMutation("delete", "/movies/{id}");
};

// Utility functions to transform API responses to Movie interface
export const transformMovieResponse = (movieResponse: MovieResponse): Movie => {
  return {
    id: movieResponse.id,
    name: movieResponse.name,
    ageRestrict: movieResponse.ageRestrict,
    fromDate: movieResponse.fromDate,
    toDate: movieResponse.toDate,
    actor: movieResponse.actor,
    studio: movieResponse.studio,
    director: movieResponse.director,
    duration: movieResponse.duration,
    trailer: movieResponse.trailer,
    categories: movieResponse.categories ?? [],
    categoryIds: movieResponse.categories?.map(cat => cat.id).filter(id => id !== undefined) as number[] ?? [],
    description: movieResponse.description,
    status: movieResponse.status,
    poster: movieResponse.poster,
    // Trả về mảng rỗng thay vì null cho showtimes (backend structure mismatch)
    showtimes: [],
  };
};

export const transformMoviesResponse = (moviesResponse: MovieResponse[]): Movie[] => {
  return moviesResponse.map(transformMovieResponse);
};

// Utility function to transform Movie to backend format
export const transformMovieToRequest = (movie: Movie) => {
  return {
    name: movie.name ?? "",
    ageRestrict: movie.ageRestrict ?? 13, // Default to minimum allowed age
    fromDate: movie.fromDate ?? "",
    toDate: movie.toDate ?? "",
    actor: movie.actor ?? "",
    studio: movie.studio ?? "",
    director: movie.director ?? "",
    duration: movie.duration ?? 0,
    trailer: movie.trailer ?? "",
    categoryIds: movie.categoryIds ?? [], // Use categoryIds instead of type
    description: movie.description ?? "",
    status: movie.status ?? "ACTIVE", // Use string status
    poster: movie.poster ?? "",
  };
};

// Helper function to get genre label (for backward compatibility)
export const getMovieGenreLabel = (genre: string): string => {
  return genre;
};
