import type { Movie } from "@/interfaces/movies.interface";

// Define SpotlightMovie interface
export interface SpotlightMovie extends Movie {
  rank: number;
}

// LocalStorage key for spotlight data
const SPOTLIGHT_STORAGE_KEY = "cinema_spotlight_movies";

// Default spotlight data (empty initially)
const DEFAULT_SPOTLIGHT_DATA: SpotlightMovie[] = [];

// Get spotlight movies from localStorage
export const getSpotlightMovies = (): SpotlightMovie[] => {
  try {
    const stored = localStorage.getItem(SPOTLIGHT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the data structure
      if (Array.isArray(parsed)) {
        return parsed.filter((movie) => movie.id && typeof movie.rank === "number");
      }
    }
    return DEFAULT_SPOTLIGHT_DATA;
  } catch (error) {
    console.error("Error reading spotlight data from localStorage:", error);
    return DEFAULT_SPOTLIGHT_DATA;
  }
};

// Save spotlight movies to localStorage
export const saveSpotlightMovies = (movies: SpotlightMovie[]): boolean => {
  try {
    // Ensure maximum 4 movies
    const limitedMovies = movies.slice(0, 4);

    // Re-rank movies to ensure proper ordering
    const rankedMovies = limitedMovies.map((movie, index) => ({
      ...movie,
      rank: index + 1,
    }));

    localStorage.setItem(SPOTLIGHT_STORAGE_KEY, JSON.stringify(rankedMovies));

    // Dispatch custom event to notify other components
    window.dispatchEvent(
      new CustomEvent("spotlightUpdated", {
        detail: rankedMovies,
      }),
    );

    return true;
  } catch (error) {
    console.error("Error saving spotlight data to localStorage:", error);
    return false;
  }
};

// Add movie to spotlight
export const addToSpotlight = (movie: Movie): boolean => {
  const currentSpotlight = getSpotlightMovies();

  // Check if movie already exists
  if (currentSpotlight.find((m) => m.id === movie.id)) {
    return false; // Movie already in spotlight
  }

  // Check if we have space (max 4 movies)
  if (currentSpotlight.length >= 4) {
    return false; // Spotlight is full
  }

  const newSpotlightMovie: SpotlightMovie = {
    ...movie,
    rank: currentSpotlight.length + 1,
  };

  const updatedSpotlight = [...currentSpotlight, newSpotlightMovie];
  return saveSpotlightMovies(updatedSpotlight);
};

// Remove movie from spotlight
export const removeFromSpotlight = (movieId: number): boolean => {
  const currentSpotlight = getSpotlightMovies();
  const updatedSpotlight = currentSpotlight.filter((movie) => movie.id !== movieId);
  return saveSpotlightMovies(updatedSpotlight);
};

// Update spotlight movie order
export const updateSpotlightOrder = (movies: SpotlightMovie[]): boolean => {
  return saveSpotlightMovies(movies);
};

// Clear all spotlight movies
export const clearSpotlight = (): boolean => {
  try {
    localStorage.removeItem(SPOTLIGHT_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent("spotlightUpdated", {
        detail: [],
      }),
    );
    return true;
  } catch (error) {
    console.error("Error clearing spotlight data:", error);
    return false;
  }
};

// Initialize spotlight with default movies (if empty and movies provided)
export const initializeSpotlight = (availableMovies: Movie[]): boolean => {
  const currentSpotlight = getSpotlightMovies();

  // Only initialize if spotlight is empty
  if (currentSpotlight.length === 0 && availableMovies.length > 0) {
    // Take first 4 movies that have trailers (preferred) or just first 4
    const moviesWithTrailers = availableMovies.filter((movie) => movie.trailer);
    const moviesToUse = moviesWithTrailers.length >= 4 ? moviesWithTrailers.slice(0, 4) : availableMovies.slice(0, 4);

    const initialSpotlight: SpotlightMovie[] = moviesToUse.map((movie, index) => ({
      ...movie,
      rank: index + 1,
    }));

    return saveSpotlightMovies(initialSpotlight);
  }

  return false; // No initialization needed
};

// Get spotlight movie by rank
export const getSpotlightMovieByRank = (rank: number): SpotlightMovie | null => {
  const spotlight = getSpotlightMovies();
  return spotlight.find((movie) => movie.rank === rank) || null;
};

// Check if movie is in spotlight
export const isMovieInSpotlight = (movieId: number): boolean => {
  const spotlight = getSpotlightMovies();
  return spotlight.some((movie) => movie.id === movieId);
};

