import { CinemaRoom } from "../../fe-react-app/src/interfaces/cinemarooms.interface.ts";
import { Seat } from "../../fe-react-app/src/interfaces/seat.interface.ts";

export const cinemaRoomsMockData: CinemaRoom[] = [
  {
    id: "1",
    roomNumber: 101,
    type: "Standard",
    fee: 50000,
    name: "Standard Cinema Room 101",
    capacity: 100,
    status: "ACTIVE",
    width: 10,
    length: 10,
    seatMap: null,
  },
  {
    id: "2",
    roomNumber: 102,
    type: "VIP",
    fee: 80000,
    name: "VIP Cinema Room 102",
    capacity: 80,
    status: "ACTIVE",
    width: 8,
    length: 10,
    seatMap: null,
  },
  {
    id: "3",
    roomNumber: 103,
    type: "Premium",
    fee: 100000,
    name: "Premium Cinema Room 103",
    capacity: 60,
    status: "MAINTENANCE",
    width: 8,
    length: 8,
    seatMap: null,
  },
  {
    id: "4",
    roomNumber: 104,
    type: "Standard",
    fee: 50000,
    name: "Standard Cinema Room 104",
    capacity: 100,
    status: "CLOSED",
    width: 10,
    length: 10,
    seatMap: null,
  },
];

export const seatsMockData: Seat[] = [
  // Generate seats for room 1
  ...Array(100)
    .fill(null)
    .map((_, index) => {
      const row = String.fromCharCode(65 + Math.floor(index / 10));
      const number = (index % 10) + 1;
      const seatType: "VIP" | "REGULAR" = row < "C" ? "VIP" : "REGULAR";
      return {
        id: `1-${row}${number}`,
        name: `${row}${number}`,
        seat_type_id: seatType === "VIP" ? 2 : 1,
        seat_column: number.toString(),
        seat_row: row,
        status: "AVAILABLE" as const,
        type: seatType,
        cinema_room_id: "1",
      };
    }),
  // Generate seats for room 2
  ...Array(80)
    .fill(null)
    .map((_, index) => {
      const row = String.fromCharCode(65 + Math.floor(index / 8));
      const number = (index % 8) + 1;
      const seatType: "VIP" | "REGULAR" = row < "D" ? "VIP" : "REGULAR";
      return {
        id: `2-${row}${number}`,
        name: `${row}${number}`,
        seat_type_id: seatType === "VIP" ? 2 : 1,
        seat_column: number.toString(),
        seat_row: row,
        status: "AVAILABLE" as const,
        type: seatType,
        cinema_room_id: "2",
      };
    }),
  // Generate seats for room 3
  ...Array(64)
    .fill(null)
    .map((_, index) => {
      const row = String.fromCharCode(65 + Math.floor(index / 8));
      const number = (index % 8) + 1;
      const seatType: "VIP" | "REGULAR" = row < "C" ? "VIP" : "REGULAR";
      return {
        id: `3-${row}${number}`,
        name: `${row}${number}`,
        seat_type_id: seatType === "VIP" ? 2 : 1,
        seat_column: number.toString(),
        seat_row: row,
        status: "AVAILABLE" as const,
        type: seatType,
        cinema_room_id: "3",
      };
    }),
  // Generate seats for room 4
  ...Array(100)
    .fill(null)
    .map((_, index) => {
      const row = String.fromCharCode(65 + Math.floor(index / 10));
      const number = (index % 10) + 1;
      return {
        id: `4-${row}${number}`,
        name: `${row}${number}`,
        seat_type_id: 1,
        seat_column: number.toString(),
        seat_row: row,
        status: "AVAILABLE" as const,
        type: "REGULAR" as const,
        cinema_room_id: "4",
      };
    }),
];

export const cinemaRoomsAPI = {
  getAll: () => cinemaRoomsMockData,
  getById: (id: string) => cinemaRoomsMockData.find((room) => room.id === id),
  create: (data: Omit<CinemaRoom, "id">) => {
    const newRoom = {
      ...data,
      id: Math.max(...cinemaRoomsMockData.map((room) => parseInt(room.id))) + 1 + "",
    } as CinemaRoom;
    cinemaRoomsMockData.push(newRoom);
    return newRoom;
  },
  update: (id: string, data: Partial<CinemaRoom>) => {
    const index = cinemaRoomsMockData.findIndex((room) => room.id === id);
    if (index !== -1) {
      cinemaRoomsMockData[index] = { ...cinemaRoomsMockData[index], ...data };
      return cinemaRoomsMockData[index];
    }
    return null;
  },
  delete: (id: string) => {
    const index = cinemaRoomsMockData.findIndex((room) => room.id === id);
    if (index !== -1) {
      const deleted = cinemaRoomsMockData[index];
      cinemaRoomsMockData.splice(index, 1);
      return deleted;
    }
    return null;
  },
};

export const seatsAPI = {
  getByRoomId: (roomId: string) => seatsMockData.filter((seat) => seat.cinema_room_id === roomId),
  getAll: () => seatsMockData,
  getSeatById: (seatId: string) => seatsMockData.find((seat) => seat.id === seatId) || null,
  createSeat: (seatData: Omit<Seat, "id">) => {
    const newSeat: Seat = {
      ...seatData,
      id: `seat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    seatsMockData.push(newSeat);
    return newSeat;
  },
  updateSeat: (seatId: string, data: Partial<Seat>) => {
    const index = seatsMockData.findIndex((seat) => seat.id === seatId);
    if (index !== -1) {
      seatsMockData[index] = { ...seatsMockData[index], ...data };
      return seatsMockData[index];
    }
    return null;
  },
  deleteSeat: (seatId: string) => {
    const index = seatsMockData.findIndex((seat) => seat.id === seatId);
    if (index !== -1) {
      seatsMockData.splice(index, 1);
      return true;
    }
    return false;
  },
  // Save entire seat map for a room
  saveSeatMapForRoom: (roomId: string, seats: Seat[]) => {
    try {
      // Remove existing seats for this room
      const existingSeatsIndexes = [];
      for (let i = seatsMockData.length - 1; i >= 0; i--) {
        if (seatsMockData[i].cinema_room_id === roomId) {
          existingSeatsIndexes.push(i);
        }
      }

      // Remove from highest index to lowest to avoid index shifting issues
      existingSeatsIndexes.forEach((index) => {
        seatsMockData.splice(index, 1);
      });

      // Add new seats with proper IDs and room association
      const newSeats = seats.map((seat, index) => ({
        ...seat,
        id: seat.id || `${roomId}-${seat.seat_row}${seat.seat_column}`,
        cinema_room_id: roomId,
      }));

      // Add new seats to the array
      seatsMockData.push(...newSeats);

      console.log(`Saved ${newSeats.length} seats for room ${roomId}`);
      return true;
    } catch (error) {
      console.error("Error saving seat map:", error);
      return false;
    }
  },
};
