export interface MovieCategory {
  id?: number;
  name?: string;
  description?: string;
}

export interface MovieCategoryFormData extends MovieCategory {
  isActive?: boolean;
}

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
