import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CinemaRoom, Seat } from "@/interfaces/cinemarooms.interface";
import axios from "axios";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CinemaRoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<CinemaRoom | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeatType, setSelectedSeatType] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

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

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const handleSaveSeatTypes = async () => {
    if (!selectedSeatType || selectedSeats.length === 0) return;
    try {
      setSaving(true);
      for (const seatId of selectedSeats) {
        await axios.put(`http://localhost:3000/seats/${seatId}`, {
          type: selectedSeatType,
        });
      }
      const response = await axios.get(`http://localhost:3000/cinema-rooms/${roomId}/seats`);
      setSeats(response.data);
      setSelectedSeats([]);
      setSelectedSeatType(null);
    } catch (error) {
      console.error("Error updating seats:", error);
      setError("Failed to update seats. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return <div className="text-center p-4">Loading room details...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }
  if (!room) {
    return <div className="text-center p-4">Room not found.</div>;
  }
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
            <CardTitle>
              Cinema Room {room.room_number} - {room.type}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
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
            <span className="text-sm">Capacity: {room.capacity}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-lg font-medium">Edit Seat Types:</h3>
              <Select value={selectedSeatType || ""} onValueChange={setSelectedSeatType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select seat type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STANDARD">Standard</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="PREMIUM">Premium</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSaveSeatTypes} disabled={!selectedSeatType || selectedSeats.length === 0 || saving}>
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

            <div className="flex justify-center mb-2">
              <div className="w-3/4 h-4 bg-gray-300 rounded-t-lg"></div>
            </div>

            <div className="grid grid-cols-10 gap-2 justify-center">
              {Array.from({ length: rows * columns }).map((_, index) => {
                const row = String.fromCharCode(65 + Math.floor(index / columns));
                const number = (index % columns) + 1;
                const seatId = `${roomId}-${row}${number}`;

                const seat = seats.find((s) => s.seat_id === seatId);
                const isSelected = selectedSeats.includes(seatId);

                return (
                  <div
                    key={seatId}
                    className={`p-2 text-center rounded cursor-pointer transition-colors ${
                      !seat
                        ? "bg-gray-200 text-gray-400"
                        : seat.status !== "AVAILABLE"
                          ? "bg-gray-400 text-white"
                          : isSelected
                            ? "bg-blue-500 text-white"
                            : seat.type === "VIP"
                              ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                              : seat.type === "PREMIUM"
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                    onClick={() => seat && seat.status === "AVAILABLE" && handleSeatClick(seatId)}
                  >
                    {row}
                    {number}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 rounded"></div>
                <span className="text-sm">Standard</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-100 rounded"></div>
                <span className="text-sm">VIP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-100 rounded"></div>
                <span className="text-sm">Premium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <span className="text-sm">Unavailable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">Selected</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
