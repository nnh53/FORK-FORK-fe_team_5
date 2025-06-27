import { useState } from "react";
import type { CinemaRoomWithSeatMap } from "../../../../interfaces/cinemarooms.interface";
import type { SeatMapGrid, SelectedSeat } from "../../../../interfaces/seatmap.interface";
import { seatMapService } from "../../../../services/seatMapService";
import { createSeatMapGrid } from "../../../../utils/seatMapUtils";

export const useSeatMapEditor = (rooms: CinemaRoomWithSeatMap[], onRoomsUpdate: () => void) => {
  const [isEditorView, setIsEditorView] = useState(false);
  const [seatMap, setSeatMap] = useState<SeatMapGrid | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      let seatMapToLoad: SeatMapGrid;

      // Try to load existing seat map from API if room has one
      if (room.hasSeatMap) {
        const existingSeatMap = await seatMapService.getSeatMapByRoomId(roomId);
        if (existingSeatMap) {
          seatMapToLoad = existingSeatMap;
        } else {
          // Fallback to creating new seat map if API call fails
          seatMapToLoad = createSeatMapGrid(room.width, room.height, room.id, room.name);
        }
      } else {
        // Create new seat map for rooms without one
        seatMapToLoad = createSeatMapGrid(room.width, room.height, room.id, room.name);
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
  };
};
