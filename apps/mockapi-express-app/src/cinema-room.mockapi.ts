import { CinemaRoom, Seat } from "@/interfaces/cinemarooms.interface.ts";

export const cinemaRoomsMockData: CinemaRoom[] = [
  {
    id: "1",
    roomNumber: 101,
    type: "Standard",
    fee: 50000,
    capacity: 100,
    status: "ACTIVE",
    width: 10,
    length: 10,
  },
  {
    id: "2",
    roomNumber: 102,
    type: "VIP",
    fee: 80000,
    capacity: 80,
    status: "ACTIVE",
    width: 8,
    length: 10,
  },
  {
    id: "3",
    roomNumber: 103,
    type: "Premium",
    fee: 100000,
    capacity: 60,
    status: "MAINTENANCE",
    width: 8,
    length: 8,
  },
  {
    id: "4",
    roomNumber: 104,
    type: "Standard",
    fee: 50000,
    capacity: 100,
    status: "CLOSED",
    width: 10,
    length: 10,
  },
];

export const seatsMockData: Seat[] = [
  // Generate seats for room 1
  ...Array(100)
    .fill(null)
    .map((_, index) => {
      const row = String.fromCharCode(65 + Math.floor(index / 10));
      const number = (index % 10) + 1;
      return {
        id: `1-${row}${number}`,
        roomId: "1",
        row,
        number,
        type: row < "C" ? "VIP" : "STANDARD",
        status: "AVAILABLE" as const,
      };
    }),
  // Generate seats for room 2
  ...Array(80)
    .fill(null)
    .map((_, index) => {
      const row = String.fromCharCode(65 + Math.floor(index / 8));
      const number = (index % 8) + 1;
      return {
        id: `2-${row}${number}`,
        roomId: "2",
        row,
        number,
        type: row < "D" ? "VIP" : "STANDARD",
        status: "AVAILABLE" as const,
      };
    }),
  // Generate seats for room 3
  ...Array(64)
    .fill(null)
    .map((_, index) => {
      const row = String.fromCharCode(65 + Math.floor(index / 8));
      const number = (index % 8) + 1;
      return {
        id: `3-${row}${number}`,
        roomId: "3",
        row,
        number,
        type: row < "C" ? "PREMIUM" : row < "F" ? "VIP" : "STANDARD",
        status: "AVAILABLE" as const,
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
        roomId: "4",
        row,
        number,
        type: "STANDARD",
        status: "AVAILABLE" as const,
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
  getByRoomId: (roomId: string) => seatsMockData.filter((seat) => seat.roomId === roomId),
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
};
