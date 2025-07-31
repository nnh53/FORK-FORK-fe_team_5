import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { DatePicker } from "@/components/Shadcn/ui/date-picker";
import { Form, FormField } from "@/components/Shadcn/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { useAuth } from "@/hooks/useAuth";
import type { Receipt, ReceiptFilterRequest } from "@/interfaces/receipt.interface";
import { queryReceipts } from "@/services/receipService";
import { getUserIdFromCookie } from "@/utils/auth.utils";
import { format, subDays } from "date-fns";
import { Loader2, Receipt as ReceiptIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { ReceiptDetailProps } from "./receipt-history/ReceiptHistoryDetail";
import { ReceiptHistoryTable } from "./receipt-history/ReceiptHistoryTable";

interface ReceiptHistoryFormValues {
  fromDate: Date;
  toDate: Date;
  paymentMethod: string;
}

const ReceiptHistory: React.FC = () => {
  const form = useForm<ReceiptHistoryFormValues>({
    defaultValues: {
      fromDate: subDays(new Date(), 90),
      toDate: new Date(),
      paymentMethod: "ALL",
    },
  });

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

  // Fetch receipts function
  const fetchReceipts = async (values: ReceiptHistoryFormValues) => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const filterRequest: ReceiptFilterRequest = {
        userId: userId,
        fromDate: format(values.fromDate, "yyyy-MM-dd"),
        toDate: format(values.toDate, "yyyy-MM-dd"),
      };

      console.log("[ReceiptHistory] Fetching with filter:", filterRequest);

      // Call API
      const response = await receiptMutationRef.current.mutateAsync({
        body: filterRequest,
      });

      // Đánh dấu là đã fetch
      hasFetchedRef.current = true;

      if (response?.result) {
        setApiReceipts(response.result);
      } else {
        setApiReceipts([]);
      }
    } catch (err) {
      console.error("Failed to fetch receipts:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch receipts"));
    } finally {
      setIsLoading(false);
    }
  };

  // Load receipts on component mount - Chỉ chạy đúng 1 lần
  useEffect(() => {
    // Nếu không có userId hoặc đã fetch rồi thì không fetch nữa
    if (!userId || hasFetchedRef.current) return;

    // Initial fetch with default values
    fetchReceipts(form.getValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Transform API data to display format
  const receiptHistory = useMemo(() => {
    if (!apiReceipts.length) {
      return [];
    }

    return apiReceipts
      .filter((receipt) => {
        const paymentMethodFilter = form.getValues().paymentMethod;
        if (paymentMethodFilter === "ALL") return true;

        return receipt.paymentMethod === paymentMethodFilter;
      })
      .map((receipt): ReceiptDetailProps => {
        // Format date with actual issuedAt time, not current time
        const issuedDate = receipt.issuedAt ? format(new Date(receipt.issuedAt), "dd/MM/yyyy") : "Không xác định";

        // Extract time from issuedAt - format as HH:mm:ss for display
        const issuedTime = receipt.issuedAt ? format(new Date(receipt.issuedAt), "HH:mm:ss") : "";

        // ISO format for issuedAt (2025-07-28T08:54:37)
        const issuedAtISO = receipt.issuedAt ? format(new Date(receipt.issuedAt), "yyyy-MM-dd'T'HH:mm:ss") : "";
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
          time: issuedTime,
          issuedAt: issuedAtISO, // Thêm định dạng ISO
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
  }, [apiReceipts, form]);

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

      {/* Receipt History List with Filters in CardHeader */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách các giao dịch của bạn tại FCinema</CardTitle>

            <div className="mt-4">
              <Form {...form}>
                <div className="flex flex-wrap items-start gap-4">
                  <div className="grid min-w-[240px] grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="fromDate"
                      render={({ field }: { field: { value: Date; onChange: (date: Date) => void } }) => (
                        <DatePicker
                          date={field.value}
                          setDate={(date) => {
                            if (date) {
                              field.onChange(date);
                              fetchReceipts(form.getValues());
                            }
                          }}
                          placeholder="Từ ngày"
                        />
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="toDate"
                      render={({ field }: { field: { value: Date; onChange: (date: Date) => void } }) => (
                        <DatePicker
                          date={field.value}
                          setDate={(date) => {
                            if (date) {
                              field.onChange(date);
                              fetchReceipts(form.getValues());
                            }
                          }}
                          placeholder="Đến ngày"
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor="payment-filter" className="text-sm font-medium whitespace-nowrap">
                      Phương thức:
                    </label>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            fetchReceipts(form.getValues());
                          }}
                        >
                          <SelectTrigger id="payment-filter" className="w-40">
                            <SelectValue placeholder="Phương thức" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ALL">Tất cả</SelectItem>
                            <SelectItem value="CASH">Tiền mặt</SelectItem>
                            <SelectItem value="ONLINE">Thanh toán online</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </Form>
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
