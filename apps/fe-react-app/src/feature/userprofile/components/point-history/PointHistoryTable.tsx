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
import { CalendarClock, Film, TrophyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { PointHistoryDetail, type PointHistoryProps } from "./PointHistoryDetail";

interface PointHistoryTableProps {
  pointHistory: PointHistoryProps[];
}

export const PointHistoryTable: React.FC<PointHistoryTableProps> = ({ pointHistory }) => {
  const [paginatedPoints, setPaginatedPoints] = useState<PointHistoryProps[]>([]);

  // Sử dụng hook phân trang
  const pagination = usePagination({
    totalCount: pointHistory.length,
    pageSize: 5,
    initialPage: 1,
  });

  // Cập nhật dữ liệu khi trang thay đổi hoặc dữ liệu thay đổi
  useEffect(() => {
    const start = pagination.startIndex;
    const end = pagination.endIndex + 1;
    setPaginatedPoints(pointHistory.slice(start, end));
  }, [pagination.startIndex, pagination.endIndex, pointHistory]);

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Phim</TableHead>
            <TableHead className="hidden md:table-cell">Ngày xem</TableHead>
            <TableHead>Điểm thưởng</TableHead>
            <TableHead>Điểm đã sử dụng</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pointHistory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center">
                <div className="text-muted-foreground">
                  <TrophyIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
                  <p>Không tìm thấy lịch sử điểm thưởng cho khoảng thời gian đã chọn.</p>
                  <p className="text-sm">Hãy mua vé xem phim để tích lũy điểm thưởng tại đây</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            paginatedPoints.map((point) => (
              <TableRow key={point.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <Film className="text-primary h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{point.movieName}</p>
                      <div className="text-muted-foreground space-y-1 text-xs md:hidden">
                        <p>{point.date}</p>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">{point.date}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {point.pointType === "ADDING" || (point.pointType === "BOTH" && point.addedPoints && point.addedPoints > 0) ? (
                    <span className="font-medium text-green-500">+{point.pointType === "ADDING" ? point.points : point.addedPoints}</span>
                  ) : (
                    <span>-</span>
                  )}
                </TableCell>
                <TableCell>
                  {point.pointType === "USING" || (point.pointType === "BOTH" && point.usedPoints && point.usedPoints > 0) ? (
                    <span className="font-medium text-orange-500">-{point.pointType === "USING" ? point.points : point.usedPoints}</span>
                  ) : (
                    <span>-</span>
                  )}
                </TableCell>
                <TableCell>
                  <PointHistoryDetail point={point} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pointHistory.length > 0 && (
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
