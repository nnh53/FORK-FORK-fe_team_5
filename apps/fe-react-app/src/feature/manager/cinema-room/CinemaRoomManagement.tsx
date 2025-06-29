import { Icon } from "@iconify/react";
import { useState } from "react";

// Import custom hooks
import { useRoomDialogs } from "./hooks/useRoomDialogs";
import { useRoomManagement } from "./hooks/useRoomManagement";
import { useSeatMapEditor } from "./hooks/useSeatMapEditor";

// Import components
import { ChangeStatusDialog } from "./components/ChangeStatusDialog";
import { CreateRoomDialog } from "./components/CreateRoomDialog";
import { EditRoomDialog } from "./components/EditRoomDialog";
import { PageHeader } from "./components/PageHeader";
import { RoomListView } from "./components/RoomListView";
import { SeatMapEditorView } from "./components/SeatMapEditorView";
import { StatisticsCards } from "./components/StatisticsCards";

type SortOption = "all" | "Standard" | "VIP" | "IMAX" | "4DX";

export default function CinemaRoomManagement() {
  // Basic UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("all");

  // Room management hook
  const { rooms, setRooms, stats, loading: roomLoading, error, setError, loadRooms, loadStats, deleteRoom } = useRoomManagement();

  // Refresh functions for dialogs
  const refreshRoomData = async () => {
    await loadRooms();
    await loadStats();
  };

  const updateRoomsAfterSeatMapChange = () => {
    setRooms((prev) =>
      prev.map((room) => (room.id === seatMapEditor.seatMap?.roomId ? { ...room, hasSeatMap: true, seatMapData: seatMapEditor.seatMap } : room)),
    );
    loadStats();
  };

  // Dialog management hook
  const dialogs = useRoomDialogs(refreshRoomData, refreshRoomData, refreshRoomData);

  // Seat map editor hook
  const seatMapEditor = useSeatMapEditor(rooms, updateRoomsAfterSeatMapChange);

  // Combined loading state
  const loading = roomLoading || dialogs.loading || seatMapEditor.loading;

  // Combined error state
  const combinedError = error || dialogs.error || seatMapEditor.error;

  // Handler functions
  const handleAddRoom = () => {
    dialogs.openCreateDialog(rooms.length);
  };

  const handleDeleteRoom = async (room: Parameters<typeof deleteRoom>[0]) => {
    await deleteRoom(room);
  };

  const clearError = () => {
    setError(null);
    dialogs.setError(null);
    seatMapEditor.setError(null);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-4 lg:p-6 space-y-6">
        {/* Header */}
        <PageHeader
          isEditorView={seatMapEditor.isEditorView}
          seatMap={seatMapEditor.seatMap}
          loading={loading}
          onAddRoom={handleAddRoom}
          onBackToRooms={seatMapEditor.handleBackToRooms}
          onSaveSeatMap={seatMapEditor.handleSaveSeatMap}
        />

        {/* Error Alert */}
        {combinedError && (
          <div className="alert alert-error shadow-lg rounded-box">
            <div className="flex items-center">
              <Icon icon="material-symbols:error" className="h-6 w-6" />
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{combinedError}</p>
              </div>
              <button onClick={clearError} className="btn btn-ghost btn-sm">
                <Icon icon="material-symbols:close" className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <StatisticsCards stats={stats} />

        {/* Main Content */}
        {!seatMapEditor.isEditorView ? (
          <RoomListView
            rooms={rooms}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onAddRoom={handleAddRoom}
            onRoomSelect={seatMapEditor.handleRoomSelect}
            onEditRoom={dialogs.openEditDialog}
            onChangeStatus={dialogs.openChangeStatusDialog}
            onDeleteRoom={handleDeleteRoom}
          />
        ) : (
          <SeatMapEditorView
            seatMap={seatMapEditor.seatMap}
            setSeatMap={seatMapEditor.setSeatMap}
            selectedSeats={seatMapEditor.selectedSeats}
            isEditorMode={seatMapEditor.isEditorMode}
            setIsEditorMode={seatMapEditor.setIsEditorMode}
            onBackToRooms={seatMapEditor.handleBackToRooms}
            onSaveSeatMap={seatMapEditor.handleSaveSeatMap}
            loading={seatMapEditor.loading}
            databaseSeats={seatMapEditor.databaseSeats}
            onSeatUpdate={seatMapEditor.handleSeatUpdate}
            onSeatCreate={seatMapEditor.handleSeatCreate}
            onSeatDelete={seatMapEditor.handleSeatDelete}
          />
        )}

        {/* Dialogs */}
        <CreateRoomDialog
          open={dialogs.createRoomDialogOpen}
          onOpenChange={dialogs.setCreateRoomDialogOpen}
          newRoomData={dialogs.newRoomData}
          setNewRoomData={dialogs.setNewRoomData}
          onCreateRoom={dialogs.handleCreateRoom}
          loading={dialogs.loading}
        />

        <EditRoomDialog
          open={dialogs.editRoomDialogOpen}
          onOpenChange={dialogs.setEditRoomDialogOpen}
          editRoomData={dialogs.editRoomData}
          setEditRoomData={dialogs.setEditRoomData}
          onEditRoom={dialogs.handleEditRoom}
          loading={dialogs.loading}
        />

        <ChangeStatusDialog
          open={dialogs.changeStatusDialogOpen}
          onOpenChange={dialogs.setChangeStatusDialogOpen}
          roomToChangeStatus={dialogs.roomToChangeStatus}
          newStatus={dialogs.newStatus}
          setNewStatus={dialogs.setNewStatus}
          onChangeStatus={dialogs.handleChangeStatus}
          loading={dialogs.loading}
        />
      </div>
    </div>
  );
}
