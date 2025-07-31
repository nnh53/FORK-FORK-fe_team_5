import type { components } from "@/schema-from-be";
import type { Movie } from "./movies.interface";

// Backend API types from schema
export type SpotlightResponse = components["schemas"]["SpotlightResponse"];
export type SpotlightRequest = components["schemas"]["SpotlightRequest"];
export type SpotlightUpdateRequest = components["schemas"]["SpotlightUpdateRequest"];
export type ApiResponseSpotlightResponse = components["schemas"]["ApiResponseSpotlightResponse"];
export type ApiResponseListSpotlightResponse = components["schemas"]["ApiResponseListSpotlightResponse"];

// Frontend interface for spotlight movies
export interface SpotlightMovie {
  id: number;
  movie: Movie;
  order: number;
}

// Extended interface for management (backward compatibility)
export interface SpotlightMovieWithRank extends Movie {
  rank: number;
}

// Form data interface for creating/updating spotlight
export interface SpotlightFormData {
  movieId: number;
  order: number;
}

// Batch creation interface
export interface SpotlightBatchCreateData {
  spotlights: SpotlightRequest[];
}

// Management state interface
export interface SpotlightManagementState {
  spotlights: SpotlightMovie[];
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  error: string | null;
}
