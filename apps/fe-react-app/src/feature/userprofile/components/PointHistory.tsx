import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { DateTimePicker } from "@/components/Shadcn/ui/datetime-picker";
import { Form, FormField } from "@/components/Shadcn/ui/form";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAuth } from "@/hooks/useAuth";
import type { Receipt, ReceiptFilterRequest } from "@/interfaces/receipt.interface";
import { queryReceipts } from "@/services/receiptService";
import { getUserIdFromCookie } from "@/utils/auth.utils";
import { format, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import { Loader2, Trophy } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { PointHistoryProps } from "./point-history/PointHistoryDetail";
import { PointHistoryTable } from "./point-history/PointHistoryTable";

interface PointHistoryFormValues {
  fromDate: Date;
  toDate: Date;
}

const PointHistory: React.FC = () => {
  const form = useForm<PointHistoryFormValues>({
    defaultValues: {
      fromDate: subDays(new Date(), 90),
      toDate: new Date(),
    },
  });

  // Get user ID from auth context or cookies
  const { user } = useAuth();
  const userId = user?.id || getUserIdFromCookie();

  // Use media query to detect small screens
  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  // Receipt API mutation - Sử dụng useRef để đảm bảo tính ổn định, không gây re-renders
  const receiptMutationRef = useRef(queryReceipts());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [apiReceipts, setApiReceipts] = useState<Receipt[]>([]);

  // Fetch receipts function
  const fetchReceipts = async (values: PointHistoryFormValues) => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const filterRequest: ReceiptFilterRequest = {
        userId: userId,
        fromDate: format(values.fromDate, "yyyy-MM-dd"),
        toDate: format(values.toDate, "yyyy-MM-dd"),
      };

      // Call API
      const response = await receiptMutationRef.current.mutateAsync({
        body: filterRequest,
      });

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
    if (!userId) return;

    // Initial fetch with default values
    fetchReceipts(form.getValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Transform API data to display format for point history
  const pointHistory = useMemo(() => {
    if (!apiReceipts.length) {
      return [];
    }

    const pointRecords: PointHistoryProps[] = [];

    apiReceipts.forEach((receipt) => {
      const formattedDate = receipt.issuedAt ? format(new Date(receipt.issuedAt), "dd/MM/yyyy", { locale: vi }) : "Không xác định";
      const movieName = receipt.movieName || "Không có thông tin phim";

      // Trường hợp vừa thêm vừa sử dụng điểm trong cùng một giao dịch
      if (receipt.addedPoints && receipt.addedPoints > 0 && receipt.usedPoints && receipt.usedPoints > 0) {
        pointRecords.push({
          id: `both-${receipt.id}`,
          date: formattedDate,
          movieName: movieName,
          points: receipt.addedPoints - receipt.usedPoints, // Điểm ròng
          pointType: "BOTH",
          addedPoints: receipt.addedPoints,
          usedPoints: receipt.usedPoints,
        });
      }
      // Chỉ thêm điểm
      else if (receipt.addedPoints && receipt.addedPoints > 0) {
        pointRecords.push({
          id: `add-${receipt.id}`,
          date: formattedDate,
          movieName: movieName,
          points: receipt.addedPoints,
          pointType: "ADDING",
          addedPoints: receipt.addedPoints,
        });
      }
      // Chỉ sử dụng điểm
      else if (receipt.usedPoints && receipt.usedPoints > 0) {
        pointRecords.push({
          id: `use-${receipt.id}`,
          date: formattedDate,
          movieName: movieName,
          points: receipt.usedPoints,
          pointType: "USING",
          usedPoints: receipt.usedPoints,
        });
      }
    });

    // Sort by date (newest first)
    return pointRecords.sort((a, b) => {
      const dateA = new Date(a.date.split("/").reverse().join("-"));
      const dateB = new Date(b.date.split("/").reverse().join("-"));
      return dateB.getTime() - dateA.getTime();
    });
  }, [apiReceipts]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Trophy className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold">Lịch sử điểm thưởng</h1>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Đang tải lịch sử điểm thưởng...</span>
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
          <Trophy className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold">Lịch sử điểm thưởng</h1>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="mb-2 text-red-500">Không thể tải lịch sử điểm thưởng</p>
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
        <Trophy className="text-primary h-6 w-6" />
        <h1 className="text-3xl font-bold">Lịch sử điểm thưởng</h1>
      </div>

      {/* Point History Table with Filters in CardHeader */}
      <Card>
        <CardHeader>
          <div className={`flex ${isSmallScreen ? "flex-col" : "items-center justify-between"}`}>
            <CardTitle>Lịch sử điểm thưởng của bạn tại FCinema</CardTitle>
            <div className={`${isSmallScreen ? "mt-4 w-full" : "mt-0"}`}>
              <Form {...form}>
                <div className="flex flex-wrap items-start gap-4">
                  <div className="grid min-w-auto grid-cols-1 gap-2 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="fromDate"
                      render={({ field }: { field: { value: Date; onChange: (date: Date) => void } }) => (
                        <DateTimePicker
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
                        <DateTimePicker
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
                </div>
              </Form>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PointHistoryTable pointHistory={pointHistory} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PointHistory;
