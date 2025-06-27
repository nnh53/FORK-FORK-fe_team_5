import type {
  ApiRoomStatus,
  CinemaRoom,
  CinemaRoomWithSeatMapAlt as CinemaRoomWithSeatMap,
  ComponentRoomStatus,
  CreateCinemaRoomApiRequest as CreateCinemaRoomRequest,
  Seat,
  UpdateCinemaRoomApiRequest as UpdateCinemaRoomRequest,
} from "../interfaces/cinemarooms.interface";

const API_BASE_URL = "http://localhost:3000";

// Map API status to component status
const mapApiStatusToComponentStatus = (apiStatus: ApiRoomStatus): ComponentRoomStatus => {
  switch (apiStatus) {
    case "ACTIVE":
      return "active";
    case "MAINTENANCE":
      return "maintenance";
    case "CLOSED":
      return "closed";
    default:
      return "active";
  }
};

// Map component status to API status
const mapComponentStatusToApiStatus = (componentStatus: ComponentRoomStatus): ApiRoomStatus => {
  switch (componentStatus) {
    case "active":
      return "ACTIVE";
    case "maintenance":
      return "MAINTENANCE";
    case "closed":
      return "CLOSED";
    default:
      return "ACTIVE";
  }
};

// Transform API CinemaRoom to component CinemaRoomWithSeatMap
const transformApiRoomToComponent = (apiRoom: CinemaRoom): CinemaRoomWithSeatMap => {
  return {
    id: apiRoom.id,
    name: `Room ${apiRoom.roomNumber}`, // Create a display name
    type: apiRoom.type,
    capacity: apiRoom.capacity,
    status: mapApiStatusToComponentStatus(apiRoom.status),
    width: apiRoom.width,
    height: apiRoom.length, // Map length to height
    hasSeatMap: false, // Default to false, can be updated based on seats data
    fee: apiRoom.fee,
    roomNumber: apiRoom.roomNumber,
  };
};

export const cinemaRoomService = {
  // Get all cinema rooms
  async getAllRooms(): Promise<CinemaRoomWithSeatMap[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cinema-rooms`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rooms: CinemaRoom[] = await response.json();

      // Transform API rooms to component format
      const transformedRooms = rooms.map(transformApiRoomToComponent);

      // Check if rooms have seat maps
      const roomsWithSeatMapStatus = await Promise.all(
        transformedRooms.map(async (room) => {
          try {
            const seats = await this.getRoomSeats(room.id);
            return {
              ...room,
              hasSeatMap: seats.length > 0,
            };
          } catch {
            return {
              ...room,
              hasSeatMap: false,
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
  async getRoomById(id: string): Promise<CinemaRoomWithSeatMap | null> {
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
      const seats = await this.getRoomSeats(id);

      return {
        ...transformApiRoomToComponent(room),
        hasSeatMap: seats.length > 0,
      };
    } catch (error) {
      console.error("Error fetching cinema room:", error);
      throw error;
    }
  },

  // Create a new cinema room
  async createRoom(roomData: Omit<CinemaRoomWithSeatMap, "id" | "hasSeatMap" | "seatMapData">): Promise<CinemaRoomWithSeatMap> {
    try {
      const createRequest: CreateCinemaRoomRequest = {
        name: roomData.name,
        roomNumber: roomData.roomNumber,
        type: roomData.type,
        fee: roomData.fee,
        capacity: roomData.capacity,
        status: mapComponentStatusToApiStatus(roomData.status),
        width: roomData.width,
        length: roomData.height, // Map height to length
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
        ...transformApiRoomToComponent(createdRoom),
        hasSeatMap: false,
      };
    } catch (error) {
      console.error("Error creating cinema room:", error);
      throw error;
    }
  },

  // Update an existing cinema room
  async updateRoom(id: string, roomData: Partial<CinemaRoomWithSeatMap>): Promise<CinemaRoomWithSeatMap | null> {
    try {
      const updateRequest: UpdateCinemaRoomRequest = {};

      if (roomData.name) updateRequest.name = roomData.name;
      if (roomData.roomNumber) updateRequest.roomNumber = roomData.roomNumber;
      if (roomData.type) updateRequest.type = roomData.type;
      if (roomData.fee) updateRequest.fee = roomData.fee;
      if (roomData.capacity) updateRequest.capacity = roomData.capacity;
      if (roomData.status) updateRequest.status = mapComponentStatusToApiStatus(roomData.status);
      if (roomData.width) updateRequest.width = roomData.width;
      if (roomData.height) updateRequest.length = roomData.height;

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
      const seats = await this.getRoomSeats(id);

      return {
        ...transformApiRoomToComponent(updatedRoom),
        hasSeatMap: seats.length > 0,
      };
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
  async getRoomSeats(roomId: string): Promise<Seat[]> {
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

  // Update a seat
  async updateSeat(seatId: string, seatData: Partial<Seat>): Promise<Seat | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/seats/${seatId}`, {
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
        withSeatMap: rooms.filter((room) => room.hasSeatMap).length,
        active: rooms.filter((room) => room.status === "active").length,
        maintenance: rooms.filter((room) => room.status === "maintenance").length,
        closed: rooms.filter((room) => room.status === "closed").length,
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
};
