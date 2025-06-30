import type { CinemaRoom } from "@/interfaces/cinemarooms.interface";
import type { Seat, SeatMap } from "@/interfaces/seat.interface";

const API_BASE_URL = "http://localhost:3000";

export const cinemaRoomService = {
  // Get all cinema rooms
  async getAllRooms(): Promise<CinemaRoom[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cinema-rooms`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rooms: CinemaRoom[] = await response.json();

      // Check if rooms have seat maps and update seatMap property
      const roomsWithSeatMapStatus = await Promise.all(
        rooms.map(async (room) => {
          try {
            const seats = await this.getSeatMap(room.id);
            const hasSeatMap = seats.length > 0;
            return {
              ...room,
              seatMap: hasSeatMap ? { gridData: seats, roomId: room.id } : null,
            };
          } catch {
            return {
              ...room,
              seatMap: null,
            };
          }
        }),
      );

      return roomsWithSeatMapStatus;
    } catch (error) {
      console.error("Error fetching cinema rooms:", error);
      throw error;
    }
  },

  // Get a specific cinema room by ID
  async getRoomById(id: string): Promise<CinemaRoom | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/cinema-rooms/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const room: CinemaRoom = await response.json();

      // Check if room has seats
      try {
        const seats = await this.getSeatMap(id);
        return {
          ...room,
          seatMap: seats.length > 0 ? { gridData: seats, roomId: id } : null,
        };
      } catch {
        return {
          ...room,
          seatMap: null,
        };
      }
    } catch (error) {
      console.error("Error fetching cinema room:", error);
      throw error;
    }
  },

  // Create a new cinema room
  async createRoom(roomData: Omit<CinemaRoom, "id" | "seatMap">): Promise<CinemaRoom> {
    try {
      const createRequest = {
        name: roomData.name,
        roomNumber: roomData.roomNumber,
        type: roomData.type,
        fee: roomData.fee,
        capacity: roomData.capacity,
        status: roomData.status,
        width: roomData.width,
        length: roomData.length,
      };

      const response = await fetch(`${API_BASE_URL}/cinema-rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdRoom: CinemaRoom = await response.json();
      return {
        ...createdRoom,
        seatMap: null,
      };
    } catch (error) {
      console.error("Error creating cinema room:", error);
      throw error;
    }
  },

  // Update an existing cinema room
  async updateRoom(id: string, roomData: Partial<CinemaRoom>): Promise<CinemaRoom | null> {
    try {
      const updateRequest: Partial<Omit<CinemaRoom, "id" | "seatMap">> = {};

      if (roomData.name) updateRequest.name = roomData.name;
      if (roomData.roomNumber) updateRequest.roomNumber = roomData.roomNumber;
      if (roomData.type) updateRequest.type = roomData.type;
      if (roomData.fee) updateRequest.fee = roomData.fee;
      if (roomData.capacity) updateRequest.capacity = roomData.capacity;
      if (roomData.status) updateRequest.status = roomData.status;
      if (roomData.width) updateRequest.width = roomData.width;
      if (roomData.length) updateRequest.length = roomData.length;

      const response = await fetch(`${API_BASE_URL}/cinema-rooms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateRequest),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedRoom: CinemaRoom = await response.json();

      // Check if room has seats
      try {
        const seats = await this.getSeatMap(id);
        return {
          ...updatedRoom,
          seatMap: seats.length > 0 ? { gridData: seats, roomId: id } : null,
        };
      } catch {
        return {
          ...updatedRoom,
          seatMap: null,
        };
      }
    } catch (error) {
      console.error("Error updating cinema room:", error);
      throw error;
    }
  },

  // Delete a cinema room
  async deleteRoom(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/cinema-rooms/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 404) {
          return false;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error deleting cinema room:", error);
      throw error;
    }
  },

  // Get seats for a specific room
  async getSeatMap(roomId: string): Promise<Seat[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cinema-rooms/${roomId}/seats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching room seats:", error);
      throw error;
    }
  },

  // Save seat map for a room
  async saveSeatMap(roomId: string, seats: Seat[]): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/cinema-rooms/${roomId}/seats`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seats),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error saving seat map:", error);
      throw error;
    }
  },

  // Update a seat
  async updateSeatMap(roomId: string, seatData: Partial<SeatMap[]>): Promise<SeatMap[] | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/seats/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seatData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error updating seat:", error);
      throw error;
    }
  },

  // Get room statistics
  async getRoomStats(): Promise<{ total: number; withSeatMap: number; active: number; maintenance: number; closed: number }> {
    try {
      const rooms = await this.getAllRooms();

      return {
        total: rooms.length,
        withSeatMap: rooms.filter((room) => room.seatMap !== null).length,
        active: rooms.filter((room) => room.status === "ACTIVE").length,
        maintenance: rooms.filter((room) => room.status === "MAINTENANCE").length,
        closed: rooms.filter((room) => room.status === "CLOSED").length,
      };
    } catch (error) {
      console.error("Error calculating room stats:", error);
      return {
        total: 0,
        withSeatMap: 0,
        active: 0,
        maintenance: 0,
        closed: 0,
      };
    }
  },

  // Update room status
  async updateRoomStatus(id: string, status: "ACTIVE" | "MAINTENANCE" | "CLOSED"): Promise<CinemaRoom | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/cinema-rooms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedRoom: CinemaRoom = await response.json();

      // Check if room has seats
      try {
        const seats = await this.getSeatMap(id);
        return {
          ...updatedRoom,
          seatMap: seats.length > 0 ? { gridData: seats, roomId: id } : null,
        };
      } catch {
        return {
          ...updatedRoom,
          seatMap: null,
        };
      }
    } catch (error) {
      console.error("Error updating room status:", error);
      throw error;
    }
  },
};
