// Database-aligned seats mock API for FCinema

import type { DatabaseSeat, DatabaseSeatType, SeatRequest, SeatUpdateRequest } from "../../fe-react-app/src/interfaces/seat.interface";

// Mock seat types data (from database 'seat_type' table)
export const mockSeatTypes: DatabaseSeatType[] = [
  { id: 1, name: "SINGLE", price: 75000 },
  { id: 2, name: "DOUBLE", price: 150000 },
  { id: 3, name: "PATH", price: 0 },
  { id: 4, name: "PATH_VIP", price: 100000 },
];

// Mock seats data (from database 'seat' table)
export const mockSeats: DatabaseSeat[] = [
  // Room ROOM_001 seats
  {
    id: "SEAT_001_A1",
    name: "A1",
    seat_type_id: 2,
    seat_column: "1",
    seat_row: "A",
    status: "AVAILABLE",
    type: "COUPLE",
    cinema_room_id: "ROOM_001",
    seat_link_id: "SEAT_001_A2",
  },
  {
    id: "SEAT_001_A2",
    name: "A2",
    seat_type_id: 2,
    seat_column: "2",
    seat_row: "A",
    status: "AVAILABLE",
    type: "COUPLE",
    cinema_room_id: "ROOM_001",
    seat_link_id: "SEAT_001_A1",
  },
  {
    id: "SEAT_001_A3",
    name: "A3",
    seat_type_id: 2,
    seat_column: "3",
    seat_row: "A",
    status: "AVAILABLE",
    type: "COUPLE",
    cinema_room_id: "ROOM_001",
    seat_link_id: "SEAT_001_A4",
  },
  {
    id: "SEAT_001_A4",
    name: "A4",
    seat_type_id: 2,
    seat_column: "4",
    seat_row: "A",
    status: "AVAILABLE",
    type: "COUPLE",
    cinema_room_id: "ROOM_001",
    seat_link_id: "SEAT_001_A3",
  },

  // Standard seats for rows B-J
  {
    id: "SEAT_001_B1",
    name: "B1",
    seat_type_id: 1,
    seat_column: "1",
    seat_row: "B",
    status: "AVAILABLE",
    type: "REGULAR",
    cinema_room_id: "ROOM_001",
  },
  {
    id: "SEAT_001_B2",
    name: "B2",
    seat_type_id: 1,
    seat_column: "2",
    seat_row: "B",
    status: "AVAILABLE",
    type: "REGULAR",
    cinema_room_id: "ROOM_001",
  },
  {
    id: "SEAT_001_B3",
    name: "B3",
    seat_type_id: 1,
    seat_column: "3",
    seat_row: "B",
    status: "MAINTENANCE",
    type: "REGULAR",
    cinema_room_id: "ROOM_001",
  },

  // VIP seats for rows H-J
  { id: "SEAT_001_H1", name: "H1", seat_type_id: 4, seat_column: "1", seat_row: "H", status: "AVAILABLE", type: "VIP", cinema_room_id: "ROOM_001" },
  { id: "SEAT_001_H2", name: "H2", seat_type_id: 4, seat_column: "2", seat_row: "H", status: "AVAILABLE", type: "VIP", cinema_room_id: "ROOM_001" },
  { id: "SEAT_001_I1", name: "I1", seat_type_id: 4, seat_column: "1", seat_row: "I", status: "AVAILABLE", type: "VIP", cinema_room_id: "ROOM_001" },
  { id: "SEAT_001_I2", name: "I2", seat_type_id: 4, seat_column: "2", seat_row: "I", status: "AVAILABLE", type: "VIP", cinema_room_id: "ROOM_001" },
  { id: "SEAT_001_J1", name: "J1", seat_type_id: 4, seat_column: "1", seat_row: "J", status: "AVAILABLE", type: "VIP", cinema_room_id: "ROOM_001" },
  { id: "SEAT_001_J2", name: "J2", seat_type_id: 4, seat_column: "2", seat_row: "J", status: "AVAILABLE", type: "VIP", cinema_room_id: "ROOM_001" },

  // Room ROOM_002 seats
  {
    id: "SEAT_002_A1",
    name: "A1",
    seat_type_id: 1,
    seat_column: "1",
    seat_row: "A",
    status: "AVAILABLE",
    type: "REGULAR",
    cinema_room_id: "ROOM_002",
  },
  {
    id: "SEAT_002_A2",
    name: "A2",
    seat_type_id: 1,
    seat_column: "2",
    seat_row: "A",
    status: "AVAILABLE",
    type: "REGULAR",
    cinema_room_id: "ROOM_002",
  },
  { id: "SEAT_002_B1", name: "B1", seat_type_id: 4, seat_column: "1", seat_row: "B", status: "AVAILABLE", type: "VIP", cinema_room_id: "ROOM_002" },
  { id: "SEAT_002_B2", name: "B2", seat_type_id: 4, seat_column: "2", seat_row: "B", status: "AVAILABLE", type: "VIP", cinema_room_id: "ROOM_002" },
];

// Database-aligned seats API
export const databaseSeatsAPI = {
  // Get all seats
  getAll: (): DatabaseSeat[] => {
    return [...mockSeats];
  },

  // Get seat by ID
  getSeatById: (seatId: string): DatabaseSeat | null => {
    return mockSeats.find((seat) => seat.id === seatId) || null;
  },

  // Get seats by room ID
  getByRoomId: (roomId: string): DatabaseSeat[] => {
    return mockSeats.filter((seat) => seat.cinema_room_id === roomId);
  },

  // Create new seat
  createSeat: (seatData: SeatRequest): DatabaseSeat => {
    const newId = `SEAT_${Date.now()}_${seatData.seat_row}${seatData.seat_column}`;
    const newSeat: DatabaseSeat = {
      id: newId,
      ...seatData,
    };

    mockSeats.push(newSeat);
    return newSeat;
  },

  // Update seat
  updateSeat: (seatId: string, updates: SeatUpdateRequest): DatabaseSeat | null => {
    const seatIndex = mockSeats.findIndex((seat) => seat.id === seatId);
    if (seatIndex === -1) {
      return null;
    }

    mockSeats[seatIndex] = {
      ...mockSeats[seatIndex],
      ...updates,
    };

    return mockSeats[seatIndex];
  },

  // Delete seat
  deleteSeat: (seatId: string): boolean => {
    const seatIndex = mockSeats.findIndex((seat) => seat.id === seatId);
    if (seatIndex === -1) {
      return false;
    }

    mockSeats.splice(seatIndex, 1);
    return true;
  },

  // Get seat types
  getSeatTypes: (): DatabaseSeatType[] => {
    return [...mockSeatTypes];
  },

  // Get seat type by ID
  getSeatTypeById: (typeId: number): DatabaseSeatType | null => {
    return mockSeatTypes.find((type) => type.id === typeId) || null;
  },

  // Validate seat data
  validateSeatData: (seatData: SeatRequest): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!seatData.name.trim()) {
      errors.push("Seat name is required");
    }

    if (!seatData.seat_column.trim()) {
      errors.push("Seat column is required");
    }

    if (!seatData.seat_row.trim()) {
      errors.push("Seat row is required");
    }

    if (!seatData.cinema_room_id.trim()) {
      errors.push("Cinema room ID is required");
    }

    if (seatData.seat_type_id <= 0) {
      errors.push("Valid seat type ID is required");
    }

    const validTypes = ["COUPLE", "PATH", "REGULAR", "VIP"];
    if (!validTypes.includes(seatData.type)) {
      errors.push("Invalid seat type");
    }

    const validStatuses = ["AVAILABLE", "MAINTENANCE"];
    if (!validStatuses.includes(seatData.status)) {
      errors.push("Invalid seat status");
    }

    // Check for duplicate seats in same room/row/column
    const existingSeat = mockSeats.find(
      (seat) => seat.cinema_room_id === seatData.cinema_room_id && seat.seat_row === seatData.seat_row && seat.seat_column === seatData.seat_column,
    );

    if (existingSeat) {
      errors.push("Seat already exists at this position");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Generate seats for a room based on layout
  generateSeatsForRoom: (
    roomId: string,
    layout: {
      rows: string[];
      seatsPerRow: number[];
      vipRows?: string[];
      coupleRows?: string[];
    },
  ): DatabaseSeat[] => {
    const newSeats: DatabaseSeat[] = [];

    layout.rows.forEach((rowLetter, rowIndex) => {
      const seatsInRow = layout.seatsPerRow[rowIndex] || 10;
      const isVipRow = layout.vipRows?.includes(rowLetter) || false;
      const isCoupleRow = layout.coupleRows?.includes(rowLetter) || false;

      for (let seatNum = 1; seatNum <= seatsInRow; seatNum++) {
        const seatId = `SEAT_${roomId}_${rowLetter}${seatNum}`;

        let seatTypeId = 1; // Default to SINGLE
        let seatType: "COUPLE" | "PATH" | "REGULAR" | "VIP" = "REGULAR";

        if (isCoupleRow) {
          seatTypeId = 2; // DOUBLE
          seatType = "COUPLE";
        } else if (isVipRow) {
          seatTypeId = 4; // PATH_VIP
          seatType = "VIP";
        }

        const newSeat: DatabaseSeat = {
          id: seatId,
          name: `${rowLetter}${seatNum}`,
          seat_type_id: seatTypeId,
          seat_column: seatNum.toString(),
          seat_row: rowLetter,
          status: "AVAILABLE",
          type: seatType,
          cinema_room_id: roomId,
        };

        // Link couple seats
        if (isCoupleRow && seatNum % 2 === 0) {
          const prevSeatId = `SEAT_${roomId}_${rowLetter}${seatNum - 1}`;
          newSeat.seat_link_id = prevSeatId;

          // Update previous seat to link back
          const prevSeat = newSeats[newSeats.length - 1];
          if (prevSeat) {
            prevSeat.seat_link_id = seatId;
          }
        }

        newSeats.push(newSeat);
      }
    });

    // Add to mock data
    mockSeats.push(...newSeats);

    return newSeats;
  },
};

export default databaseSeatsAPI;
