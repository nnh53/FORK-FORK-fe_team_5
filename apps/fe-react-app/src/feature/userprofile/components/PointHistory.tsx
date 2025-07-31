import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/Shadcn/ui/card";
import { DatePicker } from "@/components/Shadcn/ui/date-picker";
import { Form, FormField } from "@/components/Shadcn/ui/form";
import { useAuth } from "@/hooks/useAuth";
import type { Receipt, ReceiptFilterRequest } from "@/interfaces/receipt.interface";
import { queryReceipts } from "@/services/receipService";
import { getUserIdFromCookie } from "@/utils/auth.utils";
import { format, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import { Loader2, Search, Trophy } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { PointHistoryProps } from "./point-history/PointHistoryDetail";
import { PointHistoryTable } from "./point-history/PointHistoryTable";

interface PointHistoryFormValues {
  fromDate: Date;
  toDate: Date;
  pointType: "ADDING" | "USING" | "ALL";
}

const PointHistory: React.FC = () => {
  const form = useForm<PointHistoryFormValues>({
    defaultValues: {
      fromDate: subDays(new Date(), 90),
      toDate: new Date(),
      pointType: "ALL",
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

  // Handle form submission
  const onSubmit = (values: PointHistoryFormValues) => {
    fetchReceipts(values);
  };

  // Transform API data to display format for point history
  const pointHistory = useMemo(() => {
    if (!apiReceipts.length) {
      return [];
    }

    const pointRecords: PointHistoryProps[] = [];

    apiReceipts.forEach((receipt) => {
      const formattedDate = receipt.issuedAt ? format(new Date(receipt.issuedAt), "dd/MM/yyyy", { locale: vi }) : "Không xác định";
      const movieName = receipt.movieName || "Không có thông tin phim";

      // Lọc theo loại điểm (thêm/sử dụng/tất cả)
      const pointType = form.getValues().pointType;

      // Thêm điểm
      if (receipt.addedPoints && receipt.addedPoints > 0 && (pointType === "ADDING" || pointType === "ALL")) {
        pointRecords.push({
          id: `add-${receipt.id}`,
          date: formattedDate,
          movieName: movieName,
          points: receipt.addedPoints,
          pointType: "ADDING",
        });
      }

      // Sử dụng điểm
      if (receipt.usedPoints && receipt.usedPoints > 0 && (pointType === "USING" || pointType === "ALL")) {
        pointRecords.push({
          id: `use-${receipt.id}`,
          date: formattedDate,
          movieName: movieName,
          points: receipt.usedPoints,
          pointType: "USING",
        });
      }

      // Hoàn điểm
      if (receipt.refundedPoints && receipt.refundedPoints > 0 && pointType === "ALL") {
        pointRecords.push({
          id: `refund-${receipt.id}`,
          date: formattedDate,
          movieName: movieName,
          points: receipt.refundedPoints,
          pointType: "REFUND",
        });
      }
    });

    // Sort by date (newest first)
    return pointRecords.sort((a, b) => {
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

      {/* Point History Filter Form - Compact Design */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Date Range Selection */}
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="grid w-full grid-cols-2 gap-2 sm:w-auto">
                  <FormField
                    control={form.control}
                    name="fromDate"
                    render={({ field }: { field: { value: Date; onChange: (date: Date) => void } }) => (
                      <DatePicker date={field.value} setDate={(date) => date && field.onChange(date)} placeholder="Từ ngày" />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="toDate"
                    render={({ field }: { field: { value: Date; onChange: (date: Date) => void } }) => (
                      <DatePicker date={field.value} setDate={(date) => date && field.onChange(date)} placeholder="Đến ngày" />
                    )}
                  />
                </div>

                <div className="flex w-full justify-start sm:w-auto">
                  {/* Point Type Buttons */}
                  <FormField
                    control={form.control}
                    name="pointType"
                    render={({ field }: { field: { value: string; onChange: (value: string) => void } }) => (
                      <div className="bg-muted flex rounded-md p-1">
                        <Button
                          type="button"
                          variant={field.value === "ALL" ? "default" : "ghost"}
                          onClick={() => field.onChange("ALL")}
                          className="h-8 rounded-sm text-sm"
                        >
                          Tất cả
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "ADDING" ? "default" : "ghost"}
                          onClick={() => field.onChange("ADDING")}
                          className="h-8 rounded-sm text-sm"
                        >
                          Cộng điểm
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "USING" ? "default" : "ghost"}
                          onClick={() => field.onChange("USING")}
                          className="h-8 rounded-sm text-sm"
                        >
                          Sử dụng
                        </Button>
                      </div>
                    )}
                  />
                </div>

                {/* Search Button */}
                <Button type="submit" className="ml-auto bg-red-600 text-white hover:bg-red-700">
                  <Search className="mr-2 h-4 w-4" />
                  Tìm kiếm
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Point History Table */}
      <Card>
        <CardHeader>
          <CardDescription>Danh sách lịch sử điểm thưởng của bạn tại FCinema</CardDescription>
        </CardHeader>
        <CardContent>
          <PointHistoryTable pointHistory={pointHistory} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PointHistory;
