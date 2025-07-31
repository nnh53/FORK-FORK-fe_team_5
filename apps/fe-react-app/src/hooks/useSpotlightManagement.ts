import type { Movie } from "@/interfaces/movies.interface";
import { queryMoviesForTrending, transformMoviesResponse } from "@/services/movieService";
import { queryCreateSpotlights, queryGetSpotlightsOrdered, transformSpotlightsBatchToRequest } from "@/services/newSpotlightService";
import type { SpotlightMovie } from "@/services/spotlightService";
import type { components } from "@/schema-from-be";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type SpotlightResponse = components["schemas"]["SpotlightResponse"];

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

  // Use API to get current spotlights
  const spotlightsQuery = queryGetSpotlightsOrdered();

  // Mutation for creating new spotlights
  const createSpotlightsMutation = queryCreateSpotlights();

  // Convert API response to local SpotlightMovie format
  const convertApiToSpotlightMovie = useCallback((apiData: SpotlightResponse[]): SpotlightMovie[] => {
    return apiData.map((item, index) => ({
      ...item.movie,
      rank: item.order || index + 1,
      id: item.movie?.id || item.id,
    }));
  }, []);

  // Load spotlight data from API
  useEffect(() => {
    if (spotlightsQuery.data?.result) {
      const spotlightData = convertApiToSpotlightMovie(spotlightsQuery.data.result);
      setSpotlightMovies(spotlightData);
      setHasUnsavedChanges(false);
    }
    if (spotlightsQuery.error) {
      setError("Failed to load spotlight data");
    }
  }, [spotlightsQuery.data, spotlightsQuery.error, convertApiToSpotlightMovie]);

  // Initialize movies from API when data is ready (only for available movies list)
  useEffect(() => {
    try {
      if (moviesQuery.data?.result) {
        const transformedMovies = transformMoviesResponse(moviesQuery.data.result);
        setAvailableMovies(transformedMovies);
      }
      if (moviesQuery.error) {
        setError("Failed to load movies data");
      }
    } catch (error) {
      console.error("Error processing movies data:", error);
      setError("Failed to process movies data");
    }
  }, [moviesQuery.data, moviesQuery.error]);

  // Set loading state based on both queries
  useEffect(() => {
    setIsLoading(moviesQuery.isLoading || spotlightsQuery.isLoading);
  }, [moviesQuery.isLoading, spotlightsQuery.isLoading]);

  // Helper function to check if movie is in spotlight
  const isMovieInSpotlight = useCallback(
    (movieId: number): boolean => {
      return spotlightMovies.some((movie) => movie.id === movieId);
    },
    [spotlightMovies],
  );

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
      if (isMovieInSpotlight(movie.id || 0)) {
        toast.error("Movie is already in spotlight.");
        return;
      }

      const newSpotlightMovie: SpotlightMovie = {
        ...movie,
        rank: spotlightMovies.length + 1,
      };

      setSpotlightMovies((prev) => [...prev, newSpotlightMovie]);
      setHasUnsavedChanges(true);
      toast.success("Movie added to spotlight. Remember to save changes!");
    },
    [spotlightMovies, isMovieInSpotlight],
  );

  // Remove movie from spotlight list
  const handleRemoveFromSpotlight = useCallback((movieId: number) => {
    setSpotlightMovies((prev) => {
      const updated = prev.filter((movie) => movie.id !== movieId);
      // Re-rank remaining movies
      return updated.map((movie, index) => ({
        ...movie,
        rank: index + 1,
      }));
    });
    setHasUnsavedChanges(true);
    toast.success("Movie removed from spotlight. Remember to save changes!");
  }, []);

  // Handle save changes - POST new spotlight list to server
  const handleSaveChanges = useCallback(async () => {
    try {
      // Convert current spotlight movies to API format
      const spotlightRequests = transformSpotlightsBatchToRequest(
        spotlightMovies.map((movie, index) => ({
          movieId: movie.id || 0,
          order: index + 1,
        })),
      );

      // Call API to create new spotlight list
      await createSpotlightsMutation.mutateAsync({
        body: spotlightRequests,
      });

      setHasUnsavedChanges(false);
      toast.success("Spotlight changes saved successfully!");

      // Refetch spotlight data to sync with server
      spotlightsQuery.refetch();
    } catch (error) {
      console.error("Error saving spotlight data:", error);
      toast.error("Failed to save changes. Please try again.");
    }
  }, [spotlightMovies, createSpotlightsMutation, spotlightsQuery]);

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
