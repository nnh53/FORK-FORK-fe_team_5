import { Badge } from "@/components/Shadcn/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { formatVND } from "@/utils/currency.utils";
import { CalendarClock, ReceiptIcon } from "lucide-react";
import { ReceiptHistoryDetail, type ReceiptDetailProps } from "./ReceiptHistoryDetail";

interface ReceiptHistoryTableProps {
  receiptHistory: ReceiptDetailProps[];
}

export const ReceiptHistoryTable: React.FC<ReceiptHistoryTableProps> = ({ receiptHistory }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge variant="default" className="bg-green-500">
            Đã thanh toán
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden md:table-cell">Mã hóa đơn</TableHead>
          <TableHead>Thông tin</TableHead>
          <TableHead className="hidden md:table-cell">Ngày</TableHead>
          <TableHead className="hidden lg:table-cell">Phương thức</TableHead>
          <TableHead className="text-right">Tổng tiền</TableHead>
          <TableHead>Trạng thái</TableHead>
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
          receiptHistory.map((receipt) => (
            <TableRow key={receipt.id}>
              <TableCell className="hidden font-medium md:table-cell">{receipt.receiptNumber}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <ReceiptIcon className="text-primary h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Hóa đơn mua hàng</p>
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
                  <span className="text-sm">{receipt.date}</span>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <span className="text-sm">{receipt.paymentMethod}</span>
              </TableCell>
              <TableCell className="text-right font-medium">{formatVND(receipt.totalAmount)}</TableCell>
              <TableCell>{getStatusBadge(receipt.status)}</TableCell>
              <TableCell>
                <ReceiptHistoryDetail receipt={receipt} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
