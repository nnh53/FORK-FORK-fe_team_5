import { useState } from "react";
import type { CinemaRoomWithSeatMap } from "../../../../interfaces/cinemarooms.interface";
import type { DatabaseSeat } from "../../../../interfaces/seat.interface";
import type { SeatMapGrid, SelectedSeat } from "../../../../interfaces/seatmap.interface";
import { seatMapService } from "../../../../services/seatMapService";
import { seatService } from "../../../../services/seatService";
import { createSeatMapGrid } from "../../../../utils/seatMapUtils";

export const useSeatMapEditor = (rooms: CinemaRoomWithSeatMap[], onRoomsUpdate: () => void) => {
  const [isEditorView, setIsEditorView] = useState(false);
  const [seatMap, setSeatMap] = useState<SeatMapGrid | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Database-aligned state
  const [databaseSeats, setDatabaseSeats] = useState<DatabaseSeat[]>([]);

  // Load database seats for a room
  const loadDatabaseSeats = async (roomId: string): Promise<DatabaseSeat[]> => {
    try {
      const seats = await seatService.getSeatsByRoomId(roomId);
      setDatabaseSeats(seats);
      return seats;
    } catch (error) {
      console.error("Error loading database seats:", error);
      return [];
    }
  };

  // Handle seat create
  const handleSeatCreate = async (seatData: Omit<DatabaseSeat, "id">): Promise<DatabaseSeat> => {
    try {
      const newSeat = await seatService.createSeat({
        name: seatData.name,
        seat_column: seatData.seat_column,
        seat_row: seatData.seat_row,
        status: seatData.status,
        type: seatData.type,
        cinema_room_id: seatData.cinema_room_id,
        seat_type_id: seatData.seat_type_id,
        seat_link_id: seatData.seat_link_id,
      });

      // Update local state
      setDatabaseSeats((prev) => [...prev, newSeat]);

      return newSeat;
    } catch (error) {
      console.error("Error creating seat:", error);
      throw error;
    }
  };

  // Handle seat update
  const handleSeatUpdate = async (seatId: string, updates: Partial<DatabaseSeat>): Promise<void> => {
    try {
      const updatedSeat = await seatService.updateSeat(seatId, updates);
      if (updatedSeat) {
        // Update local state
        setDatabaseSeats((prev) => prev.map((seat) => (seat.id === seatId ? updatedSeat : seat)));
      }
    } catch (error) {
      console.error("Error updating seat:", error);
      throw error;
    }
  };

  // Handle seat delete
  const handleSeatDelete = async (seatId: string): Promise<void> => {
    try {
      const success = await seatService.deleteSeat(seatId);
      if (success) {
        // Update local state
        setDatabaseSeats((prev) => prev.filter((seat) => seat.id !== seatId));
      }
    } catch (error) {
      console.error("Error deleting seat:", error);
      throw error;
    }
  };

  // Handle room selection for editing
  const handleRoomSelect = async (roomId: string) => {
    try {
      setLoading(true);
      setError(null);

      const room = rooms.find((r) => r.id === roomId);
      if (!room) {
        setError("Room not found");
        return;
      }

      // Load database seats first
      const dbSeats = await loadDatabaseSeats(roomId);

      let seatMapToLoad: SeatMapGrid;

      // Try to load existing seat map from API if room has one
      if (room.hasSeatMap) {
        const existingSeatMap = await seatMapService.getSeatMapByRoomId(roomId);
        if (existingSeatMap) {
          seatMapToLoad = existingSeatMap;
        } else {
          // Generate seat map from database seats if available
          if (dbSeats.length > 0) {
            const generatedGrid = await seatService.generateSeatMapFromDatabase(roomId, room.width, room.height);
            seatMapToLoad = {
              ...generatedGrid,
              gridData: generatedGrid.gridData as unknown[][],
            } as SeatMapGrid;
          } else {
            // Fallback to creating new seat map if API call fails
            seatMapToLoad = createSeatMapGrid(room.width, room.height, room.id, room.name);
          }
        }
      } else {
        // Generate seat map from database seats if available, otherwise create new
        if (dbSeats.length > 0) {
          const generatedGrid = await seatService.generateSeatMapFromDatabase(roomId, room.width, room.height);
          seatMapToLoad = {
            ...generatedGrid,
            gridData: generatedGrid.gridData as unknown[][],
          } as SeatMapGrid;
        } else {
          seatMapToLoad = createSeatMapGrid(room.width, room.height, room.id, room.name);
        }
      }

      setSeatMap(seatMapToLoad);
      setSelectedSeats([]);
      setIsEditorView(true);
    } catch (err) {
      setError("Failed to load seat map");
      console.error("Error loading seat map:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle saving seat map
  const handleSaveSeatMap = async () => {
    if (!seatMap) return;

    try {
      setLoading(true);
      setError(null);

      const success = await seatMapService.saveSeatMap(seatMap.roomId, seatMap);
      if (success) {
        onRoomsUpdate();
        alert("Seat map saved successfully!");
        setIsEditorMode(false);
      } else {
        setError("Failed to save seat map - room not found");
      }
    } catch (err) {
      setError("Failed to save seat map");
      console.error("Error saving seat map:", err);
    } finally {
      setLoading(false);
    }
  };

  // Go back to room list
  const handleBackToRooms = () => {
    setIsEditorView(false);
    setSeatMap(null);
    setSelectedSeats([]);
    setIsEditorMode(false);
  };

  return {
    isEditorView,
    setIsEditorView,
    seatMap,
    setSeatMap,
    selectedSeats,
    setSelectedSeats,
    isEditorMode,
    setIsEditorMode,
    loading,
    error,
    setError,
    handleRoomSelect,
    handleSaveSeatMap,
    handleBackToRooms,
    // Database integration
    databaseSeats,
    handleSeatCreate,
    handleSeatUpdate,
    handleSeatDelete,
  };
};
