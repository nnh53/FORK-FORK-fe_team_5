import { useState } from "react";
import type { CinemaRoomWithSeatMap, ComponentRoomStatus } from "../../../../interfaces/cinemarooms.interface";
import { seatMapService } from "../../../../services/seatMapService";

type RoomStatus = ComponentRoomStatus;

interface CreateRoomData {
  name: string;
  type: string;
  capacity: number;
  status: RoomStatus;
  width: number;
  height: number;
  roomNumber: number;
  fee: number;
}

interface EditRoomData {
  name: string;
  type: string;
  width: number;
  height: number;
}

export const useRoomDialogs = (onRoomCreated: () => void, onRoomUpdated: () => void, onStatusChanged: () => void) => {
  // Create room dialog state
  const [createRoomDialogOpen, setCreateRoomDialogOpen] = useState(false);
  const [newRoomData, setNewRoomData] = useState<CreateRoomData>({
    name: "",
    type: "Standard",
    capacity: 160,
    status: "active",
    width: 16,
    height: 10,
    roomNumber: 0,
    fee: 80000,
  });

  // Edit room dialog state
  const [editRoomDialogOpen, setEditRoomDialogOpen] = useState(false);
  const [editRoomData, setEditRoomData] = useState<EditRoomData>({
    name: "",
    type: "Standard",
    width: 16,
    height: 10,
  });
  const [roomToEdit, setRoomToEdit] = useState<CinemaRoomWithSeatMap | null>(null);

  // Change status dialog state
  const [changeStatusDialogOpen, setChangeStatusDialogOpen] = useState(false);
  const [roomToChangeStatus, setRoomToChangeStatus] = useState<CinemaRoomWithSeatMap | null>(null);
  const [newStatus, setNewStatus] = useState<RoomStatus>("active");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Open create room dialog with default values
  const openCreateDialog = (roomsCount: number) => {
    setNewRoomData({
      name: `Phòng ${roomsCount + 1}`,
      type: "Standard",
      capacity: 160,
      status: "active",
      width: 16,
      height: 10,
      roomNumber: 100 + roomsCount + 1,
      fee: 80000,
    });
    setCreateRoomDialogOpen(true);
  };

  // Open edit room dialog
  const openEditDialog = (room: CinemaRoomWithSeatMap) => {
    setRoomToEdit(room);
    setEditRoomData({
      name: room.name,
      type: room.type,
      width: room.width,
      height: room.height,
    });
    setEditRoomDialogOpen(true);
  };

  // Open change status dialog
  const openChangeStatusDialog = (room: CinemaRoomWithSeatMap) => {
    setRoomToChangeStatus(room);
    setNewStatus(room.status);
    setChangeStatusDialogOpen(true);
  };

  // Create room handler
  const handleCreateRoom = async () => {
    if (!newRoomData.name.trim()) {
      alert("Please enter room name");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await seatMapService.createRoom(newRoomData);
      setCreateRoomDialogOpen(false);
      onRoomCreated();
      alert("Room created successfully!");
    } catch (err) {
      setError("Failed to create new room");
      console.error("Error creating room:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit room handler
  const handleEditRoom = async () => {
    if (!editRoomData.name.trim()) {
      alert("Please enter room name");
      return;
    }

    if (!roomToEdit) {
      setError("Room not found");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updatedRoom = await seatMapService.updateRoom(roomToEdit.id, editRoomData);
      if (updatedRoom) {
        setEditRoomDialogOpen(false);
        setRoomToEdit(null);
        onRoomUpdated();
        alert("Room updated successfully!");
      } else {
        setError("Failed to update room - room not found");
      }
    } catch (err) {
      setError("Failed to update room");
      console.error("Error updating room:", err);
    } finally {
      setLoading(false);
    }
  };

  // Change status handler
  const handleChangeStatus = async () => {
    if (!roomToChangeStatus) return;

    try {
      setLoading(true);
      setError(null);

      const success = await seatMapService.updateRoomStatus(roomToChangeStatus.id, newStatus);
      if (success) {
        setChangeStatusDialogOpen(false);
        setRoomToChangeStatus(null);
        onStatusChanged();
        alert("Room status updated successfully!");
      } else {
        setError("Failed to update room status - room not found");
      }
    } catch (err) {
      setError("Failed to update room status");
      console.error("Error updating room status:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    // Create room dialog
    createRoomDialogOpen,
    setCreateRoomDialogOpen,
    newRoomData,
    setNewRoomData,
    openCreateDialog,
    handleCreateRoom,

    // Edit room dialog
    editRoomDialogOpen,
    setEditRoomDialogOpen,
    editRoomData,
    setEditRoomData,
    roomToEdit,
    openEditDialog,
    handleEditRoom,

    // Change status dialog
    changeStatusDialogOpen,
    setChangeStatusDialogOpen,
    roomToChangeStatus,
    newStatus,
    setNewStatus,
    openChangeStatusDialog,
    handleChangeStatus,

    // Common
    loading,
    error,
    setError,
  };
};
