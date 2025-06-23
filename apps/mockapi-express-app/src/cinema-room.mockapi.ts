import { CinemaRoom, Seat } from "@interfaces/cinemarooms.interface.ts";

export const cinemaRoomsMockData: CinemaRoom[] = [
  {
    room_id: "1",
    room_number: 101,
    type: "Standard",
    fee: 50000,
    capacity: 100,
    status: "ACTIVE",
    width: 10,
    length: 10,
  },
  {
    room_id: "2",
    room_number: 102,
    type: "VIP",
    fee: 80000,
    capacity: 80,
    status: "ACTIVE",
    width: 8,
    length: 10,
  },
  {
    room_id: "3",
    room_number: 103,
    type: "Premium",
    fee: 100000,
    capacity: 60,
    status: "MAINTENANCE",
    width: 8,
    length: 8,
  },
  {
    room_id: "4",
    room_number: 104,
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
        seat_id: `1-${row}${number}`,
        room_id: "1",
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
        seat_id: `2-${row}${number}`,
        room_id: "2",
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
        seat_id: `3-${row}${number}`,
        room_id: "3",
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
        seat_id: `4-${row}${number}`,
        room_id: "4",
        row,
        number,
        type: "STANDARD",
        status: "AVAILABLE" as const,
      };
    }),
];

export const cinemaRoomsAPI = {
  getAll: () => cinemaRoomsMockData,
  getById: (id: string) => cinemaRoomsMockData.find((room) => room.room_id === id),
  create: (data: Omit<CinemaRoom, "room_id">) => {
    const newRoom = {
      ...data,
      room_id: Math.max(...cinemaRoomsMockData.map((room) => parseInt(room.room_id))) + 1 + "",
    } as CinemaRoom;
    cinemaRoomsMockData.push(newRoom);
    return newRoom;
  },
  update: (id: string, data: Partial<CinemaRoom>) => {
    const index = cinemaRoomsMockData.findIndex((room) => room.room_id === id);
    if (index !== -1) {
      cinemaRoomsMockData[index] = { ...cinemaRoomsMockData[index], ...data };
      return cinemaRoomsMockData[index];
    }
    return null;
  },
  delete: (id: string) => {
    const index = cinemaRoomsMockData.findIndex((room) => room.room_id === id);
    if (index !== -1) {
      const deleted = cinemaRoomsMockData[index];
      cinemaRoomsMockData.splice(index, 1);
      return deleted;
    }
    return null;
  },
};

export const seatsAPI = {
  getByRoomId: (roomId: string) => seatsMockData.filter((seat) => seat.room_id === roomId),
  updateSeat: (seatId: string, data: Partial<Seat>) => {
    const index = seatsMockData.findIndex((seat) => seat.seat_id === seatId);
    if (index !== -1) {
      seatsMockData[index] = { ...seatsMockData[index], ...data };
      return seatsMockData[index];
    }
    return null;
  },
};
