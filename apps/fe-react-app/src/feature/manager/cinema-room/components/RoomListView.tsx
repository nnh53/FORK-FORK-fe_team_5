import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Icon } from "@iconify/react";
import { Plus } from "lucide-react";
import React from "react";
import type { CinemaRoomWithSeatMap } from "../../../../interfaces/cinemarooms.interface";

type SortOption = "all" | "Standard" | "VIP" | "IMAX" | "4DX";

// RoomCard component (extracted from the original file)
const getRoomTypeIcon = (type: string) => {
  switch (type) {
    case "VIP":
      return "material-symbols:crown";
    case "IMAX":
      return "material-symbols:movie";
    case "4DX":
      return "material-symbols:view-in-ar";
    default:
      return "material-symbols:chair";
  }
};

const getRoomTypeColor = (type: string) => {
  switch (type) {
    case "VIP":
      return "badge badge-warning border-warning/20";
    case "IMAX":
      return "badge badge-info border-info/20";
    case "4DX":
      return "badge badge-success border-success/20";
    default:
      return "badge badge-neutral border-neutral/20";
  }
};

const getRoomStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return "material-symbols:check-circle";
    case "maintenance":
      return "material-symbols:build";
    case "closed":
      return "material-symbols:cancel";
    default:
      return "material-symbols:help";
  }
};

const getRoomStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "badge badge-success border-success/20";
    case "maintenance":
      return "badge badge-warning border-warning/20";
    case "closed":
      return "badge badge-error border-error/20";
    default:
      return "badge badge-neutral border-neutral/20";
  }
};

interface RoomCardProps {
  room: CinemaRoomWithSeatMap;
  onRoomSelect: (roomId: string) => void;
  onEditRoom: (room: CinemaRoomWithSeatMap) => void;
  onChangeStatus: (room: CinemaRoomWithSeatMap) => void;
  onDeleteRoom: (room: CinemaRoomWithSeatMap) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onRoomSelect, onEditRoom, onChangeStatus, onDeleteRoom }) => (
  <Card className="hover:shadow-xl transition-all duration-200 hover:-translate-y-1 bg-base-100 border border-base-300 overflow-hidden group">
    <CardContent className="p-0">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-base-content mb-1 group-hover:text-primary transition-colors">{room.name}</h3>
            <p className="text-sm text-base-content/60 mb-3">{room.id}</p>

            <div className="flex gap-2">
              <span className={`${getRoomTypeColor(room.type)} text-xs font-medium`}>
                <Icon icon={getRoomTypeIcon(room.type)} className="mr-1 h-3 w-3" />
                {room.type}
              </span>
              <span className={`${getRoomStatusColor(room.status)} text-xs font-medium`}>
                <Icon icon={getRoomStatusIcon(room.status)} className="mr-1 h-3 w-3" />
                {room.status}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-base-content/70">
              <Icon icon="material-symbols:people" className="mr-2 h-4 w-4" />
              Capacity
            </div>
            <span className="font-semibold text-base-content">{room.capacity} seats</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-base-content/70">
              <Icon icon="material-symbols:grid-view" className="mr-2 h-4 w-4" />
              Seat Map
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${room.hasSeatMap ? "bg-success" : "bg-error"}`}></div>
              <span className={`font-medium text-sm ${room.hasSeatMap ? "text-success" : "text-error"}`}>
                {room.hasSeatMap ? "Configured" : "Not configured"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-base-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRoomSelect(room.id);
            }}
            className="btn btn-primary btn-sm flex-1"
          >
            <Icon icon="material-symbols:edit" className="mr-1 h-4 w-4" />
            Edit Layout
          </button>

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-sm">
              <Icon icon="material-symbols:more-vert" className="h-4 w-4" />
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 border border-base-300 rounded-box w-48">
              <li>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditRoom(room);
                  }}
                  className="text-sm hover:bg-base-200"
                >
                  <Icon icon="material-symbols:edit" className="h-4 w-4" />
                  Edit Info
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeStatus(room);
                  }}
                  className="text-sm hover:bg-base-200"
                >
                  <Icon icon="material-symbols:swap-horiz" className="h-4 w-4" />
                  Change Status
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRoom(room);
                  }}
                  className="text-sm hover:bg-error hover:text-error-content"
                >
                  <Icon icon="material-symbols:delete" className="h-4 w-4" />
                  Delete Room
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface RoomListViewProps {
  rooms: CinemaRoomWithSeatMap[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  onAddRoom: () => void;
  onRoomSelect: (roomId: string) => void;
  onEditRoom: (room: CinemaRoomWithSeatMap) => void;
  onChangeStatus: (room: CinemaRoomWithSeatMap) => void;
  onDeleteRoom: (room: CinemaRoomWithSeatMap) => void;
}

export const RoomListView: React.FC<RoomListViewProps> = ({
  rooms,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  onAddRoom,
  onRoomSelect,
  onEditRoom,
  onChangeStatus,
  onDeleteRoom,
}) => {
  // Filter rooms
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || room.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSort = sortBy === "all" || room.type === sortBy;
    return matchesSearch && matchesSort;
  });

  return (
    <Card className="shadow-lg border-base-300 bg-base-100">
      <CardHeader className="bg-base-200/50 border-b border-base-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl text-base-content">Cinema Rooms</CardTitle>
            <CardDescription className="text-base-content/70">Manage your cinema rooms and seat layouts efficiently</CardDescription>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 lg:w-auto w-full">
            <div className="relative">
              <Icon icon="material-symbols:search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 h-4 w-4" />
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64 input input-bordered bg-base-100 border-base-300 focus:border-primary"
              />
            </div>

            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-48 border-base-300 bg-base-100 hover:bg-base-200">
                <Icon icon="material-symbols:filter-list" className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-base-100 border-base-300">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="IMAX">IMAX</SelectItem>
                <SelectItem value="4DX">4DX</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {filteredRooms.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="bg-base-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Icon icon="material-symbols:search-off" className="h-12 w-12 text-base-content/50" />
            </div>
            <h3 className="text-xl font-semibold text-base-content mb-3">No Rooms Found</h3>
            <p className="text-base-content/70 mb-6 max-w-md mx-auto">
              No rooms match your current search criteria. Try adjusting your search terms or create a new room.
            </p>
            <button onClick={onAddRoom} className="btn btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Room
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onRoomSelect={onRoomSelect}
                onEditRoom={onEditRoom}
                onChangeStatus={onChangeStatus}
                onDeleteRoom={onDeleteRoom}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
