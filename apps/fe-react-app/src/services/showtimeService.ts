import type { Showtime } from "@/interfaces/movies.interface";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const showtimeService = {
  getAllShowtimes: async (): Promise<Showtime[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/showtimes`);
      return response.data;
    } catch (error) {
      console.error("Error fetching showtimes:", error);
      throw error;
    }
  },

  getShowtimesByMovieId: async (movieId: string): Promise<Showtime[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/showtimes?movieId=${movieId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching showtimes by movie:", error);
      throw error;
    }
  },

  getShowtimesByMovieIdAndDate: async (movieId: string, date: string): Promise<Showtime[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/showtimes?movieId=${movieId}&date=${date}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching showtimes by movie and date:", error);
      throw error;
    }
  },

  getShowtimesByDate: async (date: string): Promise<Showtime[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/showtimes?date=${date}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching showtimes by date:", error);
      throw error;
    }
  },

  getShowtimeById: async (id: string): Promise<Showtime> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/showtimes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching showtime:", error);
      throw error;
    }
  },

  createShowtime: async (showtimeData: Omit<Showtime, "id">): Promise<Showtime> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/showtimes`, showtimeData);
      return response.data;
    } catch (error) {
      console.error("Error creating showtime:", error);
      throw error;
    }
  },

  updateShowtime: async (id: string, showtimeData: Partial<Omit<Showtime, "id">>): Promise<Showtime> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/showtimes/${id}`, showtimeData);
      return response.data;
    } catch (error) {
      console.error("Error updating showtime:", error);
      throw error;
    }
  },

  deleteShowtime: async (id: string): Promise<Showtime> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/showtimes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting showtime:", error);
      throw error;
    }
  },
};
