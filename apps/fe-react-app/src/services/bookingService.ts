import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export interface BookingCreateRequest {
  userId?: string;
  movieId: string;
  showtimeId: string;
  cinemaRoomId: string;
  seats: string[];
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
  paymentMethod: "cash" | "card" | "momo" | "banking";
  combos?: {
    id: string;
    quantity: number;
  }[];
  usePoints?: number;
  voucherCode?: string;
}

export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  showtimeId: string;
  cinemaRoomId: string;
  seats: string[];
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "cash" | "card" | "momo" | "banking";
  bookingDate: Date;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
  combos?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  discount?: {
    type: "points" | "voucher" | "promotion";
    amount: number;
    description: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Combo {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export const bookingService = {
  // Get all bookings or by user ID
  getAllBookings: async (userId?: string): Promise<Booking[]> => {
    try {
      const params = userId ? { userId } : {};
      const response = await axios.get(`${API_BASE_URL}/bookings`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  },

  // Get booking by ID
  getBookingById: async (id: string): Promise<Booking> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching booking:", error);
      throw error;
    }
  },

  // Create new booking
  createBooking: async (bookingData: BookingCreateRequest): Promise<Booking> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
      return response.data;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },

  // Update booking
  updateBooking: async (id: string, bookingData: Partial<Booking>): Promise<Booking> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/bookings/${id}`, bookingData);
      return response.data;
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  },

  // Confirm booking
  confirmBooking: async (id: string): Promise<Booking> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bookings/${id}/confirm`);
      return response.data;
    } catch (error) {
      console.error("Error confirming booking:", error);
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (id: string): Promise<Booking> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error("Error cancelling booking:", error);
      throw error;
    }
  },

  // Delete booking
  deleteBooking: async (id: string): Promise<Booking> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  },

  // Get available combos
  getCombos: async (): Promise<Combo[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/combos`);
      return response.data;
    } catch (error) {
      console.error("Error fetching combos:", error);
      throw error;
    }
  },
};
