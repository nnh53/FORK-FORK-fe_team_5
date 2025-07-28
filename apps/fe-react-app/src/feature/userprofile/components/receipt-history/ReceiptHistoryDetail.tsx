import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/Shadcn/ui/dialog";
import { formatVND } from "@/utils/currency.utils";
import { CalendarClock, CreditCard, MoreHorizontal, Receipt, ShoppingBag } from "lucide-react";

// Receipt detail props interface
export interface ReceiptDetailProps {
  id: string;
  receiptNumber: string;
  date: string;
  totalAmount: number;
  paymentMethod: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  status: string;
}

export const ReceiptHistoryDetail: React.FC<{ receipt: ReceiptDetailProps }> = ({ receipt }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SUCCESS: { label: "Đã thanh toán", variant: "default" as const, className: "bg-green-500" },
      PENDING: { label: "Đang xử lý", variant: "outline" as const, className: "" },
      CANCELLED: { label: "Đã hủy", variant: "destructive" as const, className: "" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "default" as const,
      className: "",
    };

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

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
      <DialogContent className="max-w-md">
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

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarClock className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">Ngày: {receipt.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">Phương thức thanh toán: {receipt.paymentMethod}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">Số sản phẩm: {receipt.items.length}</span>
            </div>
          </div>

          <div className="rounded-md border p-4">
            <h4 className="mb-2 font-medium">Danh sách sản phẩm</h4>
            <div className="space-y-2">
              {receipt.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
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

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Trạng thái:</span>
            {getStatusBadge(receipt.status)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
