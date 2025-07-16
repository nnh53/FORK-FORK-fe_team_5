import type { components } from "@/schema-from-be";

export type MovieCategory = components["schemas"]["MovieCategoryResponse"];

export type MovieCategoryFormData = components["schemas"]["MovieCategoryRequest"];

export interface MovieCategorySearchParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface MovieCategorySearchResponse {
  categories: MovieCategory[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}
