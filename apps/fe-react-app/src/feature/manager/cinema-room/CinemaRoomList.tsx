import { Button } from "@/components/Shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import type { CinemaRoom } from "@/interfaces/cinemarooms.interface";
import { Edit, Eye, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CinemaRoomListProps {
  searchQuery: string;
  onRefresh?: () => void;
}

export default function CinemaRoomList({ searchQuery, onRefresh }: CinemaRoomListProps) {
  const navigate = useNavigate();
  const [cinemaRooms, setCinemaRooms] = useState<CinemaRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<CinemaRoom | null>(null);

  const fetchCinemaRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/cinema-rooms");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCinemaRooms(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching cinema rooms:", error);
      setError("Failed to load cinema rooms. Please try again later.");
      toast.error("Failed to load cinema rooms");
    } finally {
      setLoading(false);
    }
  };

  //fetching
  useEffect(() => {
    fetchCinemaRooms();
  }, []);

  //filter rooms
  const filteredRooms = cinemaRooms.filter((room) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return room.room_id.toLowerCase().includes(query) || room.room_number.toString().includes(query) || room.type.toLowerCase().includes(query);
  });

  const handleViewDetails = (roomId: string) => {
    navigate(`/admin/cinema-room/${roomId}`);
  };

  const handleEditRoom = (roomId: string) => {
    navigate(`/admin/cinema-room/edit/${roomId}`);
  };

  const handleDeleteClick = (room: CinemaRoom) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roomToDelete) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/cinema-rooms/${roomToDelete.room_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Cinema room deleted successfully");

      // Refresh the list
      await fetchCinemaRooms();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error deleting cinema room:", error);
      toast.error("Failed to delete cinema room");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setRoomToDelete(null);
    }
  };

  const getStatusClassName = (status: string) => {
    if (status === "ACTIVE") return "bg-green-100 text-green-800";
    if (status === "MAINTENANCE") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (loading) {
    return <div className="text-center p-4">Loading cinema rooms...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }
  if (filteredRooms.length === 0) {
    return <div className="text-center p-4">No cinema rooms found{searchQuery ? " matching your search" : ""}.</div>;
  }
  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cinema Room ID</TableHead>
              <TableHead>Cinema Room Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.map((room) => (
              <TableRow key={room.room_id}>
                <TableCell>{room.room_id}</TableCell>
                <TableCell>{room.room_number}</TableCell>
                <TableCell>{room.type}</TableCell>
                <TableCell>{room.capacity}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusClassName(room.status)}`}>{room.status}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleViewDetails(room.room_id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleEditRoom(room.room_id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteClick(room)}>
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Cinema Room</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete cinema room {roomToDelete?.room_number}? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
