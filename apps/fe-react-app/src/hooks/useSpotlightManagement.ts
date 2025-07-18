import type { Movie } from "@/interfaces/movies.interface";
import { queryMoviesForTrending, transformMoviesResponse } from "@/services/movieService";
import {
  addToSpotlight as addMovieToSpotlight,
  getSpotlightMovies,
  initializeSpotlight,
  isMovieInSpotlight,
  removeFromSpotlight as removeMovieFromSpotlight,
  updateSpotlightOrder,
  type SpotlightMovie,
} from "@/services/spotlightService";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useSpotlightManagement() {
  const [spotlightMovies, setSpotlightMovies] = useState<SpotlightMovie[]>([]);
  const [availableMovies, setAvailableMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Use dedicated hook for loading all movies
  const moviesQuery = queryMoviesForTrending();

  // Load spotlight data from localStorage
  const loadSpotlightData = useCallback(() => {
    try {
      const spotlightData = getSpotlightMovies();
      setSpotlightMovies(spotlightData);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error loading spotlight data:", error);
      setError("Failed to load spotlight data");
    }
  }, []);

  // Initialize data when component mounts
  useEffect(() => {
    loadSpotlightData();
  }, [loadSpotlightData]);

  // Initialize movies from API when data is ready (only for available movies list)
  useEffect(() => {
    try {
      setIsLoading(true);
      if (moviesQuery.data?.result) {
        const transformedMovies = transformMoviesResponse(moviesQuery.data.result);
        setAvailableMovies(transformedMovies);

        // Initialize spotlight if empty or on first load
        const currentSpotlight = getSpotlightMovies();
        if (currentSpotlight.length === 0) {
          initializeSpotlight(transformedMovies);
          loadSpotlightData(); // Reload after initialization
        }
      }
      if (moviesQuery.error) {
        setError("Failed to load movies data");
      }
    } catch (error) {
      console.error("Error processing movies data:", error);
      setError("Failed to process movies data");
    } finally {
      setIsLoading(false);
    }
  }, [moviesQuery.data, moviesQuery.error, loadSpotlightData]);

  // Listen for spotlight updates from other sources (e.g., other tabs/windows)
  useEffect(() => {
    const handleSpotlightUpdate = () => {
      loadSpotlightData();
    };

    window.addEventListener("spotlightUpdated", handleSpotlightUpdate);
    return () => {
      window.removeEventListener("spotlightUpdated", handleSpotlightUpdate);
    };
  }, [loadSpotlightData]);

  // Filter available movies based on search term
  const filteredMovies = availableMovies.filter((movie) => movie.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

  // Handle drag end for reordering
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSpotlightMovies((movies) => {
        const oldIndex = movies.findIndex((movie) => (movie.id?.toString() || "") === active.id);
        const newIndex = movies.findIndex((movie) => (movie.id?.toString() || "") === over?.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(movies, oldIndex, newIndex);
          // Update the rank property based on new positions
          const rerankedMovies = newOrder.map((movie, index) => ({
            ...movie,
            rank: index + 1,
          }));

          setHasUnsavedChanges(true);
          return rerankedMovies;
        }
        return movies;
      });
    }
  }, []);

  // Add a movie to spotlight list
  const handleAddToSpotlight = useCallback(
    (movie: Movie) => {
      const success = addMovieToSpotlight(movie);
      if (success) {
        loadSpotlightData();
        setHasUnsavedChanges(true); // Adding a movie is a change
      } else {
        // Show error message
        const currentSpotlight = getSpotlightMovies();
        if (currentSpotlight.length >= 4) {
          toast.error("Spotlight is full! Maximum 4 movies allowed.");
        } else {
          toast.error("Movie is already in spotlight or an error occurred.");
        }
      }
    },
    [loadSpotlightData],
  );

  // Remove movie from spotlight list
  const handleRemoveFromSpotlight = useCallback(
    (movieId: number) => {
      const success = removeMovieFromSpotlight(movieId);
      if (success) {
        loadSpotlightData();
        setHasUnsavedChanges(true); // Removing a movie is a change
      } else {
        toast.error("Failed to remove movie from spotlight.");
      }
    },
    [loadSpotlightData],
  );

  // Handle save changes
  const handleSaveChanges = useCallback(() => {
    try {
      const success = updateSpotlightOrder(spotlightMovies);
      if (success) {
        setHasUnsavedChanges(false);
        toast.success("Spotlight changes saved successfully!");
      } else {
        toast.error("Failed to save changes. Please try again.");
      }
    } catch (error) {
      console.error("Error saving spotlight data:", error);
      toast.error("Failed to save changes. Please try again.");
    }
  }, [spotlightMovies]);

  return {
    spotlightMovies,
    availableMovies,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    isLoading,
    error,
    hasUnsavedChanges,
    filteredMovies,
    handleDragEnd,
    handleAddToSpotlight,
    handleRemoveFromSpotlight,
    handleSaveChanges,
    isMovieInSpotlight, // Expose for MovieCard
  };
}
