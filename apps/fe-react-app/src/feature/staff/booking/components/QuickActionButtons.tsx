import { Button } from "@/components/Shadcn/ui/button";
import type { ApiBooking, BookingStatus, PaymentStatus } from "@/interfaces/booking.interface";
import { useUpdateBooking } from "@/services/bookingService";
import { RotateCcw, X, Zap } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface QuickActionButtonsProps {
  booking: ApiBooking;
  onUpdate: () => void;
}

const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({ booking, onUpdate }) => {
  const updateBookingMutation = useUpdateBooking();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuickAction = async (action: "approve" | "cancel" | "markPaid" | "markPending") => {
    // Không cho phép thao tác nếu thanh toán đã thành công
    if (booking.paymentStatus === "SUCCESS") {
      toast.error("Không thể thay đổi khi thanh toán đã hoàn tất!");
      return;
    }

    setIsUpdating(true);
    try {
      let updateData: Partial<{ status: BookingStatus; paymentStatus: PaymentStatus }> = {};
      switch (action) {
        case "approve":
          updateData = { status: "SUCCESS" as BookingStatus };
          break;
        case "cancel":
          updateData = { status: "CANCELLED" as BookingStatus };
          break;
        case "markPaid":
          // Khi đánh dấu đã thanh toán, cũng cập nhật booking thành công
          updateData = {
            paymentStatus: "SUCCESS" as PaymentStatus,
            status: "SUCCESS" as BookingStatus,
          };
          break;
        case "markPending":
          updateData = { status: "PENDING" as BookingStatus };
          break;
      }
      await updateBookingMutation.mutateAsync({
        params: { path: { id: booking.id ?? 0 } },
        body: updateData,
      });
      onUpdate();
      toast.success("Cập nhật thành công!");
    } catch (error) {
      toast.error("Cập nhật thất bại!");
      console.error("Quick action error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Vô hiệu hóa tất cả nút khi thanh toán đã thành công
  const isPaymentSuccess = booking.paymentStatus === "SUCCESS";

  return (
    <div className="flex items-center gap-1">
      {/* Quick cancel if not cancelled */}
      {booking.status !== "CANCELLED" && (
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => handleQuickAction("cancel")}
          disabled={isUpdating || isPaymentSuccess}
          title={isPaymentSuccess ? "Không thể hủy khi thanh toán đã hoàn tất" : "Hủy booking"}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      Quick mark as paid if payment pending
      {booking.paymentStatus === "PENDING" && (
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          onClick={() => handleQuickAction("markPaid")}
          disabled={isUpdating}
          title="Đánh dấu đã thanh toán"
        >
          <Zap className="h-3 w-3" />
        </Button>
      )}
      {/* Reset to pending */}
      {(booking.status === "SUCCESS" || booking.status === "CANCELLED") && (
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => handleQuickAction("markPending")}
          disabled={isUpdating || isPaymentSuccess}
          title={isPaymentSuccess ? "Không thể thay đổi khi thanh toán đã hoàn tất" : "Đặt lại chờ xử lý"}
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default QuickActionButtons;
