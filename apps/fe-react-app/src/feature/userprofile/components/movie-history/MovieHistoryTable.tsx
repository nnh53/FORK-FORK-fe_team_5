import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/Shadcn/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { usePagination } from "@/hooks/usePagination";
import { Clock, CreditCard, Film, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type { MovieDetailProps } from "./MovieHistoryDetail";
import { MovieHistoryDetail } from "./MovieHistoryDetail";

interface MovieHistoryTableProps {
  movieHistory: MovieDetailProps[];
}

export const MovieHistoryTable: React.FC<MovieHistoryTableProps> = ({ movieHistory }) => {
  const [paginatedMovies, setPaginatedMovies] = useState<MovieDetailProps[]>([]);

  // Sử dụng hook phân trang
  const pagination = usePagination({
    totalCount: movieHistory.length,
    pageSize: 5,
    initialPage: 1,
  });

  // Cập nhật dữ liệu khi trang thay đổi hoặc dữ liệu thay đổi
  useEffect(() => {
    const start = pagination.startIndex;
    const end = pagination.endIndex + 1;
    setPaginatedMovies(movieHistory.slice(start, end));
  }, [pagination.startIndex, pagination.endIndex, movieHistory]);

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

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden md:table-cell">Mã hóa đơn</TableHead>
            <TableHead>Phim</TableHead>
            <TableHead className="hidden lg:table-cell">Rạp chiếu</TableHead>
            <TableHead className="hidden md:table-cell">Suất chiếu</TableHead>
            <TableHead className="hidden lg:table-cell">Ghế</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-center">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movieHistory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center">
                <div className="text-muted-foreground">
                  <Film className="mx-auto mb-2 h-12 w-12 opacity-50" />
                  <p>Chưa có lịch sử xem phim nào</p>
                  <p className="text-sm">Hãy đặt vé xem phim để xem lịch sử tại đây</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            paginatedMovies.map((movie) => (
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
                        {movie.status === "PENDING" && movie.payOsLink && (
                          <Button
                            size="sm"
                            variant="default"
                            className="h-7 bg-blue-600 text-xs hover:bg-blue-700"
                            onClick={() => window.open(movie.payOsLink, "_blank")}
                          >
                            <CreditCard className="mr-1 h-3 w-3" />
                            Thanh toán
                          </Button>
                        )}
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
                <TableCell>{getStatusBadge(movie.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    {movie.status === "PENDING" && movie.payOsLink && (
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8 bg-blue-600 hover:bg-blue-700"
                        onClick={() => window.open(movie.payOsLink, "_blank")}
                      >
                        <CreditCard className="mr-1 h-3 w-3" />
                        Thanh toán
                      </Button>
                    )}
                    <MovieHistoryDetail movie={movie} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {movieHistory.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst onClick={pagination.goToFirstPage} />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => pagination.hasPrevPage && pagination.prevPage()}
                className={!pagination.hasPrevPage ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {pagination.visiblePages.map((page) => {
              if (page === "ellipsis") {
                // Tìm vị trí của page trước ellipsis để tạo key có ý nghĩa
                const pageIdx = pagination.visiblePages.indexOf(page);
                const prevPage = pageIdx > 0 ? pagination.visiblePages[pageIdx - 1] : 0;
                const nextPage = pageIdx < pagination.visiblePages.length - 1 ? pagination.visiblePages[pageIdx + 1] : 0;
                // Tạo key dựa vào vị trí tương đối, không phải chỉ số mảng
                return (
                  <PaginationItem key={`ellipsis-${prevPage}-${nextPage}`}>
                    <span className="flex h-9 w-9 items-center justify-center">...</span>
                  </PaginationItem>
                );
              }
              return (
                <PaginationItem key={page}>
                  <PaginationLink isActive={page === pagination.currentPage} onClick={() => pagination.setPage(page)}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => pagination.hasNextPage && pagination.nextPage()}
                className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast onClick={pagination.goToLastPage} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
