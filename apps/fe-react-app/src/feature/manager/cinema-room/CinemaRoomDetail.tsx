import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Checkbox } from "@/components/Shadcn/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { ROOM_STATUS_COLORS } from "@/constants/status";
import type { CinemaRoom } from "@/interfaces/cinemarooms.interface";
import type { Seat } from "@/interfaces/seat.interface";
import axios from "axios";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function CinemaRoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<CinemaRoom | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeatType, setSelectedSeatType] = useState<string>("STANDARD");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [modified, setModified] = useState(false);

  //fetching
  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return;

      try {
        setLoading(true);

        const roomResponse = await axios.get(`http://localhost:3000/cinema-rooms/${roomId}`); //room detais
        setRoom(roomResponse.data);

        const seatsResponse = await axios.get(`http://localhost:3000/cinema-rooms/${roomId}/seats`); //get seat for 1 room
        setSeats(seatsResponse.data);

        setError(null);
      } catch (error) {
        console.error("Error fetching room data:", error);
        setError("Failed to load room data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId]);

  //AC:06
  const handleGoBack = () => {
    if (modified) {
      if (confirm("You have unsaved changes. Are you sure you want to go back without saving?")) {
        navigate("/admin/cinema-room");
      }
    } else {
      navigate("/admin/cinema-room");
    }
  };

  const handleSeatSelection = (seatId: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
    setModified(true);
  };

  const handleSaveSeatTypes = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat to update");
      return;
    }

    try {
      setSaving(true);
      for (const seatId of selectedSeats) {
        await axios.put(`http://localhost:3000/seats/${seatId}`, {
          type: selectedSeatType,
        });
      }

      // Show success message (AC-04)
      toast.success("Seat types updated successfully");

      // Return to Cinema Room Management screen (AC-04)
      navigate("/admin/cinema-room");
    } catch (error) {
      console.error("Error updating seats:", error);
      setError("Failed to update seats. Please try again.");
      toast.error("Failed to update seats. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return <div className="p-4 text-center">Loading room details...</div>;
  }
  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }
  if (!room) {
    return <div className="p-4 text-center">Room not found.</div>;
  }

  // Helper functions for CSS classes
  const getStatusClassName = (status: string) => {
    return ROOM_STATUS_COLORS[status as keyof typeof ROOM_STATUS_COLORS] || "bg-gray-100 text-gray-800";
  };

  const getSeatClassName = (seat: Seat, isSelected: boolean) => {
    if (seat.status !== "AVAILABLE") return "bg-gray-400 text-white";
    if (isSelected) return "bg-green-500 text-white";
    if (seat.type.name === "VIP") return "bg-purple-100 text-purple-800";
    if (seat.type.name === "COUPLE") return "bg-amber-100 text-amber-800";
    return "bg-blue-100 text-blue-800";
  };

  // calculate width&length
  const rows = room.length;
  const columns = room.width;

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {/* show list */}
            <CardTitle>
              Cinema Room {room.id} - {room.type}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded px-2 py-1 text-xs font-medium ${getStatusClassName(room.status)}`}>{room.status}</span>
            <span className="text-sm">Capacity: {room.capacity}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="mb-4 flex items-center gap-4">
              <h3 className="text-lg font-medium">Select Seat Type:</h3>
              <Select value={selectedSeatType} onValueChange={setSelectedSeatType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select seat type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STANDARD">Standard</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="PREMIUM">Premium</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSaveSeatTypes} disabled={selectedSeats.length === 0 || saving}>
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>

            <div className="mb-2 flex justify-center">
              <div className="h-4 w-3/4 rounded-t-lg bg-gray-300"></div>
            </div>

            {/*show seat với checkbox */}
            <div className="grid grid-cols-10 justify-center gap-2">
              {Array.from({ length: rows * columns }).map((_, index) => {
                const row = String.fromCharCode(65 + Math.floor(index / columns));
                const number = (index % columns) + 1;
                const seatId = `${roomId}-${row}${number}`;

                const seat = seats.find((s) => s.id.toString() === seatId);
                const isSelected = selectedSeats.includes(seatId);

                if (!seat)
                  return (
                    <div key={`empty-${index}`} className="rounded bg-gray-200 p-2 text-center text-gray-400">
                      {row}
                      {number}
                    </div>
                  );

                return (
                  <div key={seatId} className={`flex flex-col items-center rounded p-2 text-center ${getSeatClassName(seat, isSelected)}`}>
                    <span>
                      {row}
                      {number}
                    </span>
                    {seat.status === "AVAILABLE" && (
                      <Checkbox checked={isSelected} onCheckedChange={() => handleSeatSelection(seatId)} className="mt-1" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-blue-100"></div>
                <span className="text-sm">Standard</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-purple-100"></div>
                <span className="text-sm">VIP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-amber-100"></div>
                <span className="text-sm">Premium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-gray-400"></div>
                <span className="text-sm">Unavailable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-green-500"></div>
                <span className="text-sm">Selected</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
