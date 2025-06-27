import type {
  CinemaRoomWithSeatMap,
  ComponentRoomStatus,
  CreateCinemaRoomRequest,
  UpdateCinemaRoomRequest,
} from "../interfaces/cinemarooms.interface";
import type { SeatMapGrid } from "../interfaces/seatmap.interface";

const API_BASE_URL = "http://localhost:3000";

export const seatMapService = {
  // Get all cinema rooms with seat map info
  async getAllRooms(): Promise<CinemaRoomWithSeatMap[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/seat-map/rooms`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching cinema rooms:", error);
      throw error;
    }
  },

  // Get a specific cinema room by ID
  async getRoomById(id: string): Promise<CinemaRoomWithSeatMap | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/seat-map/rooms/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching cinema room:", error);
      throw error;
    }
  },

  // Get seat map for a specific room
  async getSeatMapByRoomId(roomId: string): Promise<SeatMapGrid | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/seat-map/${roomId}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching seat map:", error);
      throw error;
    }
  },

  // Save/update seat map for a room
  async saveSeatMap(roomId: string, seatMapData: SeatMapGrid): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/seat-map/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seatMapData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error("Error saving seat map:", error);
      throw error;
    }
  },

  // Create a new cinema room
  async createRoom(roomData: CreateCinemaRoomRequest): Promise<CinemaRoomWithSeatMap> {
    try {
      const response = await fetch(`${API_BASE_URL}/seat-map/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error creating cinema room:", error);
      throw error;
    }
  },

  // Update an existing cinema room
  async updateRoom(id: string, roomData: UpdateCinemaRoomRequest): Promise<CinemaRoomWithSeatMap | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/seat-map/rooms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error updating cinema room:", error);
      throw error;
    }
  },

  // Delete a cinema room
  async deleteRoom(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/seat-map/rooms/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 404) {
          return false;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error("Error deleting cinema room:", error);
      throw error;
    }
  },

  // Update room status
  async updateRoomStatus(id: string, status: ComponentRoomStatus): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/seat-map/rooms/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return false;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error("Error updating room status:", error);
      throw error;
    }
  },

  // Get room statistics
  async getRoomStats(): Promise<{
    total: number;
    withSeatMap: number;
    active: number;
    maintenance: number;
    closed: number;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/seat-map/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching room stats:", error);
      // Return default stats on error
      return {
        total: 0,
        withSeatMap: 0,
        active: 0,
        maintenance: 0,
        closed: 0,
      };
    }
  },

  // Search rooms
  async searchRooms(query: string): Promise<CinemaRoomWithSeatMap[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/seat-map/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error searching rooms:", error);
      throw error;
    }
  },
};
