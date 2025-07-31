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
import { formatVND } from "@/utils/currency.utils";
import { CalendarClock, ReceiptIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ReceiptHistoryDetail, type ReceiptDetailProps } from "./ReceiptHistoryDetail";

interface ReceiptHistoryTableProps {
  receiptHistory: ReceiptDetailProps[];
}

export const ReceiptHistoryTable: React.FC<ReceiptHistoryTableProps> = ({ receiptHistory }) => {
  const [paginatedReceipts, setPaginatedReceipts] = useState<ReceiptDetailProps[]>([]);

  // Sử dụng hook phân trang
  const pagination = usePagination({
    totalCount: receiptHistory.length,
    pageSize: 5,
    initialPage: 1,
  });

  // Cập nhật dữ liệu khi trang thay đổi hoặc dữ liệu thay đổi
  useEffect(() => {
    const start = pagination.startIndex;
    const end = pagination.endIndex + 1;
    setPaginatedReceipts(receiptHistory.slice(start, end));
  }, [pagination.startIndex, pagination.endIndex, receiptHistory]);

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden md:table-cell">Mã hóa đơn</TableHead>
            <TableHead>Thông tin</TableHead>
            <TableHead className="hidden md:table-cell">Ngày chiếu</TableHead>
            <TableHead className="hidden lg:table-cell">Phương thức</TableHead>
            <TableHead className="text-right">Tổng tiền</TableHead>
            <TableHead className="text-right">Ngày xuất hóa đơn</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receiptHistory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center">
                <div className="text-muted-foreground">
                  <ReceiptIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
                  <p>Chưa có lịch sử giao dịch nào</p>
                  <p className="text-sm">Hãy mua vé xem phim để xem lịch sử giao dịch tại đây</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            paginatedReceipts.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell className="hidden font-medium md:table-cell">{receipt.receiptNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <ReceiptIcon className="text-primary h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{receipt.movieName ? `${receipt.movieName}` : "Hóa đơn mua hàng"}</p>
                      <div className="text-muted-foreground space-y-1 text-xs md:hidden">
                        <p>#{receipt.receiptNumber}</p>
                        <p>{receipt.date}</p>
                        <p>{receipt.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">{receipt.showtime ? new Date(receipt.showtime).toLocaleDateString("vi-VN") : "Không có"}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="text-sm">{receipt.paymentMethod}</span>
                </TableCell>
                <TableCell className="text-right font-medium">{formatVND(receipt.totalAmount)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <CalendarClock className="h-4 w-4" />
                    <span className="text-sm" title={receipt.issuedAt || ""}>
                      {receipt.date} {receipt.time}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <ReceiptHistoryDetail receipt={receipt} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {receiptHistory.length > 0 && (
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
