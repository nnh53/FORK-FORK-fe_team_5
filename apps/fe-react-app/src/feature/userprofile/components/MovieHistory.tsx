import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/Shadcn/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { useAuth } from "@/hooks/useAuth";
import type { components } from "@/schema-from-be";
import { queryBookingsByUserId, transformBookingResponse } from "@/services/bookingService";
import { useCinemaRooms } from "@/services/cinemaRoomService";
import { queryMovies } from "@/services/movieService";
import { getUserIdFromCookie } from "@/utils/auth.utils";
import { Clock, Film, Loader2, MapPin, MoreHorizontal, Star, Users } from "lucide-react";
import { useMemo, useState } from "react";
type BookingResponse = components["schemas"]["BookingResponse"];
type CinemaRoomResponse = components["schemas"]["CinemaRoomResponse"];
type MovieResponse = components["schemas"]["MovieResponse"];

// Movie detail dialog component
interface MovieDetailDialogProps {
  movie: {
    id: string;
    receiptId: string;
    movieName: string;
    room: string;
    movieSlot: string;
    seats: (string | undefined)[];
    points: number;
    poster: string;
    status: string;
  };
}

const MovieDetailDialog = ({ movie }: MovieDetailDialogProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { label: "Đã xác nhận", variant: "default" as const },
      paid: { label: "Đã thanh toán", variant: "secondary" as const },
      cancelled: { label: "Đã hủy", variant: "destructive" as const },
      refunded: { label: "Đã hoàn tiền", variant: "outline" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "default" as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết giao dịch</DialogTitle>
          <DialogDescription>Thông tin chi tiết về vé đã đặt</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={movie.poster} alt={movie.movieName} className="h-20 w-16 rounded object-cover" />
            <div>
              <h3 className="font-medium">{movie.movieName}</h3>
              <p className="text-muted-foreground text-sm">Mã: {movie.receiptId}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">{movie.room}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">{movie.movieSlot}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">Ghế: {movie.seats.filter(Boolean).join(", ")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Điểm: {movie.points}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Trạng thái:</span>
            {getStatusBadge(movie.status)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const MyMovieHistory: React.FC = () => {
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
  const movieHistory = useMemo(() => {
    if (!bookingsData?.result || !Array.isArray(bookingsData.result)) {
      return [];
    }

    // Create lookup maps for quick access
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
        // Filter by status if not "ALL"
        if (statusFilter !== "ALL") {
          const transformedBooking = transformBookingResponse(booking);
          const status = transformedBooking.booking_status || "PENDING";
          if (status !== statusFilter) return false;
        }
        return true;
      })
      .map((booking: BookingResponse) => {
        const transformedBooking = transformBookingResponse(booking);

        // Get movie name from movieId
        const movieId = booking.showTime?.movieId;
        const movie = movieId ? moviesMap.get(movieId) : null;
        const movieName = movie?.name || `Movie ID: ${movieId}` || "Unknown Movie";

        // Get room name from roomId
        const roomId = booking.showTime?.roomId;
        const room = roomId ? roomsMap.get(roomId) : null;
        let roomName = "Unknown Room";
        if (room) {
          roomName = `${room.name} - ${room.type}`;
        } else if (roomId) {
          roomName = `Room ID: ${roomId}`;
        }

        return {
          id: transformedBooking.id.toString(),
          receiptId: `HD${transformedBooking.id.toString().padStart(3, "0")}`,
          movieName,
          room: roomName,
          movieSlot: (() => {
            if (transformedBooking.showtime?.show_date_time) {
              return transformedBooking.showtime.show_date_time.toLocaleString("vi-VN");
            }
            if (booking.showTime?.showDateTime) {
              return new Date(booking.showTime.showDateTime).toLocaleString("vi-VN");
            }
            return "Unknown Time";
          })(),
          seats: transformedBooking.booking_seats?.map((seatRelation) => seatRelation.seat?.name).filter(Boolean) || [],
          points: transformedBooking.loyalty_point_used || 0,
          poster: movie?.poster || "https://via.placeholder.com/100x150",
          status: transformedBooking.booking_status || "PENDING",
        };
      });
  }, [bookingsData, statusFilter, moviesData, cinemaRoomsData]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge variant="default" className="bg-green-500">
            Hoàn thành
          </Badge>
        );
      case "CANCELLED":
        return <Badge variant="destructive">Đã hủy</Badge>;
      case "PENDING":
        return <Badge variant="outline">Đang xử lý</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell">Mã hóa đơn</TableHead>
                <TableHead>Phim</TableHead>
                <TableHead className="hidden lg:table-cell">Rạp chiếu</TableHead>
                <TableHead className="hidden md:table-cell">Suất chiếu</TableHead>
                <TableHead className="hidden lg:table-cell">Ghế</TableHead>
                <TableHead className="hidden md:table-cell">Điểm</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movieHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center">
                    <div className="text-muted-foreground">
                      <Film className="mx-auto mb-2 h-12 w-12 opacity-50" />
                      <p>Chưa có lịch sử giao dịch nào</p>
                      <p className="text-sm">Hãy đặt vé xem phim để xem lịch sử tại đây</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                movieHistory.map((movie) => (
                  <TableRow key={movie.id}>
                    <TableCell className="hidden font-medium md:table-cell">{movie.receiptId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={movie.poster} alt={movie.movieName} className="h-16 w-12 rounded object-cover" />
                        <div className="space-y-1">
                          <p className="font-medium">{movie.movieName}</p>
                          <div className="text-muted-foreground space-y-1 text-sm md:hidden">
                            <p>#{movie.receiptId}</p>
                            <p>{movie.room}</p>
                            <p>{movie.movieSlot}</p>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <MapPin className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm">{movie.room}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Clock className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm">{movie.movieSlot}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Users className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm">{movie.seats.join(", ")}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{movie.points}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(movie.status)}</TableCell>
                    <TableCell>
                      <MovieDetailDialog movie={movie} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
