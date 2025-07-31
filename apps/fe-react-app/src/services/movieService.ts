import { type Movie } from "@/interfaces/movies.interface";
import type { components } from "@/schema-from-be";
import { $api } from "@/utils/api";
type MovieResponse = components["schemas"]["MovieResponse"];
type SpotlightResponse = components["schemas"]["SpotlightResponse"];

// React Query hooks using $api
export const queryMovies = () => {
  return $api.useQuery("get", "/movies", {});
};

// Separate hook for trending management with unique key
export const queryMoviesForTrending = () => {
  return $api.useQuery("get", "/movies", {
    queryKey: ["movies-trending-management"], // Unique query key
  });
};

// Separate hook for carousel with unique key
export const queryMoviesForCarousel = () => {
  return $api.useQuery("get", "/spotlights/ordered", {
    queryKey: ["movies-carousel"], // Unique query key
  });
};

export const queryMovie = (id: number) => {
  return $api.useQuery("get", "/movies/{id}", {
    params: { path: { id } },
  });
};

export const queryMovieSearch = () => {
  return $api.useQuery("get", "/movies");
};

export const queryMoviesByStatus = (status: "ACTIVE" | "INACTIVE" | "UPCOMING") => {
  return $api.useQuery("get", "/movies/status/{status}", {
    params: { path: { status } },
  });
};

export const queryCreateMovie = () => {
  return $api.useMutation("post", "/movies");
};

export const queryUpdateMovie = () => {
  return $api.useMutation("put", "/movies/{id}");
};

export const queryDeleteMovie = () => {
  return $api.useMutation("delete", "/movies/{id}");
};

export const queryAddCategoryToMovie = () => {
  return $api.useMutation("post", "/movies/{movieId}/categories");
};

export const queryRemoveCategoryFromMovie = () => {
  return $api.useMutation("delete", "/movies/{movieId}/categories");
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
    categoryIds: (movieResponse.categories?.map((cat) => cat.id).filter((id) => id !== undefined) as number[]) ?? [],
    description: movieResponse.description,
    status: movieResponse.status,
    poster: movieResponse.poster,
    banner: movieResponse.banner,
    // Trả về mảng rỗng thay vì null cho showtimes (backend structure mismatch)
    showtimes: [],
  };
};

export const transformMoviesResponse = (moviesResponse: MovieResponse[]): Movie[] => {
  return moviesResponse.map(transformMovieResponse);
};
export const transformSpotlightsResponse = (moviesResponse: SpotlightResponse[]): SpotlightResponse[] => {
  return moviesResponse.map(transformSpotlightResponse);
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
    categories: movie.categories ?? "",
    categoryIds: movie.categoryIds ?? [],
    description: movie.description ?? "",
    status: movie.status ?? "ACTIVE", // Use string status
    poster: movie.poster ?? "",
    banner: movie.banner ?? "",
  };
};

export const transformSpotlightResponse = (res: SpotlightResponse) => {
  return {
    id: res.movie?.id ?? 0,
    name: res.movie?.name ?? "",
    ageRestrict: res.movie?.ageRestrict ?? 13, // Default to minimum allowed age
    fromDate: res.movie?.fromDate ?? "",
    toDate: res.movie?.toDate ?? "",
    actor: res.movie?.actor ?? "",
    studio: res.movie?.studio ?? "",
    director: res.movie?.director ?? "",
    duration: res.movie?.duration ?? 0,
    trailer: res.movie?.trailer ?? "",
    categories: res.movie?.categories ?? [], // Use categoryIds instead of type
    description: res.movie?.description ?? "",
    status: res.movie?.status ?? "ACTIVE", // Use string status
    poster: res.movie?.poster ?? "",
    banner: res.movie?.banner ?? "",
    order: res.order, // <-- return this
  };
};
// Helper function to get genre label (for backward compatibility)
export const getMovieGenreLabel = (genre: string): string => {
  return genre;
};
