import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/Shadcn/ui/alert-dialog";
import { Button } from "@/components/Shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Shadcn/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import type { FilterCriteria } from "@/components/shared/Filter";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { CinemaRoom } from "@/interfaces/cinemarooms.interface";
import type { Movie } from "@/interfaces/movies.interface";
import type { Showtime } from "@/interfaces/showtime.interface";
import { transformCinemaRoomsResponse, useCinemaRooms } from "@/services/cinemaRoomService";
import { transformMoviesResponse, useMovies } from "@/services/movieService";
import { queryDeleteShowtime, queryShowtimes, transformShowtimesResponse } from "@/services/showtimeService";
import { getShowtimeStatusColor } from "@/utils/color.utils";
import { Building, Calendar, Clock, Edit, MoreHorizontal, Plus, Trash2, X } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { toast } from "sonner";

interface ShowtimeListProps {
  readonly onEditShowtime?: (showtime: Showtime) => void;
  readonly onCreateNew?: () => void;
  readonly searchTerm?: string;
  readonly filterCriteria?: FilterCriteria[];
}

export const ShowtimeList = forwardRef<{ resetPagination: () => void }, ShowtimeListProps>(
  ({ onEditShowtime, onCreateNew, searchTerm = "", filterCriteria = [] }, ref) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [rooms, setRooms] = useState<CinemaRoom[]>([]);
    const [dateFilter, setDateFilter] = useState<{
      startDate: string;
      endDate: string;
    }>({
      startDate: "",
      endDate: "",
    });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [showtimeToDelete, setShowtimeToDelete] = useState<Showtime | null>(null);

    useImperativeHandle(ref, () => ({
      resetPagination: () => {
        console.log("Pagination reset");
      },
    }));

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

    const showtimes = useMemo(() => {
      return showtimesData?.result ? transformShowtimesResponse(showtimesData.result) : [];
    }, [showtimesData?.result]);

    // Helper function to match filter criteria
    const matchesCriteria = (showtime: Showtime, criteria: FilterCriteria): boolean => {
      if (criteria.field === "status") {
        return showtime.status === criteria.value;
      }
      return true;
    };

    // Apply search and filter logic
    const filteredShowtimes = useMemo(() => {
      let result = showtimes;

      // Helper functions for this scope
      const getMovieNameForFilter = (movieId: number): string => {
        const movie = movies.find((m) => m.id === movieId);
        return movie?.name || `Movie ${movieId}`;
      };

      // Apply date filter first (existing functionality)
      result = result.filter((showtime) => {
        if (!dateFilter.startDate && !dateFilter.endDate) return true;

        const showtimeDate = new Date(showtime.showDateTime).toISOString().split("T")[0];

        if (dateFilter.startDate && dateFilter.endDate) {
          return showtimeDate >= dateFilter.startDate && showtimeDate <= dateFilter.endDate;
        } else if (dateFilter.startDate) {
          return showtimeDate >= dateFilter.startDate;
        } else if (dateFilter.endDate) {
          return showtimeDate <= dateFilter.endDate;
        }

        return true;
      });

      // Apply search filter
      if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        result = result.filter((showtime) => {
          const movieName = getMovieNameForFilter(showtime.movieId).toLowerCase();
          const showtimeDate = new Date(showtime.showDateTime).toLocaleDateString("vi-VN");

          return movieName.includes(lower) || showtimeDate.includes(lower);
        });
      }

      // Apply filter criteria
      if (filterCriteria.length > 0) {
        result = result.filter((showtime) => {
          return filterCriteria.every((criteria) => matchesCriteria(showtime, criteria));
        });
      }

      return result;
    }, [showtimes, dateFilter, searchTerm, filterCriteria, movies]);

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

    const handleDelete = (showtime: Showtime) => {
      setShowtimeToDelete(showtime);
      setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
      if (!showtimeToDelete?.id) return;

      try {
        await deleteShowtimeMutation.mutateAsync({
          params: { path: { id: showtimeToDelete.id } },
        });
        toast.success("Xóa lịch chiếu thành công");
        refetchShowtimes();
      } catch (error) {
        console.error("Error deleting showtime:", error);
        toast.error("Có lỗi xảy ra khi xóa lịch chiếu");
      } finally {
        setIsDeleteDialogOpen(false);
        setShowtimeToDelete(null);
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

    if (filteredShowtimes.length === 0) {
      const hasActiveFilters = searchTerm || filterCriteria.length > 0 || dateFilter.startDate || dateFilter.endDate;

      let emptyMessage = "Không tìm thấy lịch chiếu nào.";
      if (showtimes.length === 0) {
        emptyMessage = "Chưa có lịch chiếu nào được tạo.";
      } else if (hasActiveFilters) {
        emptyMessage = "Không tìm thấy lịch chiếu nào phù hợp với bộ lọc hoặc từ khóa tìm kiếm.";
      }

      return (
        <div className="py-10 text-center">
          <p className="text-muted-foreground mb-4">{emptyMessage}</p>
          {onCreateNew && showtimes.length === 0 && (
            <Button onClick={onCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo lịch chiếu mới
            </Button>
          )}
          {showtimes.length > 0 && hasActiveFilters && (
            <Button
              variant="outline"
              onClick={() => {
                setDateFilter({ startDate: "", endDate: "" });
                // Note: searchTerm and filterCriteria are controlled by parent component
              }}
            >
              <X className="mr-1 h-4 w-4" />
              Xóa bộ lọc ngày
            </Button>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="space-y-4">
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
              {filteredShowtimes.map((showtime) => (
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onEditShowtime && (
                          <DropdownMenuItem onClick={() => onEditShowtime(showtime)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(showtime)}
                          className="text-red-600 focus:text-red-600"
                          disabled={deleteShowtimeMutation.isPending}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa lịch chiếu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa lịch chiếu "{showtimeToDelete ? getMovieName(showtimeToDelete.movieId) : ''}" 
              vào ngày {showtimeToDelete ? formatDateTimeDisplay(showtimeToDelete.showDateTime, "date-only") : ''}? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </>
    );
  },
);

ShowtimeList.displayName = "ShowtimeList";
