import { type MovieCategory } from "@/interfaces/movie-category.interface";
import type { components } from "@/schema-from-be";
type MovieCategoryResponse = components["schemas"]["MovieCategoryResponse"];
import { $api } from "@/utils/api";

// React Query hooks using $api
export const queryMovieCategories = () => {
  return $api.useQuery("get", "/movie-categories", {});
};

export const queryMovieCategory = (id: number) => {
  return $api.useQuery("get", "/movie-categories/{id}", {
    params: { path: { id } },
  });
};

export const queryMovieCategorySearch = () => {
  return $api.useQuery("get", "/movie-categories");
};

export const queryCreateMovieCategory = () => {
  return $api.useMutation("post", "/movie-categories");
};

export const queryUpdateMovieCategory = () => {
  return $api.useMutation("put", "/movie-categories/{id}");
};

export const queryDeleteMovieCategory = () => {
  return $api.useMutation("delete", "/movie-categories/{id}");
};

// Utility functions to transform API responses to MovieCategory interface
export const transformMovieCategoryResponse = (categoryResponse: MovieCategoryResponse): MovieCategory => {
  return {
    id: categoryResponse.id,
    name: categoryResponse.name,
    description: categoryResponse.description,
  };
};

export const transformMovieCategoriesResponse = (categoriesResponse: MovieCategoryResponse[]): MovieCategory[] => {
  return categoriesResponse.map(transformMovieCategoryResponse);
};

// Utility function to transform MovieCategory to backend format
export const transformMovieCategoryToRequest = (category: MovieCategory) => {
  return {
    name: category.name ?? "",
    description: category.description ?? "",
  };
};
