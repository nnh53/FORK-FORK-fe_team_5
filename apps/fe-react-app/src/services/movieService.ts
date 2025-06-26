import { MovieGenre, MovieStatus, MovieVersion, type Movie, type MovieSearchParams } from "@/interfaces/movies.interface";
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

export const useMovieSearch = (params: MovieSearchParams) => {
  const queryParams = new URLSearchParams();

  if (params.search) queryParams.append("search", params.search);
  if (params.genre) queryParams.append("genre", params.genre);
  if (params.status) queryParams.append("status", params.status);
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());

  return $api.useQuery("get", "/movies/search", {
    params: { query: Object.fromEntries(queryParams) },
  });
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

// Helper function to map backend status to MovieStatus enum
const mapStatus = (status?: string): MovieStatus => {
  if (!status) return MovieStatus.ACTIVE;
  const statusUpper = status.toUpperCase();
  if (statusUpper === "ACTIVE") return MovieStatus.ACTIVE;
  if (statusUpper === "INACTIVE") return MovieStatus.INACTIVE;
  if (statusUpper === "UPCOMING") return MovieStatus.UPCOMING;
  return MovieStatus.ACTIVE;
};

// Helper function to map backend version to MovieVersion enum
const mapVersion = (version?: string): MovieVersion | undefined => {
  if (!version) return undefined;
  const versionUpper = version.toUpperCase();
  if (versionUpper === "2D") return MovieVersion["2D"];
  if (versionUpper === "3D") return MovieVersion["3D"];
  if (versionUpper === "4D") return MovieVersion["4D"];
  if (versionUpper === "IMAX") return MovieVersion.IMAX;
  return undefined;
};

// Helper function to map backend type to MovieGenre enum
const mapGenre = (type?: string): MovieGenre | undefined => {
  if (!type) return undefined;
  const typeUpper = type.toUpperCase();
  if (typeUpper === "ACTION") return MovieGenre.ACTION;
  if (typeUpper === "COMEDY") return MovieGenre.COMEDY;
  if (typeUpper === "DRAMA") return MovieGenre.DRAMA;
  if (typeUpper === "HORROR") return MovieGenre.HORROR;
  if (typeUpper === "SCIENCE") return MovieGenre.SCIENCE;
  if (typeUpper === "THRILLER") return MovieGenre.THRILLER;
  if (typeUpper === "ROMANCE") return MovieGenre.ROMANCE;
  if (typeUpper === "FANTASY") return MovieGenre.FANTASY;
  if (typeUpper === "CRIME") return MovieGenre.CRIME;
  return undefined;
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
    version: mapVersion(movieResponse.version),
    trailer: movieResponse.trailer,
    type: mapGenre(movieResponse.type),
    description: movieResponse.description,
    status: mapStatus(movieResponse.status),
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
    version: movie.version ?? MovieVersion["2D"], // Use enum value
    trailer: movie.trailer ?? "",
    type: movie.type ?? MovieGenre.ACTION, // Use enum value, default to ACTION
    description: movie.description ?? "",
    status: movie.status ?? MovieStatus.ACTIVE, // Use enum value
    poster: movie.poster ?? "",
  };
};

// Utility functions for working with enums
export const movieStatusOptions = [
  { value: MovieStatus.ACTIVE, label: "Active" },
  { value: MovieStatus.INACTIVE, label: "Inactive" },
  { value: MovieStatus.UPCOMING, label: "Upcoming" },
];

export const movieVersionOptions = [
  { value: MovieVersion["2D"], label: "2D" },
  { value: MovieVersion["3D"], label: "3D" },
  { value: MovieVersion["4D"], label: "4D" },
  { value: MovieVersion.IMAX, label: "IMAX" },
];

export const movieGenreOptions = [
  { value: MovieGenre.ACTION, label: "Action" },
  { value: MovieGenre.COMEDY, label: "Comedy" },
  { value: MovieGenre.DRAMA, label: "Drama" },
  { value: MovieGenre.HORROR, label: "Horror" },
  { value: MovieGenre.SCIENCE, label: "Science" },
  { value: MovieGenre.THRILLER, label: "Thriller" },
  { value: MovieGenre.ROMANCE, label: "Romance" },
  { value: MovieGenre.FANTASY, label: "Fantasy" },
  { value: MovieGenre.CRIME, label: "Crime" },
];

// Helper functions to check enum values
export const isValidMovieStatus = (status: string): status is MovieStatus => {
  return Object.values(MovieStatus).includes(status as MovieStatus);
};

export const isValidMovieVersion = (version: string): version is MovieVersion => {
  return Object.values(MovieVersion).includes(version as MovieVersion);
};

export const isValidMovieGenre = (genre: string): genre is MovieGenre => {
  return Object.values(MovieGenre).includes(genre as MovieGenre);
};

// Helper functions to get enum labels
export const getMovieStatusLabel = (status: MovieStatus): string => {
  switch (status) {
    case MovieStatus.ACTIVE:
      return "Active";
    case MovieStatus.INACTIVE:
      return "Inactive";
    case MovieStatus.UPCOMING:
      return "Upcoming";
    default:
      return "Unknown";
  }
};

export const getMovieVersionLabel = (version: MovieVersion): string => {
  switch (version) {
    case MovieVersion["2D"]:
      return "2D";
    case MovieVersion["3D"]:
      return "3D";
    case MovieVersion["4D"]:
      return "4D";
    case MovieVersion.IMAX:
      return "IMAX";
    default:
      return "Unknown";
  }
};

export const getMovieGenreLabel = (genre: MovieGenre): string => {
  switch (genre) {
    case MovieGenre.ACTION:
      return "Action";
    case MovieGenre.COMEDY:
      return "Comedy";
    case MovieGenre.DRAMA:
      return "Drama";
    case MovieGenre.HORROR:
      return "Horror";
    case MovieGenre.SCIENCE:
      return "Science";
    case MovieGenre.THRILLER:
      return "Thriller";
    case MovieGenre.ROMANCE:
      return "Romance";
    case MovieGenre.FANTASY:
      return "Fantasy";
    case MovieGenre.CRIME:
      return "Crime";
    default:
      return "Unknown";
  }
};
