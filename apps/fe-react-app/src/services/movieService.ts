import type { Movie, MovieSearchParams, MovieSearchResponse } from "@/interfaces/movies.interface";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const movieService = {
  getAllMovies: async (): Promise<Movie[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies`);
      return response.data;
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
  },

  getMovieById: async (id: string): Promise<Movie> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching movie:", error);
      throw error;
    }
  },

  createMovie: async (movieData: Omit<Movie, "id" | "createdAt" | "updatedAt">): Promise<Movie> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/movies`, movieData);
      return response.data;
    } catch (error) {
      console.error("Error creating movie:", error);
      throw error;
    }
  },

  updateMovie: async (id: string, movieData: Partial<Omit<Movie, "id" | "createdAt">>): Promise<Movie> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/movies/${id}`, movieData);
      return response.data;
    } catch (error) {
      console.error("Error updating movie:", error);
      throw error;
    }
  },
  deleteMovie: async (id: string): Promise<Movie> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting movie:", error);
      throw error;
    }
  },

  searchMovies: async (params: MovieSearchParams = {}): Promise<MovieSearchResponse> => {
    try {
      const queryParams = new URLSearchParams();

      if (params.search) queryParams.append("search", params.search);
      if (params.genre) queryParams.append("genre", params.genre);
      if (params.status) queryParams.append("status", params.status);
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());

      const response = await axios.get(`${API_BASE_URL}/movies/search?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error searching movies:", error);
      throw error;
    }
  },

  getGenres: async (): Promise<string[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/genres`);
      return response.data;
    } catch (error) {
      console.error("Error fetching genres:", error);
      throw error;
    }
  },

  getMoviesByStatus: async (status: "now-showing" | "coming-soon"): Promise<Movie[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies?status=${status}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching movies by status:", error);
      throw error;
    }
  },
};
