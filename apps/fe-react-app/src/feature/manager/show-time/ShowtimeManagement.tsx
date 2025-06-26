import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input"; // Thêm import Input
import { Filter, type FilterCriteria } from "@/components/shared/Filter";
import { type Showtime, type ShowtimeFormData, ShowtimeStatus } from "@/interfaces/showtime.interface";
import { Plus, Search } from "lucide-react"; // Thêm import Search icon
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ShowtimeForm from "./ShowtimeForm";
import ShowtimeTable from "./ShowtimeTable";
import { createShowtime, deleteShowtime, getShowtimes, updateShowtime } from "./services/showtimeApi";

// Placeholder for movie and room data fetching
interface Movie {
  id: string;
  title: string;
}

interface Room {
  id: string;
  name: string;
}

// Thay thế hàm filterBySearch bằng filterByGlobalSearch đơn giản hơn
const filterByGlobalSearch = (
  showtime: Showtime,
  searchValue: string,
  movieNames: Record<string, string>,
  roomNames: Record<string, string>,
): boolean => {
  if (!searchValue) return true;

  const lowerSearchValue = searchValue.toLowerCase().trim();
  return (
    showtime.id.toString().includes(lowerSearchValue) ||
    (movieNames[showtime.movie_id] || "").toLowerCase().includes(lowerSearchValue) ||
    (roomNames[showtime.room_id] || "").toLowerCase().includes(lowerSearchValue) ||
    showtime.status.toLowerCase().includes(lowerSearchValue)
  );
};

// Giữ lại các hàm filter khác như cũ
const filterByDateRange = (showtime: Showtime, field: string, range: { from: Date | undefined; to: Date | undefined }): boolean => {
  if (!range.from && !range.to) return true;

  let dateValue;
  switch (field) {
    case "show_date_time_range":
      dateValue = showtime.show_date_time ? new Date(showtime.show_date_time) : null;
      break;
    case "show_end_time_range":
      dateValue = showtime.show_end_time ? new Date(showtime.show_end_time) : null;
      break;
    default:
      return true;
  }

  if (!dateValue) return false;

  return !(range.from && dateValue < range.from) && !(range.to && dateValue > range.to);
};

const filterByStatus = (showtime: Showtime, status: string): boolean => {
  return showtime.status === status;
};

const ShowtimeManagement = () => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | undefined>();
  // Thay đổi từ searchCriteria sang searchTerm
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showtimeToDelete, setShowtimeToDelete] = useState<Showtime | null>(null);
  const [viewDetailOpen, setViewDetailOpen] = useState(false);
  const [showtimeToView, setShowtimeToView] = useState<Showtime | null>(null);

  // Giữ nguyên phần dữ liệu mẫu cho movies và rooms
  const [movies] = useState<Movie[]>([
    { id: "1", title: "Inception" },
    { id: "2", title: "The Dark Knight" },
    { id: "3", title: "Interstellar" },
  ]);

  const [rooms] = useState<Room[]>([
    { id: "1", name: "Phòng 1" },
    { id: "2", name: "Phòng 2" },
    { id: "3", name: "Phòng VIP" },
  ]);

  // Create lookup maps for movie and room names
  const movieNames = useMemo(() => {
    const map: Record<string, string> = {};
    movies.forEach((movie) => {
      map[movie.id] = movie.title;
    });
    return map;
  }, [movies]);

  const roomNames = useMemo(() => {
    const map: Record<string, string> = {};
    rooms.forEach((room) => {
      map[room.id] = room.name;
    });
    return map;
  }, [rooms]);

  // Xóa searchOptions vì không cần nữa

  // Filter options
  const filterOptions = [
    {
      label: "Khoảng thời gian bắt đầu",
      value: "show_date_time_range",
      type: "dateRange" as const,
    },
    {
      label: "Khoảng thời gian kết thúc",
      value: "show_end_time_range",
      type: "dateRange" as const,
    },
    {
      label: "Trạng thái",
      value: "status",
      type: "select" as const,
      selectOptions: [
        { value: ShowtimeStatus.SCHEDULE, label: "Đã lên lịch" },
        { value: ShowtimeStatus.ONSCREEN, label: "Đang chiếu" },
        { value: ShowtimeStatus.COMPLETE, label: "Đã hoàn thành" },
      ],
      placeholder: "Chọn trạng thái",
    },
  ];

  // Cập nhật filteredShowtimes để sử dụng searchTerm thay vì searchCriteria
  const filteredShowtimes = useMemo(() => {
    if (!Array.isArray(showtimes) || showtimes.length === 0) return [];

    let result = [...showtimes]; // Create a copy to avoid mutations

    // Áp dụng tìm kiếm đơn giản
    if (searchTerm) {
      result = result.filter((showtime) => filterByGlobalSearch(showtime, searchTerm, movieNames, roomNames));
    }

    // Phần filter criteria giữ nguyên
    if (filterCriteria.length > 0) {
      result = result.filter((showtime) => {
        return filterCriteria.every((criteria) => {
          switch (criteria.field) {
            case "show_date_time_range":
            case "show_end_time_range": {
              const range = criteria.value as { from: Date | undefined; to: Date | undefined };
              return filterByDateRange(showtime, criteria.field, range);
            }
            case "status": {
              return filterByStatus(showtime, criteria.value as string);
            }
            default:
              return true;
          }
        });
      });
    }

    return result;
  }, [showtimes, searchTerm, filterCriteria, movieNames, roomNames]);

  const fetchShowtimes = async () => {
    setLoading(true);
    try {
      const data = await getShowtimes();
      setShowtimes(data);
    } catch (err) {
      toast.error("Lỗi khi tải danh sách suất chiếu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load showtimes on component mount
  useEffect(() => {
    fetchShowtimes();
    // Uncomment when you have the actual API calls
    // fetchMovies();
    // fetchRooms();
  }, []);

  const handleCreate = () => {
    setSelectedShowtime(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedShowtime(undefined);
  };

  const handleView = (showtime: Showtime) => {
    setShowtimeToView(showtime);
    setViewDetailOpen(true);
  };

  const handleSubmit = async (values: ShowtimeFormData | Showtime) => {
    try {
      if (selectedShowtime) {
        const updatedShowtime = {
          ...selectedShowtime,
          ...values,
        };
        await updateShowtime(updatedShowtime as Showtime);
        toast.success("Cập nhật suất chiếu thành công");
      } else {
        await createShowtime(values as ShowtimeFormData);
        toast.success("Thêm suất chiếu thành công");
      }
      setIsModalOpen(false);
      setSelectedShowtime(undefined);
      fetchShowtimes();
    } catch (error) {
      console.error("Lỗi khi lưu suất chiếu:", error);
      toast.error("Lỗi khi lưu suất chiếu");
    }
  };

  const handleDeleteClick = (showtime: Showtime) => {
    setShowtimeToDelete(showtime);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (showtimeToDelete) {
      try {
        await deleteShowtime(showtimeToDelete.id);
        toast.success("Xóa suất chiếu thành công");
        fetchShowtimes();
      } catch (error) {
        console.error("Lỗi khi xóa suất chiếu:", error);
        toast.error("Lỗi khi xóa suất chiếu");
      }
    }
    setDeleteDialogOpen(false);
    setShowtimeToDelete(null);
  };

  if (loading && showtimes.length === 0) {
    return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader className="space-y-4">
            {/* Title and Add button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-2xl font-bold">Quản lý suất chiếu</CardTitle>
              <Button onClick={handleCreate} className="shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Thêm suất chiếu
              </Button>
            </div>

            {/* Search and Filter row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              {/* Thay SearchBar bằng Input search đơn giản */}
              <div className="relative w-full sm:w-1/2 border border-gray-300 rounded-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo ID, phim hoặc trạng thái..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              {/* Filter - Right */}
              <div className="shrink-0">
                <Filter filterOptions={filterOptions} onFilterChange={setFilterCriteria} />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <ShowtimeTable
              showtimes={filteredShowtimes}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onView={handleView}
              movieNames={movieNames}
              roomNames={roomNames}
            />
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) handleCancel();
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedShowtime ? "Chỉnh sửa suất chiếu" : "Thêm suất chiếu mới"}</DialogTitle>
          </DialogHeader>
          <ShowtimeForm showtime={selectedShowtime} onSubmit={handleSubmit} onCancel={handleCancel} movies={movies} rooms={rooms} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa suất chiếu</DialogTitle>
          </DialogHeader>
          <p>Bạn có chắc chắn muốn xóa suất chiếu này? Hành động này không thể hoàn tác.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Showtime Detail Dialog */}
      {showtimeToView && (
        <Dialog open={viewDetailOpen} onOpenChange={setViewDetailOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết suất chiếu</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">ID</p>
                  <p>{showtimeToView.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phim</p>
                  <p>{movieNames[showtimeToView.movie_id] || "Không xác định"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phòng chiếu</p>
                  <p>{roomNames[showtimeToView.room_id] || "Không xác định"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Thời gian bắt đầu</p>
                  <p>{formatDateTime(showtimeToView.show_date_time)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Thời gian kết thúc</p>
                  <p>{formatDateTime(showtimeToView.show_end_time)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Trạng thái</p>
                  <p>
                    {(() => {
                      const { label, className } = getStatusDisplay(showtimeToView.status);
                      return <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{label}</span>;
                    })()}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setViewDetailOpen(false)}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

function formatDateTime(dateTimeString: string): string {
  if (!dateTimeString) return "N/A";
  const date = new Date(dateTimeString);

  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusDisplay(status: ShowtimeStatus) {
  switch (status) {
    case ShowtimeStatus.SCHEDULE:
      return { label: "Đã lên lịch", className: "bg-blue-100 text-blue-800" };
    case ShowtimeStatus.ONSCREEN:
      return { label: "Đang chiếu", className: "bg-green-100 text-green-800" };
    case ShowtimeStatus.COMPLETE:
      return { label: "Đã hoàn thành", className: "bg-gray-100 text-gray-800" };
    default:
      return { label: status, className: "bg-yellow-100 text-yellow-800" };
  }
}

export default ShowtimeManagement;
