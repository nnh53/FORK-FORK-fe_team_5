import type { Booking, BookingCombo, BookingRequest, BookingUpdateRequest } from "@/interfaces/booking.interface";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const bookingService = {
  // Get all bookings or by user ID
  getAllBookings: async (userId?: string): Promise<Booking[]> => {
    try {
      const params = userId ? { user_id: userId } : {};
      const response = await axios.get(`${API_BASE_URL}/bookings`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  },

  // Get booking by ID
  getBookingById: async (id: number): Promise<Booking> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching booking:", error);
      throw error;
    }
  },

  // Create new booking
  createBooking: async (bookingData: BookingRequest): Promise<Booking> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
      return response.data;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },

  // Update booking
  updateBooking: async (id: number, bookingData: BookingUpdateRequest): Promise<Booking> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/bookings/${id}`, bookingData);
      return response.data;
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  },

  // Confirm booking
  confirmBooking: async (id: number): Promise<Booking> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bookings/${id}/confirm`);
      return response.data;
    } catch (error) {
      console.error("Error confirming booking:", error);
      throw error;
    }
  },
  // Get bookings by customer phone
  getBookingsByPhone: async (phone: string): Promise<Booking[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings/phone/${phone}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings by phone:", error);
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (id: number): Promise<Booking> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error("Error cancelling booking:", error);
      throw error;
    }
  },

  // Delete booking
  deleteBooking: async (id: number): Promise<Booking> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  },

  // Get available combos
  getCombos: async (): Promise<BookingCombo[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/combos`);
      return response.data;
    } catch (error) {
      console.error("Error fetching combos:", error);
      throw error;
    }
  },

  // Get available snacks
  getSnacks: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/snacks`);
      return response.data;
    } catch (error) {
      console.error("Error fetching snacks:", error);
      throw error;
    }
  },

  // Get seats for a showtime/room
  getAvailableSeats: async (showtimeId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/showtimes/${showtimeId}/seats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching available seats:", error);
      throw error;
    }
  },

  // Get showtimes
  getShowtimes: async (movieId?: number, roomId?: number) => {
    try {
      const params: Record<string, number> = {};
      if (movieId) params.movie_id = movieId;
      if (roomId) params.room_id = roomId;

      const response = await axios.get(`${API_BASE_URL}/showtimes`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching showtimes:", error);
      throw error;
    }
  },

  // Get promotions
  getPromotions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/promotions`);
      return response.data;
    } catch (error) {
      console.error("Error fetching promotions:", error);
      throw error;
    }
  },

  // Update booking payment status
  updatePaymentStatus: async (id: number, paymentStatus: string, payOsCode?: string) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/bookings/${id}/payment`, {
        payment_status: paymentStatus,
        pay_os_code: payOsCode,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  },

  // Update booking status
  updateBookingStatus: async (id: number, bookingStatus: string) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/bookings/${id}/status`, {
        booking_status: bookingStatus,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  },
};
