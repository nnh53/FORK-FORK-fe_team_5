"use client";

import { Button } from "@/components/Shadcn/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { CinemaRoom } from "@/interfaces/cinemarooms.interface";
import type { Movie } from "@/interfaces/movies.interface";
import type { Showtime } from "@/interfaces/showtime.interface";
import { transformCinemaRoomsResponse, useCinemaRooms } from "@/services/cinemaRoomService";
import { transformMoviesResponse, useMovies } from "@/services/movieService";
import { queryDeleteShowtime, queryShowtimes, transformShowtimesResponse } from "@/services/showtimeService";
import { getShowtimeStatusColor } from "@/utils/color.utils";
import { Building, Calendar, Clock, Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ShowtimeListProps {
  readonly onEditShowtime?: (showtime: Showtime) => void;
  readonly onCreateNew?: () => void;
}

export function ShowtimeList({ onEditShowtime, onCreateNew }: ShowtimeListProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<CinemaRoom[]>([]);

  // React Query hooks
  const { data: showtimesData, isLoading: showtimesLoading, refetch: refetchShowtimes } = queryShowtimes();
  const { data: moviesData, isLoading: moviesLoading } = useMovies();
  const { data: roomsData, isLoading: roomsLoading } = useCinemaRooms();
  const deleteShowtimeMutation = queryDeleteShowtime();

  // Transform API data to our interfaces
  useEffect(() => {
    if (moviesData?.result) {
      setMovies(transformMoviesResponse(moviesData.result));
    }
  }, [moviesData]);

  useEffect(() => {
    if (roomsData?.result) {
      setRooms(transformCinemaRoomsResponse(roomsData.result));
    }
  }, [roomsData]);

  const showtimes = showtimesData?.result ? transformShowtimesResponse(showtimesData.result) : [];

  const isLoading = showtimesLoading || moviesLoading || roomsLoading;

  // Helper functions to get movie and room names
  const getMovieName = (movieId: number): string => {
    const movie = movies.find((m) => m.id === movieId);
    return movie?.name || `Movie ${movieId}`;
  };

  const getRoomName = (roomId: number | undefined): string => {
    if (!roomId) return "Unknown Room";
    const room = rooms.find((r) => r.id === roomId);
    return room?.name || `Room ${roomId}`;
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa lịch chiếu này?")) {
      try {
        await deleteShowtimeMutation.mutateAsync({
          params: { path: { id } },
        });
        toast.success("Xóa lịch chiếu thành công");
        refetchShowtimes();
      } catch (error) {
        console.error("Error deleting showtime:", error);
        toast.error("Có lỗi xảy ra khi xóa lịch chiếu");
      }
    }
  };

  const formatDateTimeDisplay = (dateTime: string, type: "date-only" | "time-only"): string => {
    if (!dateTime) return "";

    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return "";

    if (type === "date-only") {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } else {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (showtimes.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground mb-4">Chưa có lịch chiếu nào được tạo.</p>
        {onCreateNew && (
          <Button onClick={onCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo lịch chiếu mới
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {onCreateNew && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Danh sách lịch chiếu</h2>
          <Button onClick={onCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo lịch chiếu mới
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Phim</TableHead>
              <TableHead>Phòng chiếu</TableHead>
              <TableHead>Ngày chiếu</TableHead>
              <TableHead>Giờ bắt đầu</TableHead>
              <TableHead>Giờ kết thúc</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showtimes.map((showtime) => (
              <TableRow key={showtime.id}>
                <TableCell className="font-medium">{getMovieName(showtime.movieId)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Building className="mr-1 h-4 w-4" />
                    {getRoomName(showtime.roomId)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {formatDateTimeDisplay(showtime.showDateTime, "date-only")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {formatDateTimeDisplay(showtime.showDateTime, "time-only")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {formatDateTimeDisplay(showtime.endDateTime, "time-only")}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-1 text-xs ${getShowtimeStatusColor(showtime.status)}`}>{showtime.status}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {onEditShowtime && (
                      <Button variant="outline" size="icon" onClick={() => onEditShowtime(showtime)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="icon" onClick={() => handleDelete(showtime.id)} disabled={deleteShowtimeMutation.isPending}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
