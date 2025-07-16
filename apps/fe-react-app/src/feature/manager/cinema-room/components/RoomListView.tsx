import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/Shadcn/ui/dropdown-menu";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Icon } from "@iconify/react";
import { Plus } from "lucide-react";
import React from "react";
import type { CinemaRoom } from "../../../../interfaces/cinemarooms.interface";

type SortOption = "all" | "Standard" | "VIP" | "IMAX" | "4DX";

// RoomCard component (extracted from the original file)
const getRoomTypeIcon = (type: string) => {
  switch (type) {
    case "VIP":
      return "mdi:star";
    case "IMAX":
      return "mdi:theater";
    case "4DX":
      return "mdi:rocket-launch";
    default:
      return "mdi:movie";
  }
};

const getRoomTypeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (type) {
    case "VIP":
      return "default";
    case "IMAX":
      return "secondary";
    case "4DX":
      return "outline";
    default:
      return "secondary";
  }
};

const getRoomStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return "mdi:check-circle";
    case "maintenance":
      return "mdi:wrench";
    case "closed":
      return "mdi:cancel";
    default:
      return "mdi:help-circle";
  }
};

const getRoomStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "active":
      return "default";
    case "maintenance":
      return "outline";
    case "closed":
      return "destructive";
    default:
      return "secondary";
  }
};

interface RoomCardProps {
  room: CinemaRoom;
  onRoomSelect: (roomId: string) => void;
  onEditRoom: (room: CinemaRoom) => void;
  onChangeStatus: (room: CinemaRoom) => void;
  onDeleteRoom: (room: CinemaRoom) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onRoomSelect, onEditRoom, onChangeStatus, onDeleteRoom }) => (
  <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 overflow-hidden group">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{room.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{room.id}</p>

          <div className="flex gap-2">
            <Badge variant={getRoomTypeVariant(room.type ?? "")} className="text-xs">
              <Icon icon={getRoomTypeIcon(room.type ?? "")} className="mr-1 h-3 w-3" />
              {room.type}
            </Badge>
            <Badge variant={getRoomStatusVariant(room.status ?? "")} className="text-xs">
              <Icon icon={getRoomStatusIcon(room.status ?? "")} className="mr-1 h-3 w-3" />
              {room.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Icon icon="mdi:account-group" className="mr-2 h-4 w-4" />
            Capacity
          </div>
          <span className="font-semibold">{room.capacity} seats</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Icon icon="mdi:view-grid" className="mr-2 h-4 w-4" />
            Seat Map
          </div>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${room.seats && room.seats.length > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className={`font-medium text-sm ${room.seats && room.seats.length > 0 ? "text-green-600" : "text-red-600"}`}>
              {room.seats && room.seats.length > 0 ? "Configured" : "Not configured"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button
          onClick={(e) => {
            e.stopPropagation();
              onRoomSelect(room.id?.toString() || "");
          }}
          className="flex-1"
          size="sm"
        >
          <Icon icon="mdi:pencil" className="mr-1 h-4 w-4" />
          Edit Layout
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Icon icon="mdi:dots-vertical" className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEditRoom(room);
              }}
            >
              <Icon icon="mdi:pencil" className="mr-2 h-4 w-4" />
              Edit Info
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onChangeStatus(room);
              }}
            >
              <Icon icon="mdi:swap-horizontal" className="mr-2 h-4 w-4" />
              Change Status
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRoom(room);
              }}
              className="text-red-600 focus:text-red-600"
            >
              <Icon icon="mdi:delete" className="mr-2 h-4 w-4" />
              Delete Room
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardContent>
  </Card>
);

interface RoomListViewProps {
  rooms: CinemaRoom[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  onAddRoom: () => void;
  onRoomSelect: (roomId: string) => void;
  onEditRoom: (room: CinemaRoom) => void;
  onChangeStatus: (room: CinemaRoom) => void;
  onDeleteRoom: (room: CinemaRoom) => void;
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
      const matchesSearch =
        (room.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (room.id?.toString().toLowerCase() || "").includes(searchQuery.toLowerCase());
      const matchesSort = sortBy === "all" || room.type === sortBy;
      return matchesSearch && matchesSort;
    });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Cinema Rooms</CardTitle>
            <CardDescription>Manage your cinema rooms and seat layouts efficiently</CardDescription>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 lg:w-auto w-full">
            <div className="relative">
              <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>

            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <Icon icon="mdi:filter-variant" className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
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
            <div className="bg-muted rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Icon icon="mdi:magnify-close" className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-3">No Rooms Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              No rooms match your current search criteria. Try adjusting your search terms or create a new room.
            </p>
            <Button onClick={onAddRoom}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Room
            </Button>
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
