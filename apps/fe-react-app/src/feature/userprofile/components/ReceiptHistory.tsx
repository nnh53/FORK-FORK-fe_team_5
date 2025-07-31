import { Card, CardContent, CardDescription, CardHeader } from "@/components/Shadcn/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { useAuth } from "@/hooks/useAuth";
import type { Receipt, ReceiptFilterRequest } from "@/interfaces/receipt.interface";
import { queryReceipts } from "@/services/receipService";
import { getUserIdFromCookie } from "@/utils/auth.utils";
import { format, subDays } from "date-fns";
import { Loader2, Receipt as ReceiptIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReceiptDetailProps } from "./receipt-history/ReceiptHistoryDetail";
import { ReceiptHistoryTable } from "./receipt-history/ReceiptHistoryTable";

const ReceiptHistory: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Get user ID from auth context or cookies
  const { user } = useAuth();
  const userId = user?.id || getUserIdFromCookie();

  // Receipt API mutation - Sử dụng useRef để đảm bảo tính ổn định, không gây re-renders
  const receiptMutationRef = useRef(queryReceipts());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [apiReceipts, setApiReceipts] = useState<Receipt[]>([]);

  // Sử dụng useRef để theo dõi việc đã fetch hay chưa, tránh fetch nhiều lần
  const hasFetchedRef = useRef(false);

  // Load receipts on component mount - Chỉ chạy đúng 1 lần
  useEffect(() => {
    // Nếu không có userId hoặc đã fetch rồi thì không fetch nữa
    if (!userId || hasFetchedRef.current) return;

    // Track if component is mounted
    let isMounted = true;

    const fetchReceipts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Default filter to last 90 days - Tính toán một lần
        const today = new Date();
        const ninetyDaysAgo = subDays(today, 90);

        const filterRequest: ReceiptFilterRequest = {
          userId: userId,
          fromDate: format(ninetyDaysAgo, "yyyy-MM-dd"),
          toDate: format(today, "yyyy-MM-dd"),
        };

        console.log("[ReceiptHistory] Calling API exactly once");

        // Call API
        const response = await receiptMutationRef.current.mutateAsync({
          body: filterRequest,
        });

        // Đánh dấu là đã fetch
        hasFetchedRef.current = true;

        // Chỉ update state nếu component vẫn mounted
        if (isMounted) {
          if (response?.result) {
            setApiReceipts(response.result);
          } else {
            setApiReceipts([]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch receipts:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Failed to fetch receipts"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchReceipts();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [userId]); // Chỉ phụ thuộc vào userId

  // Transform API data to display format
  const receiptHistory = useMemo(() => {
    if (!apiReceipts.length) {
      return [];
    }

    return apiReceipts
      .filter((receipt) => {
        if (statusFilter === "ALL") return true;

        // Map backend payment status to UI status
        let uiStatus = "PENDING";
        if (receipt.refunded) {
          uiStatus = "CANCELLED";
        } else if (receipt.paymentMethod && receipt.paymentReference) {
          uiStatus = "SUCCESS";
        }

        return uiStatus === statusFilter;
      })
      .map((receipt): ReceiptDetailProps => {
        // Format date
        const issuedDate = receipt.issuedAt ? new Date(receipt.issuedAt).toLocaleDateString("vi-VN") : "Không xác định";

        // Map items
        const items =
          receipt.items?.map((item) => ({
            id: String(item.id),
            name: item.name || "Không tên",
            quantity: item.quantity || 0,
            price: item.unitPrice || 0,
            type: item.type || "",
          })) || [];

        // Map payment method
        let paymentMethodDisplay = "Không xác định";
        if (receipt.paymentMethod) {
          switch (receipt.paymentMethod) {
            case "CASH":
              paymentMethodDisplay = "Tiền mặt";
              break;
            case "ONLINE":
              paymentMethodDisplay = "Thanh toán online";
              break;
            default:
              paymentMethodDisplay = receipt.paymentMethod || "Không xác định";
          }
        }

        // Map receipt status
        let status = "PENDING";
        if (receipt.refunded) {
          status = "CANCELLED";
        } else if (receipt.paymentMethod && receipt.paymentReference) {
          status = "SUCCESS";
        }

        return {
          id: String(receipt.id),
          receiptNumber: `${String(receipt.id)}`,
          date: issuedDate,
          totalAmount: receipt.totalAmount || 0,
          paymentMethod: paymentMethodDisplay,
          items: items,
          status: status,
          // Thêm thông tin mới từ API
          movieName: receipt.movieName || undefined,
          showtime: receipt.showtime || undefined,
          roomName: receipt.roomName || undefined,
          promotionName: receipt.promotionName || undefined,
          bookingId: receipt.bookingId || undefined,
          ticketCount: receipt.ticketCount || undefined,
          // Thông tin điểm thưởng
          addedPoints: receipt.addedPoints || undefined,
          usedPoints: receipt.usedPoints || undefined,
          refundedPoints: receipt.refundedPoints || undefined,
        };
      })
      .sort((a, b) => {
        // Convert date strings to date objects and compare
        const dateA = new Date(a.date.split("/").reverse().join("-"));
        const dateB = new Date(b.date.split("/").reverse().join("-"));
        return dateB.getTime() - dateA.getTime();
      });
  }, [apiReceipts, statusFilter]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <ReceiptIcon className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold">Lịch sử giao dịch</h1>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Đang tải lịch sử giao dịch...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <ReceiptIcon className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold">Lịch sử giao dịch</h1>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="mb-2 text-red-500">Không thể tải lịch sử giao dịch</p>
              <p className="text-muted-foreground text-sm">Vui lòng thử lại sau</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <ReceiptIcon className="text-primary h-6 w-6" />
        <h1 className="text-3xl font-bold">Lịch sử giao dịch</h1>
      </div>

      {/* Receipt History List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardDescription>Danh sách các giao dịch của bạn tại FCinema</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="status-filter" className="text-sm font-medium">
                Lọc theo trạng thái:
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter" className="w-40">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  <SelectItem value="SUCCESS">Đã thanh toán</SelectItem>
                  <SelectItem value="PENDING">Đang xử lý</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ReceiptHistoryTable receiptHistory={receiptHistory} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiptHistory;
