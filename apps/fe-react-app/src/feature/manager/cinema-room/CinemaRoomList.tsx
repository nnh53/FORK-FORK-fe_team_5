import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CinemaRoom } from "@/interfaces/cinemarooms.interface";
import axios from "axios";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
interface CinemaRoomListProps {
  searchQuery: string;
}

export default function CinemaRoomList({ searchQuery }: CinemaRoomListProps) {
  const navigate = useNavigate();
  const [cinemaRooms, setCinemaRooms] = useState<CinemaRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //fetching
  useEffect(() => {
    const fetchCinemaRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/cinema-rooms");
        setCinemaRooms(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching cinema rooms:", error);
        setError("Failed to load cinema rooms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

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
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    room.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : room.status === "MAINTENANCE"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {room.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(room.room_id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Seat Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
