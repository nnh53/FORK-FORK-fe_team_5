import type { SpotlightRequest, SpotlightResponse } from "@/interfaces/spolight.interface";
import { $api } from "@/utils/api";

// React Query hooks using $api (following movieService.ts pattern)
export const queryGetAllSpotlights = () => {
  return $api.useQuery("get", "/spotlights", {});
};

export const queryGetSpotlightsOrdered = () => {
  return $api.useQuery("get", "/spotlights/ordered", {
    queryKey: ["spotlights-ordered"],
  });
};

export const queryGetSpotlight = (id: number) => {
  return $api.useQuery("get", "/spotlights/{id}", {
    params: { path: { id } },
  });
};

export const queryCreateSpotlights = () => {
  return $api.useMutation("post", "/spotlights");
};

export const queryDeleteSpotlight = () => {
  return $api.useMutation("delete", "/spotlights/{id}");
};

// Legacy function for backward compatibility
export const queryMoviesForCarousel = () => {
  return $api.useQuery("get", "/spotlights/ordered", {
    queryKey: ["movies-carousel"],
  });
};

// Utility functions to transform API responses
export const transformSpotlightsResponse = (moviesResponse: SpotlightResponse[]): SpotlightResponse[] => {
  return moviesResponse.map(transformSpotlightResponse);
};

export const transformSpotlightResponse = (res: SpotlightResponse) => {
  return {
    id: res.movie?.id ?? 0,
    name: res.movie?.name ?? "",
    ageRestrict: res.movie?.ageRestrict ?? 13,
    fromDate: res.movie?.fromDate ?? "",
    toDate: res.movie?.toDate ?? "",
    actor: res.movie?.actor ?? "",
    studio: res.movie?.studio ?? "",
    director: res.movie?.director ?? "",
    duration: res.movie?.duration ?? 0,
    trailer: res.movie?.trailer ?? "",
    categories: res.movie?.categories ?? [],
    description: res.movie?.description ?? "",
    status: res.movie?.status ?? "ACTIVE",
    poster: res.movie?.poster ?? "",
    banner: res.movie?.banner ?? "",
    order: res.order,
  };
};

// Helper function to create spotlight request
export const transformSpotlightToRequest = (movieId: number, order: number): SpotlightRequest => {
  return {
    movieId,
    order,
  };
};

// Helper function to create multiple spotlight requests
export const transformSpotlightsBatchToRequest = (spotlights: Array<{ movieId: number; order: number }>): SpotlightRequest[] => {
  return spotlights.map(({ movieId, order }) => transformSpotlightToRequest(movieId, order));
};
