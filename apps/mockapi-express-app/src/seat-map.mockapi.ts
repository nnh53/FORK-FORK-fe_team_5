// Seat Map API for managing cinema room seat layouts

// Basic types for seat map
type SeatType = "S" | "V" | "D"; // Standard, VIP, Double

interface GridCell {
  type: "empty" | "seat" | "aisle" | "blocked";
  row: number;
  col: number;
  displayRow?: string;
  displayCol?: string;
  seatType?: SeatType;
  isSweetbox?: boolean;
  isMasterSweetbox?: boolean;
  status?: "available" | "taken" | "selected" | "maintenance";
  id?: string;
  colspan?: number;
  isConsumedByDoubleSeat?: boolean;
  parentDoubleSeatCoords?: { row: number; col: number };
  linkedSeatCoords?: { row: number; col: number };
}

interface SeatMapGrid {
  width: number;
  height: number;
  gridData: GridCell[][];
  roomId: string;
  roomName: string;
}

// Helper function to create seat map grid
const createSeatMapGrid = (width: number, height: number, roomId: string, roomName: string): SeatMapGrid => {
  const gridData: GridCell[][] = [];

  for (let row = 0; row < height; row++) {
    const rowData: GridCell[] = [];
    for (let col = 0; col < width; col++) {
      rowData.push({
        type: "empty",
        row,
        col,
      });
    }
    gridData.push(rowData);
  }

  return {
    width,
    height,
    gridData,
    roomId,
    roomName,
  };
};

// Extended cinema room interface with seat map
export interface CinemaRoomWithSeatMap {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: "active" | "maintenance" | "closed";
  hasSeatMap: boolean;
  seatMapData?: SeatMapGrid;
  roomNumber?: number;
  fee?: number;
  width: number;
  height: number;
}

// Mock data for cinema rooms with seat maps
export const cinemaRoomsWithSeatMapData: CinemaRoomWithSeatMap[] = [
  {
    id: "ROOM_001",
    name: "Phòng 1",
    type: "IMAX",
    capacity: 150,
    status: "active",
    hasSeatMap: true,
    roomNumber: 101,
    fee: 120000,
    width: 16,
    height: 10,
    seatMapData: createSeatMapGrid(16, 10, "ROOM_001", "Phòng 1"),
  },
  {
    id: "ROOM_002",
    name: "Phòng 2",
    type: "4DX",
    capacity: 120,
    status: "active",
    hasSeatMap: false,
    roomNumber: 102,
    fee: 150000,
    width: 14,
    height: 9,
  },
  {
    id: "ROOM_003",
    name: "Phòng 3",
    type: "Standard",
    capacity: 100,
    status: "maintenance",
    hasSeatMap: true,
    roomNumber: 103,
    fee: 80000,
    width: 14,
    height: 8,
    seatMapData: createSeatMapGrid(14, 8, "ROOM_003", "Phòng 3"),
  },
  {
    id: "ROOM_004",
    name: "Phòng VIP",
    type: "VIP",
    capacity: 80,
    status: "active",
    hasSeatMap: false,
    roomNumber: 104,
    fee: 200000,
    width: 12,
    height: 7,
  },
  {
    id: "ROOM_005",
    name: "Phòng Premium",
    type: "Premium",
    capacity: 90,
    status: "active",
    hasSeatMap: true,
    roomNumber: 105,
    fee: 180000,
    width: 15,
    height: 6,
    seatMapData: createSeatMapGrid(15, 6, "ROOM_005", "Phòng Premium"),
  },
];

// API functions
export const seatMapAPI = {
  // Get all cinema rooms with seat map info
  getAllRooms: async (): Promise<CinemaRoomWithSeatMap[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...cinemaRoomsWithSeatMapData];
  },

  // Get room by ID
  getRoomById: async (roomId: string): Promise<CinemaRoomWithSeatMap | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return cinemaRoomsWithSeatMapData.find((room) => room.id === roomId) || null;
  },

  // Get seat map for a specific room
  getSeatMapByRoomId: async (roomId: string): Promise<SeatMapGrid | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const room = cinemaRoomsWithSeatMapData.find((room) => room.id === roomId);
    return room?.seatMapData || null;
  },

  // Save/update seat map for a room
  saveSeatMap: async (roomId: string, seatMapData: SeatMapGrid): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const roomIndex = cinemaRoomsWithSeatMapData.findIndex((room) => room.id === roomId);
    if (roomIndex !== -1) {
      cinemaRoomsWithSeatMapData[roomIndex].seatMapData = seatMapData;
      cinemaRoomsWithSeatMapData[roomIndex].hasSeatMap = true;

      // Update capacity based on actual seats in the map
      const seatCount = seatMapData.gridData.flat().filter((cell: GridCell) => cell.type === "seat").length;
      cinemaRoomsWithSeatMapData[roomIndex].capacity = seatCount;

      console.log(`Seat map saved for room ${roomId}:`, seatMapData);
      return true;
    }
    return false;
  },

  // Create new room
  createRoom: async (roomData: Omit<CinemaRoomWithSeatMap, "id">): Promise<CinemaRoomWithSeatMap> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newId = `ROOM_${String(cinemaRoomsWithSeatMapData.length + 1).padStart(3, "0")}`;
    const newRoom: CinemaRoomWithSeatMap = {
      ...roomData,
      id: newId,
      hasSeatMap: false,
    };

    cinemaRoomsWithSeatMapData.push(newRoom);
    return newRoom;
  },

  // Update room info
  updateRoom: async (roomId: string, updateData: Partial<CinemaRoomWithSeatMap>): Promise<CinemaRoomWithSeatMap | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const roomIndex = cinemaRoomsWithSeatMapData.findIndex((room) => room.id === roomId);
    if (roomIndex !== -1) {
      cinemaRoomsWithSeatMapData[roomIndex] = {
        ...cinemaRoomsWithSeatMapData[roomIndex],
        ...updateData,
      };
      return cinemaRoomsWithSeatMapData[roomIndex];
    }
    return null;
  },

  // Delete room
  deleteRoom: async (roomId: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const roomIndex = cinemaRoomsWithSeatMapData.findIndex((room) => room.id === roomId);
    if (roomIndex !== -1) {
      cinemaRoomsWithSeatMapData.splice(roomIndex, 1);
      return true;
    }
    return false;
  },

  // Update room status
  updateRoomStatus: async (roomId: string, status: "active" | "maintenance" | "closed"): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const roomIndex = cinemaRoomsWithSeatMapData.findIndex((room) => room.id === roomId);
    if (roomIndex !== -1) {
      cinemaRoomsWithSeatMapData[roomIndex].status = status;
      console.log(`Room ${roomId} status updated to ${status}`);
      return true;
    }
    return false;
  },

  // Get room statistics
  getRoomStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      total: cinemaRoomsWithSeatMapData.length,
      withSeatMap: cinemaRoomsWithSeatMapData.filter((r) => r.hasSeatMap).length,
      active: cinemaRoomsWithSeatMapData.filter((r) => r.status === "active").length,
      maintenance: cinemaRoomsWithSeatMapData.filter((r) => r.status === "maintenance").length,
      closed: cinemaRoomsWithSeatMapData.filter((r) => r.status === "closed").length,
    };
  },

  // Search rooms
  searchRooms: async (query: string): Promise<CinemaRoomWithSeatMap[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const lowercaseQuery = query.toLowerCase();
    return cinemaRoomsWithSeatMapData.filter(
      (room) =>
        room.name.toLowerCase().includes(lowercaseQuery) ||
        room.id.toLowerCase().includes(lowercaseQuery) ||
        room.type.toLowerCase().includes(lowercaseQuery),
    );
  },
};

export default seatMapAPI;
