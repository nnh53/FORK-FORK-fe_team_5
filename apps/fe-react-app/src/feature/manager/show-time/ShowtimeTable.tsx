import { Badge } from "@/components/Shadcn/ui/badge";
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
import { usePagination } from "@/hooks/usePagination";
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

const getStatusDisplay = (status: string) => {
  switch (status) {
    case ShowtimeStatus.SCHEDULE:
      return { label: "Đã lên lịch", variant: "outline" as const, className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" };
    case ShowtimeStatus.ONSCREEN:
      return { label: "Đang chiếu", variant: "outline" as const, className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" };
    case ShowtimeStatus.COMPLETE:
      return { label: "Đã hoàn thành", variant: "outline" as const, className: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100" };
    default:
      return { label: status, variant: "outline" as const, className: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100" };
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

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="w-full overflow-hidden rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-100">
                <TableHead className="w-[60px]">ID</TableHead>
                <TableHead className="w-[200px]">
                  <div className="flex items-center gap-1">
                    Phim
                    <SortButton {...getSortProps("movieId")} />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Phòng chiếu
                    <SortButton {...getSortProps("roomId")} />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Thời gian bắt đầu
                    <SortButton {...getSortProps("showDateTime")} />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Thời gian kết thúc
                    <SortButton {...getSortProps("endDateTime")} />
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
                  <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                    {sortedData.length === 0 ? "Không tìm thấy suất chiếu" : "Không có dữ liệu trang này"}
                  </TableCell>
                </TableRow>
              ) : (
                currentPageData.map((showtime) => (
                  <TableRow key={showtime.id}>
                    <TableCell>{showtime.id}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate" title={movieNames[showtime.movieId] ?? "Không xác định"}>
                        {movieNames[showtime.movieId] ?? "Không xác định"}
                      </div>
                    </TableCell>
                    <TableCell>{roomNames[showtime.roomId ?? 0] ?? showtime.roomName ?? "Không xác định"}</TableCell>
                    <TableCell>{formatDateTime(showtime.showDateTime)}</TableCell>
                    <TableCell>{formatDateTime(showtime.endDateTime)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusDisplay(showtime.status).variant} className={getStatusDisplay(showtime.status).className}>
                        {getStatusDisplay(showtime.status).label}
                      </Badge>
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {sortedData.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => pagination.prevPage()}
                className={`cursor-pointer ${pagination.currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
              />
            </PaginationItem>

            {pagination.visiblePages.map((page) => {
              if (page === "ellipsis") {
                return (
                  <PaginationItem key={`ellipsis-page-${pagination.currentPage}-${pagination.totalPages}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={page}>
                  <PaginationLink onClick={() => pagination.setPage(page)} isActive={page === pagination.currentPage} className="cursor-pointer">
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => pagination.nextPage()}
                className={`cursor-pointer ${pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : ""}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ShowtimeTable;
