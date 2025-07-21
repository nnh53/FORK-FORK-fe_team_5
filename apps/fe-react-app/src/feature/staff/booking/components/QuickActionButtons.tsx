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
          updateData = { paymentStatus: "SUCCESS" as PaymentStatus };
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

  return (
    <div className="flex items-center gap-1">
      {/* Quick cancel if not cancelled */}
      {booking.status !== "CANCELLED" && (
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => handleQuickAction("cancel")}
          disabled={isUpdating}
          title="Hủy booking"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      {/* Quick mark as paid if payment pending */}
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
          className="h-7 px-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-700"
          onClick={() => handleQuickAction("markPending")}
          disabled={isUpdating}
          title="Đặt lại chờ xử lý"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default QuickActionButtons;
