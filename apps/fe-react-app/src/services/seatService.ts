// Database-aligned seat service for FCinema
import type { DatabaseSeat, DatabaseSeatType, DisplaySeat, SeatMapSeat, SeatRequest, SeatUpdateRequest } from "../interfaces/seat.interface";

const API_BASE_URL = "http://localhost:3000";

export const seatService = {
  // Get all seats for a cinema room
  async getSeatsByRoomId(roomId: string): Promise<DatabaseSeat[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/database-seats/room/${roomId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching seats:", error);
      throw error;
    }
  },

  // Get a specific seat by ID
  async getSeatById(seatId: string): Promise<DatabaseSeat | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/database-seats/${seatId}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching seat:", error);
      throw error;
    }
  },

  // Create a new seat
  async createSeat(seatData: SeatRequest): Promise<DatabaseSeat> {
    try {
      const response = await fetch(`${API_BASE_URL}/database-seats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seatData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error creating seat:", error);
      throw error;
    }
  },

  // Update an existing seat
  async updateSeat(seatId: string, updates: SeatUpdateRequest): Promise<DatabaseSeat | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/database-seats/${seatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
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

  // Delete a seat
  async deleteSeat(seatId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/database-seats/${seatId}`, {
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
      console.error("Error deleting seat:", error);
      throw error;
    }
  },

  // Get all seat types
  async getSeatTypes(): Promise<DatabaseSeatType[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/database-seat-types`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching seat types:", error);
      throw error;
    }
  },

  // Bulk update seats (for editor operations)
  async bulkUpdateSeats(updates: Array<{ seatId: string; updates: SeatUpdateRequest }>): Promise<DatabaseSeat[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/seats/bulk-update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error bulk updating seats:", error);
      throw error;
    }
  },

  // Transform database seat to seat map seat
  transformDatabaseToSeatMap(dbSeat: DatabaseSeat, seatType?: DatabaseSeatType): SeatMapSeat {
    let mappedStatus: "AVAILABLE" | "MAINTENANCE" | "BOOKED" | "RESERVED";
    if (dbSeat.status === "MAINTENANCE") {
      mappedStatus = "MAINTENANCE";
    } else {
      mappedStatus = "AVAILABLE";
    }

    return {
      id: dbSeat.id,
      row: dbSeat.seat_row,
      column: dbSeat.seat_column,
      seatTypeId: dbSeat.seat_type_id,
      roomId: dbSeat.cinema_room_id,
      status: mappedStatus,
      type: dbSeat.type,
      linkedSeatId: dbSeat.seat_link_id,
      price: seatType?.price,
      seatTypeName: seatType?.name,
    };
  },

  // Transform seat map seat to database seat
  transformSeatMapToDatabase(seatMapSeat: SeatMapSeat, roomId: string): SeatRequest {
    return {
      name: `${seatMapSeat.row}${seatMapSeat.column}`,
      seat_type_id: seatMapSeat.seatTypeId,
      seat_column: seatMapSeat.column,
      seat_row: seatMapSeat.row,
      status: seatMapSeat.status === "AVAILABLE" ? "AVAILABLE" : "MAINTENANCE",
      type: seatMapSeat.type,
      cinema_room_id: roomId,
      seat_link_id: seatMapSeat.linkedSeatId,
    };
  },

  // Transform database seat to display seat
  transformToDisplaySeat(dbSeat: DatabaseSeat, seatType?: DatabaseSeatType): DisplaySeat {
    const seatMapSeat = this.transformDatabaseToSeatMap(dbSeat, seatType);

    return {
      ...seatMapSeat,
      displayRow: dbSeat.seat_row,
      displayColumn: dbSeat.seat_column,
      isAvailable: dbSeat.status === "AVAILABLE",
      formattedPrice: seatType?.price ? `${seatType.price.toLocaleString()} VNĐ` : "N/A",
    };
  },

  // Validate seat data before database operations
  validateSeatData(seatData: SeatRequest): { isValid: boolean; errors: string[] } {
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

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Generate seat map grid from database seats
  async generateSeatMapFromDatabase(
    roomId: string,
    roomWidth: number,
    roomHeight: number,
  ): Promise<{
    width: number;
    height: number;
    gridData: Record<string, unknown>[][];
    roomId: string;
    roomName: string;
  }> {
    try {
      const seats = await this.getSeatsByRoomId(roomId);
      const seatTypes = await this.getSeatTypes();

      // Create empty grid
      const grid: Record<string, unknown>[][] = Array(roomHeight)
        .fill(null)
        .map((_, row) =>
          Array(roomWidth)
            .fill(null)
            .map((_, col) => ({
              type: "empty",
              row,
              col,
            })),
        );

      // Populate grid with seats
      seats.forEach((seat) => {
        const seatType = seatTypes.find((st) => st.id === seat.seat_type_id);
        const rowIndex = parseInt(seat.seat_row) - 1; // Assuming 1-based indexing
        const colIndex = parseInt(seat.seat_column) - 1; // Assuming 1-based indexing

        if (rowIndex >= 0 && rowIndex < roomHeight && colIndex >= 0 && colIndex < roomWidth) {
          // Map database seat type to grid seat type
          let gridSeatType: string;
          if (seat.type === "VIP") {
            gridSeatType = "V";
          } else if (seat.type === "COUPLE") {
            gridSeatType = "D";
          } else {
            gridSeatType = "S";
          }

          grid[rowIndex][colIndex] = {
            type: "seat",
            row: rowIndex,
            col: colIndex,
            displayRow: seat.seat_row,
            displayCol: seat.seat_column,
            seatType: gridSeatType,
            status: seat.status.toLowerCase(),
            id: seat.id,
            linkedSeatCoords: seat.seat_link_id ? { row: rowIndex, col: colIndex + 1 } : undefined,
            isSweetbox: seat.type === "COUPLE",
            price: seatType?.price,
          } as Record<string, unknown>;
        }
      });

      return {
        width: roomWidth,
        height: roomHeight,
        gridData: grid,
        roomId,
        roomName: `Room ${roomId}`,
      };
    } catch (error) {
      console.error("Error generating seat map from database:", error);
      throw error;
    }
  },
};
