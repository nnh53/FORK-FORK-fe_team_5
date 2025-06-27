import { useEffect, useState } from "react";
import type { CinemaRoomWithSeatMap } from "../../../../interfaces/cinemarooms.interface";
import { seatMapService } from "../../../../services/seatMapService";

interface RoomStats {
  total: number;
  withSeatMap: number;
  active: number;
  maintenance: number;
  closed: number;
}

export const useRoomManagement = () => {
  const [rooms, setRooms] = useState<CinemaRoomWithSeatMap[]>([]);
  const [stats, setStats] = useState<RoomStats>({
    total: 0,
    withSeatMap: 0,
    active: 0,
    maintenance: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all rooms from API
  const loadRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const rooms = await seatMapService.getAllRooms();
      setRooms(rooms);
    } catch (err) {
      setError("Failed to load rooms");
      console.error("Error loading rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load room statistics
  const loadStats = async () => {
    try {
      const stats = await seatMapService.getRoomStats();
      setStats(stats);
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  // Delete room
  const deleteRoom = async (room: CinemaRoomWithSeatMap) => {
    if (!confirm(`Are you sure you want to delete "${room.name}"?`)) {
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const success = await seatMapService.deleteRoom(room.id);
      if (success) {
        setRooms((prev) => prev.filter((r) => r.id !== room.id));
        await loadStats();
        alert("Room deleted successfully!");
        return true;
      } else {
        setError("Failed to delete room - room not found");
        return false;
      }
    } catch (err) {
      setError("Failed to delete room");
      console.error("Error deleting room:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load initial data when hook is used
  useEffect(() => {
    loadRooms();
    loadStats();
  }, []);

  return {
    rooms,
    setRooms,
    stats,
    loading,
    error,
    setError,
    loadRooms,
    loadStats,
    deleteRoom,
  };
};
