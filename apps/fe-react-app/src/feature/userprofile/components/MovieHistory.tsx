import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { useAuth } from "@/hooks/useAuth";
import type { components } from "@/schema-from-be";
import { queryBookingsByUserId } from "@/services/bookingService";
import { useCinemaRooms } from "@/services/cinemaRoomService";
import { queryMovies } from "@/services/movieService";
import { getUserIdFromCookie } from "@/utils/auth.utils";
import { Film, Loader2 } from "lucide-react";
import { useState } from "react";
import { MovieHistoryTable } from "./movie-history/MovieHistoryTable";

type BookingResponse = components["schemas"]["BookingResponse"];
type CinemaRoomResponse = components["schemas"]["CinemaRoomResponse"];
type MovieResponse = components["schemas"]["MovieResponse"];

export const MovieHistory: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Get user ID from auth context or cookies
  const { user } = useAuth();
  const userId = user?.id || getUserIdFromCookie();

  const { data: bookingsData, isLoading: bookingsLoading, error } = queryBookingsByUserId(userId || "");

  // Query all movies and cinema rooms to get names
  const { data: moviesData, isLoading: moviesLoading } = queryMovies();
  const { data: cinemaRoomsData, isLoading: roomsLoading } = useCinemaRooms();

  // Combine loading states
  const isLoading = bookingsLoading || moviesLoading || roomsLoading;

  // Transform API data to display format with conditional fetching
  const movieHistory = !bookingsData?.result || !Array.isArray(bookingsData.result)
    ? []
    : (() => {
        const moviesMap = new Map();
        if (moviesData?.result) {
          moviesData.result.forEach((movie: MovieResponse) => {
            moviesMap.set(movie.id, movie);
          });
        }

        const roomsMap = new Map();
        if (cinemaRoomsData?.result) {
          cinemaRoomsData.result.forEach((room: CinemaRoomResponse) => {
            roomsMap.set(room.id, room);
          });
        }

        return bookingsData.result
          .filter((booking: BookingResponse) => {
            if (statusFilter !== "ALL") {
              const status = booking.status || "PENDING";
              if (status !== statusFilter) return false;
            }
            return true;
          })
          .map((booking: BookingResponse) => {
            const showDateTime = booking.showTime?.showDateTime
              ? new Date(booking.showTime.showDateTime)
              : new Date(0);

            const movieId = booking.showTime?.movieId;
            const movie = movieId ? moviesMap.get(movieId) : null;
            const movieName = movie?.name || `Movie ID: ${movieId}` || "Unknown Movie";

            const roomId = booking.showTime?.roomId;
            const room = roomId ? roomsMap.get(roomId) : null;
            let roomName = "Unknown Room";
            if (room) {
              roomName = `${room.name} - ${room.type}`;
            } else if (roomId) {
              roomName = `Room ID: ${roomId}`;
            }

            return {
              id: String(booking.id),
              receiptId: `HD${String(booking.id).padStart(3, "0")}`,
              movieName,
              room: roomName,
              movieSlot: showDateTime.toLocaleString("vi-VN"),
              movieTime: showDateTime,
              seats: booking.seats?.map((seat) => seat.name).filter(Boolean) || [],
              points: booking.loyaltyPointsUsed || 0,
              poster: movie?.poster || "https://via.placeholder.com/100x150",
              status: booking.status || "PENDING",
            };
          })
          .sort((a, b) => b.movieTime.getTime() - a.movieTime.getTime());
      })();

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Film className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold">Lịch sử giao dịch</h1>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Đang tải lịch sử giao dịch...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Film className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold">Lịch sử giao dịch</h1>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="mb-2 text-red-500">Không thể tải lịch sử giao dịch</p>
              <p className="text-muted-foreground text-sm">Vui lòng thử lại sau</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Film className="text-primary h-6 w-6" />
        <h1 className="text-3xl font-bold">Lịch sử giao dịch</h1>
      </div>

      {/* Movie History List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Film className="h-5 w-5" />
                Lịch sử xem phim
              </CardTitle>
              <CardDescription>Danh sách các phim bạn đã xem tại FCinema</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="status-filter" className="text-sm font-medium">
                Lọc theo trạng thái:
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter" className="w-40">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  <SelectItem value="SUCCESS">Hoàn thành</SelectItem>
                  <SelectItem value="PENDING">Đang xử lý</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <MovieHistoryTable movieHistory={movieHistory} />
        </CardContent>
      </Card>
    </div>
  );
};
