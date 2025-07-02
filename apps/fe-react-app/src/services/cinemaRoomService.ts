import { API_CONFIG } from "@/config/api.config";
import type { CinemaRoom, CinemaRoomWithSeatMap } from "@/interfaces/cinemarooms.interface";
import type { Seat, SeatMap, SeatType } from "@/interfaces/seat.interface";

const API_BASE_URL = API_CONFIG.MOCK_API.BASE_URL;
const REAL_API_BASE_URL = API_CONFIG.REAL_API.BASE_URL;

// Type aliases for status enums
type CinemaRoomStatus = "ACTIVE" | "MAINTENANCE" | "CLOSED";
type SeatStatus = "AVAILABLE" | "MAINTENANCE";
type SeatTypeEnum = "COUPLE" | "PATH" | "REGULAR" | "VIP" | "AISLE" | "BLOCKED";

// Real API response interfaces to match the actual backend structure
interface RealApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// Mock API interfaces for backward compatibility
interface MockApiRoom {
  id: string;
  name: string;
  type: string;
  fee: number;
  capacity: number;
  status: string;
  width: number;
  length: number;
}

interface MockApiSeat {
  id: string;
  name: string;
  seat_row: string;
  seat_column: string;
  status: string;
  type: string;
  seat_type_id: number;
  seat_link_id?: string;
}

interface MockApiSeatMap {
  gridData: MockApiSeat[];
  roomId: string;
}
interface RealApiSeatType {
  id: number;
  name: string;
  price: number;
  seatCount: number;
}

interface RealApiSeat {
  id: number;
  roomId: number;
  row: string;
  column: string;
  name: string;
  type: RealApiSeatType;
  status: string;
  discarded: boolean;
  seatLinkId?: number | null;
}

interface RealApiCinemaRoom {
  id: number;
  name: string;
  type: string;
  fee: number;
  capacity: number;
  status: string;
  width: number;
  length: number;
  seats: RealApiSeat[];
}

// Helper function to convert real API seat type to our interface
function convertRealApiSeatType(apiType: RealApiSeatType): SeatType {
  return {
    id: apiType.id,
    name: apiType.name as SeatTypeEnum,
    price: apiType.price,
    seatCount: apiType.seatCount,
  };
}

// Helper function to convert real API seat to our interface
function convertRealApiSeat(apiSeat: RealApiSeat): Seat {
  return {
    id: apiSeat.id,
    name: apiSeat.name,
    roomId: apiSeat.roomId,
    row: apiSeat.row,
    column: apiSeat.column,
    status: apiSeat.status as SeatStatus,
    type: convertRealApiSeatType(apiSeat.type),
    discarded: apiSeat.discarded,
    seatLinkId: apiSeat.seatLinkId,
  };
}

// Helper function to convert real API cinema room to our interface
function convertRealApiCinemaRoom(apiRoom: RealApiCinemaRoom): CinemaRoom {
  return {
    id: apiRoom.id,
    name: apiRoom.name,
    type: apiRoom.type,
    fee: apiRoom.fee,
    capacity: apiRoom.capacity,
    status: apiRoom.status as CinemaRoomStatus,
    width: apiRoom.width,
    length: apiRoom.length,
    seats: apiRoom.seats ? apiRoom.seats.map(convertRealApiSeat) : [],
  };
}

// Helper function to convert cinema room with seat map for UI components
function convertToRoomWithSeatMap(room: CinemaRoom): CinemaRoomWithSeatMap {
  const seatMap: SeatMap = {
    gridData: room.seats,
    roomId: room.id,
  };

  return {
    ...room,
    seatMap: room.seats.length > 0 ? seatMap : null,
  };
}

export const cinemaRoomService = {
  // Get all cinema rooms (automatically uses configured API)
  async getAllRooms(): Promise<CinemaRoom[]> {
    try {
      const useRealApi = API_CONFIG.USE_REAL_API;
      const baseUrl = useRealApi ? REAL_API_BASE_URL : API_BASE_URL;
      const endpoint = `${baseUrl}/cinema-rooms`;

      console.log(`🌐 Fetching cinema rooms from: ${endpoint} (Real API: ${useRealApi})`);

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (useRealApi) {
        // Handle real API response format (wrapped response)
        const responseData: RealApiResponse<RealApiCinemaRoom[]> = await response.json();
        console.log(`✅ Real API response: ${responseData.message}, ${responseData.result.length} rooms`);
        return responseData.result.map(convertRealApiCinemaRoom);
      } else {
        // Handle mock API response format - convert old structure to new
        const rooms: MockApiRoom[] = await response.json();
        console.log(`✅ Mock API response: ${rooms.length} rooms`);

        // Convert mock API rooms to new structure
        return rooms.map((room) => ({
          id: parseInt(room.id),
          name: room.name,
          type: room.type,
          fee: room.fee,
          capacity: room.capacity,
          status: room.status as CinemaRoomStatus,
          width: room.width,
          length: room.length,
          seats: [], // Mock API doesn't include seats in room list
        }));
      }
    } catch (error) {
      console.error("Error fetching cinema rooms:", error);
      throw error;
    }
  },

  // Get a specific cinema room by ID (automatically uses configured API)
  async getRoomById(id: string | number): Promise<CinemaRoom | null> {
    try {
      const useRealApi = API_CONFIG.USE_REAL_API;
      const baseUrl = useRealApi ? REAL_API_BASE_URL : API_BASE_URL;
      const response = await fetch(`${baseUrl}/cinema-rooms/${id}`);

      console.log(`🌐 Fetching room ${id} from: ${baseUrl}/cinema-rooms/${id} (Real API: ${useRealApi})`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (useRealApi) {
        // Handle real API response format (wrapped response)
        const responseData: RealApiResponse<RealApiCinemaRoom> = await response.json();
        console.log(`✅ Real API room response: ${responseData.message}`);
        return convertRealApiCinemaRoom(responseData.result);
      } else {
        // Handle mock API response format
        const room: MockApiRoom = await response.json();
        console.log(`✅ Mock API room response for room ${id}`);

        // Try to get seats for this room
        let seats: Seat[] = [];
        try {
          seats = await this.getSeatMap(id.toString());
        } catch (error) {
          console.warn(`Could not load seats for room ${id}:`, error);
        }

        return {
          id: parseInt(room.id),
          name: room.name,
          type: room.type,
          fee: room.fee,
          capacity: room.capacity,
          status: room.status as CinemaRoomStatus,
          width: room.width,
          length: room.length,
          seats: seats,
        };
      }
    } catch (error) {
      console.error(`Error fetching cinema room ${id}:`, error);
      throw error;
    }
  },

  // Create a new cinema room
  async createRoom(roomData: Omit<CinemaRoom, "id" | "seats">): Promise<CinemaRoom> {
    try {
      const useRealApi = API_CONFIG.USE_REAL_API;
      const baseUrl = useRealApi ? REAL_API_BASE_URL : API_BASE_URL;

      const requestBody = useRealApi
        ? roomData
        : {
            ...roomData,
            id: Date.now().toString(), // Generate ID for mock API
          };

      const response = await fetch(`${baseUrl}/cinema-rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (useRealApi) {
        const responseData: RealApiResponse<RealApiCinemaRoom> = await response.json();
        return convertRealApiCinemaRoom(responseData.result);
      } else {
        const room: MockApiRoom = await response.json();
        return {
          id: parseInt(room.id),
          name: room.name,
          type: room.type,
          fee: room.fee,
          capacity: room.capacity,
          status: room.status as CinemaRoomStatus,
          width: room.width,
          length: room.length,
          seats: [],
        };
      }
    } catch (error) {
      console.error("Error creating cinema room:", error);
      throw error;
    }
  },

  // Update an existing cinema room
  async updateRoom(id: string | number, roomData: Partial<CinemaRoom>): Promise<CinemaRoom> {
    try {
      const useRealApi = API_CONFIG.USE_REAL_API;
      const baseUrl = useRealApi ? REAL_API_BASE_URL : API_BASE_URL;

      const response = await fetch(`${baseUrl}/cinema-rooms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (useRealApi) {
        const responseData: RealApiResponse<RealApiCinemaRoom> = await response.json();
        return convertRealApiCinemaRoom(responseData.result);
      } else {
        const room: MockApiRoom = await response.json();
        return {
          id: parseInt(room.id),
          name: room.name,
          type: room.type,
          fee: room.fee,
          capacity: room.capacity,
          status: room.status as CinemaRoomStatus,
          width: room.width,
          length: room.length,
          seats: [],
        };
      }
    } catch (error) {
      console.error(`Error updating cinema room ${id}:`, error);
      throw error;
    }
  },

  // Delete a cinema room
  async deleteRoom(id: string | number): Promise<boolean> {
    try {
      const useRealApi = API_CONFIG.USE_REAL_API;
      const baseUrl = useRealApi ? REAL_API_BASE_URL : API_BASE_URL;

      const response = await fetch(`${baseUrl}/cinema-rooms/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 404) {
          return false; // Room not found
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error(`Error deleting cinema room ${id}:`, error);
      return false;
    }
  },

  // Get seat map for a specific room (for backward compatibility with mock API)
  async getSeatMap(roomId: string): Promise<Seat[]> {
    try {
      const useRealApi = API_CONFIG.USE_REAL_API;

      if (useRealApi) {
        // For real API, seats are included in room data
        const room = await this.getRoomById(roomId);
        return room?.seats || [];
      } else {
        // For mock API, use separate seat map endpoint
        const response = await fetch(`${API_BASE_URL}/seat-map/${roomId}`);
        if (!response.ok) {
          if (response.status === 404) {
            return [];
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const seatMapData: MockApiSeatMap = await response.json();

        // Convert mock seat data to new interface format
        if (seatMapData.gridData) {
          return seatMapData.gridData.map((seat: MockApiSeat) => ({
            id: parseInt(seat.id),
            name: seat.name,
            roomId: parseInt(roomId),
            row: seat.seat_row,
            column: seat.seat_column,
            status: seat.status as SeatStatus,
            type: {
              id: seat.seat_type_id,
              name: seat.type as SeatTypeEnum,
              price: 50000, // Default price for mock data
              seatCount: 1,
            },
            discarded: false,
            seatLinkId: seat.seat_link_id ? parseInt(seat.seat_link_id) : null,
          }));
        }

        return [];
      }
    } catch (error) {
      console.error(`Error fetching seat map for room ${roomId}:`, error);
      return [];
    }
  },

  // Get cinema room statistics
  async getRoomStats(): Promise<{
    total: number;
    active: number;
    maintenance: number;
    withSeatMap: number;
  }> {
    try {
      const rooms = await this.getAllRooms();

      return {
        total: rooms.length,
        active: rooms.filter((room) => room.status === "ACTIVE").length,
        maintenance: rooms.filter((room) => room.status === "MAINTENANCE").length,
        withSeatMap: rooms.filter((room) => room.seats.length > 0).length,
      };
    } catch (error) {
      console.error("Error fetching room stats:", error);
      throw error;
    }
  },

  // Get seat types (for real API)
  async getSeatTypes(): Promise<SeatType[]> {
    try {
      const useRealApi = API_CONFIG.USE_REAL_API;

      if (useRealApi) {
        const response = await fetch(`${REAL_API_BASE_URL}/seat-types`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData: RealApiResponse<RealApiSeatType[]> = await response.json();
        return responseData.result.map(convertRealApiSeatType);
      } else {
        // Return default seat types for mock API
        return [
          { id: 1, name: "REGULAR" as SeatTypeEnum, price: 50000, seatCount: 1 },
          { id: 2, name: "VIP" as SeatTypeEnum, price: 75000, seatCount: 1 },
          { id: 3, name: "COUPLE" as SeatTypeEnum, price: 100000, seatCount: 2 },
        ] as SeatType[];
      }
    } catch (error) {
      console.error("Error fetching seat types:", error);
      throw error;
    }
  },

  // Save seat map for a room (primarily for mock API)
  async saveSeatMap(roomId: string, seatMapData: SeatMap): Promise<void> {
    try {
      const useRealApi = API_CONFIG.USE_REAL_API;
      const baseUrl = useRealApi ? REAL_API_BASE_URL : API_BASE_URL;

      const response = await fetch(`${baseUrl}/seat-map/${roomId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seatMapData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error saving seat map for room ${roomId}:`, error);
      throw error;
    }
  },

  // Helper method to get room with seat map for UI components that need it
  async getRoomWithSeatMap(id: string | number): Promise<CinemaRoomWithSeatMap | null> {
    const room = await this.getRoomById(id);
    if (!room) return null;

    return convertToRoomWithSeatMap(room);
  },

  // Helper method to get all rooms with seat maps for UI components that need it
  async getAllRoomsWithSeatMap(): Promise<CinemaRoomWithSeatMap[]> {
    const rooms = await this.getAllRooms();
    return rooms.map(convertToRoomWithSeatMap);
  },

  // Update room status specifically
  async updateRoomStatus(id: string | number, status: CinemaRoomStatus): Promise<boolean> {
    try {
      await this.updateRoom(id, { status });
      return true;
    } catch (error) {
      console.error(`Error updating room status for ${id}:`, error);
      return false;
    }
  },
};
