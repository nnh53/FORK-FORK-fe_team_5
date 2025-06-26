import { Button } from "@/components/Shadcn/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/Shadcn/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { SortButton } from "@/components/shared/SortButton";
import { getPageInfo, usePagination } from "@/hooks/usePagination";
import { useSortable } from "@/hooks/useSortable";
import { type Showtime, ShowtimeStatus } from "@/interfaces/showtime.interface";
import { Edit, Eye, Trash } from "lucide-react";
import { useMemo } from "react";

interface ShowtimeTableProps {
  showtimes: Showtime[];
  onEdit: (showtime: Showtime) => void;
  onDelete: (showtime: Showtime) => void;
  onView?: (showtime: Showtime) => void;
  movieNames: Record<string, string>;
  roomNames: Record<string, string>;
}

const formatDateTime = (dateTimeString: string): string => {
  if (!dateTimeString) return "N/A";
  const date = new Date(dateTimeString);

  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusDisplay = (status: ShowtimeStatus) => {
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
};

const ShowtimeTable = ({ showtimes, onEdit, onDelete, onView, movieNames, roomNames }: ShowtimeTableProps) => {
  const { sortedData, getSortProps } = useSortable<Showtime>(showtimes);

  // Pagination configuration
  const pagination = usePagination({
    totalCount: Array.isArray(sortedData) ? sortedData.length : 0,
    pageSize: 10,
    maxVisiblePages: 5,
    initialPage: 1,
  });

  // Get current page data
  const currentPageData = useMemo(() => {
    // Add this safety check to ensure sortedData is an array
    if (!Array.isArray(sortedData)) {
      return [];
    }
    return sortedData.slice(pagination.startIndex, pagination.endIndex + 1);
  }, [sortedData, pagination.startIndex, pagination.endIndex]);

  // Render pagination numbers
  const renderPaginationItems = () => {
    return pagination.visiblePages.map((page, index) => {
      if (page === "ellipsis") {
        return (
          <PaginationItem key={`ellipsis-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      return (
        <PaginationItem key={page}>
          <PaginationLink
            href="#"
            isActive={page === pagination.currentPage}
            onClick={(e) => {
              e.preventDefault();
              pagination.setPage(page);
            }}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="w-full overflow-hidden rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-100">
                <TableHead className="w-[60px]">ID</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Phim
                    <SortButton {...getSortProps("movie_id")} />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Phòng chiếu
                    <SortButton {...getSortProps("room_id")} />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Thời gian bắt đầu
                    <SortButton {...getSortProps("show_date_time")} />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Thời gian kết thúc
                    <SortButton {...getSortProps("show_end_time")} />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Trạng thái
                    <SortButton {...getSortProps("status")} />
                  </div>
                </TableHead>
                <TableHead className="text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {sortedData.length === 0 ? "Không tìm thấy suất chiếu" : "Không có dữ liệu trang này"}
                  </TableCell>
                </TableRow>
              ) : (
                currentPageData.map((showtime) => {
                  const { label, className } = getStatusDisplay(showtime.status);
                  return (
                    <TableRow key={showtime.id}>
                      <TableCell>{showtime.id}</TableCell>
                      <TableCell>{movieNames[showtime.movie_id] || "Không xác định"}</TableCell>
                      <TableCell>{roomNames[showtime.room_id] || "Không xác định"}</TableCell>
                      <TableCell>{formatDateTime(showtime.show_date_time)}</TableCell>
                      <TableCell>{formatDateTime(showtime.show_end_time)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{label}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
                          {onView && (
                            <Button variant="ghost" size="icon" onClick={() => onView(showtime)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => onEdit(showtime)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onDelete(showtime)}>
                            <Trash className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Info and Controls */}
      {sortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Pagination Info */}
          <div className="text-sm text-gray-600 w-1/10">{getPageInfo(pagination)}</div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      pagination.prevPage();
                    }}
                    className={!pagination.hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {/* Page Numbers */}
                {renderPaginationItems()}

                {/* Next Button */}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      pagination.nextPage();
                    }}
                    className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowtimeTable;
