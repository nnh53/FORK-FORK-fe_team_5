import { Button } from "@/components/Shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/Shadcn/ui/dialog";
import { formatVND } from "@/utils/currency.utils";
import { CalendarClock, Clock, CreditCard, Film, LayoutGrid, MoreHorizontal, PercentIcon, Receipt, ShoppingBag, Ticket } from "lucide-react";

// Receipt detail props interface
export interface ReceiptDetailProps {
  id: string;
  receiptNumber: string;
  date: string;
  time?: string; // Thời gian từ issuedAt (HH:mm)
  issuedAt?: string; // Định dạng ISO (yyyy-MM-ddTHH:mm:ss)
  totalAmount: number;
  paymentMethod: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    type: string;
  }[];
  status: string;
  // Thông tin mới từ API
  movieName?: string;
  showtime?: string;
  roomName?: string;
  promotionName?: string;
  bookingId?: number;
  ticketCount?: number;
  // Thông tin điểm thưởng
  addedPoints?: number;
  usedPoints?: number;
  refundedPoints?: number;
}

export const ReceiptHistoryDetail: React.FC<{ receipt: ReceiptDetailProps }> = ({ receipt }) => {
  const calculateTotal = () => {
    return receipt.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết hóa đơn</DialogTitle>
          <DialogDescription>Thông tin chi tiết về hóa đơn mua hàng</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Receipt className="text-primary h-12 w-12" />
            <div>
              <h3 className="font-medium">Hóa đơn: {receipt.receiptNumber}</h3>
              <p className="text-muted-foreground text-sm">ID: {receipt.id}</p>
            </div>
          </div>

          {/* Thông tin chung */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarClock className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">
                Ngày xuất hoá đơn: {receipt.date} {receipt.time || ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">Phương thức thanh toán: {receipt.paymentMethod}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">Số sản phẩm: {receipt.items.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <PercentIcon className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">Khuyến mãi: {receipt.promotionName || "Không"}</span>
            </div>
          </div>

          {/* Thông tin phim nếu có */}
          {receipt.movieName && (
            <div className="bg-muted/20 rounded-md border p-4">
              <h4 className="mb-2 font-medium">Thông tin vé phim</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Film className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">Phim: {receipt.movieName}</span>
                </div>
                {receipt.showtime && (
                  <div className="flex items-center gap-2">
                    <Clock className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">Giờ chiếu: {new Date(receipt.showtime).toLocaleTimeString("vi-VN")}</span>
                  </div>
                )}
                {receipt.roomName && (
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">Phòng: {receipt.roomName}</span>
                  </div>
                )}
                {receipt.ticketCount !== undefined && receipt.ticketCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Ticket className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">Số vé: {receipt.ticketCount}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Danh sách sản phẩm */}
          <div className="rounded-md border p-4">
            <h4 className="mb-2 font-medium">Danh sách sản phẩm</h4>
            <div className="space-y-2">
              {receipt.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity} {item.type && `(${item.type})`}
                  </span>
                  <span className="font-medium">{formatVND(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t pt-2 font-medium">
                <span>Tổng cộng:</span>
                <span>{formatVND(calculateTotal())}</span>
              </div>
            </div>
          </div>

          {/* Thông tin điểm thưởng nếu có */}
          {!!(receipt.addedPoints || receipt.usedPoints || receipt.refundedPoints) && (
            <div className="bg-muted/20 rounded-md border p-4">
              <h4 className="mb-2 font-medium">Thông tin điểm thưởng</h4>
              <div className="space-y-2">
                {!!(receipt.addedPoints && receipt.addedPoints > 0) && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Điểm cộng:</span>
                    <span className="text-sm font-medium text-green-500">+{receipt.addedPoints}</span>
                  </div>
                )}
                {!!(receipt.usedPoints && receipt.usedPoints > 0) && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Điểm sử dụng:</span>
                    <span className="text-sm font-medium text-orange-500">-{receipt.usedPoints}</span>
                  </div>
                )}
                {!!(receipt.refundedPoints && receipt.refundedPoints > 0) && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Điểm hoàn lại:</span>
                    <span className="text-sm font-medium text-blue-500">+{receipt.refundedPoints}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
