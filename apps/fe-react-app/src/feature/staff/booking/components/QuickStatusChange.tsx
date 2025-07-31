import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Shadcn/ui/dropdown-menu";
import type { ApiBooking, BookingStatus, PaymentStatus } from "@/interfaces/booking.interface";
import { useUpdateBooking } from "@/services/bookingService";
import React, { useState } from "react";
import { toast } from "sonner";

function getStatusBadge(status: string, type: "booking" | "payment") {
  if (type === "booking") {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
            Thành công
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Chờ xử lý
          </Badge>
        );
      case "CANCELLED":
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  } else {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
            Đã thanh toán
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Chờ thanh toán
          </Badge>
        );
      case "FAILED":
        return <Badge variant="destructive">Thanh toán thất bại</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }
}

interface QuickStatusChangeProps {
  booking: ApiBooking;
  onUpdate: () => void;
  type: "booking" | "payment";
}

const QuickStatusChange: React.FC<QuickStatusChangeProps> = ({ booking, onUpdate, type }) => {
  const updateBookingMutation = useUpdateBooking();
  const [isChanging, setIsChanging] = useState(false);

  const createUpdateData = (newStatus: string, type: "booking" | "payment") => {
    if (type === "booking") {
      return { status: newStatus as BookingStatus };
    }

    // Payment status update with automatic booking status change
    const updateData: { paymentStatus: PaymentStatus; status?: BookingStatus } = {
      paymentStatus: newStatus as PaymentStatus,
    };

    if (newStatus === "SUCCESS") {
      updateData.status = "SUCCESS" as BookingStatus;
    } else if (newStatus === "FAILED") {
      updateData.status = "CANCELLED" as BookingStatus;
    }

    return updateData;
  };

  const getSuccessMessage = (newStatus: string, type: "booking" | "payment") => {
    if (type === "payment" && (newStatus === "SUCCESS" || newStatus === "FAILED")) {
      const paymentStatusText = newStatus === "SUCCESS" ? "thành công" : "thất bại";
      const bookingStatusText = newStatus === "SUCCESS" ? "thành công" : "hủy";
      return `Cập nhật trạng thái thanh toán ${paymentStatusText} và trạng thái booking ${bookingStatusText}!`;
    }
    return `Cập nhật ${type === "booking" ? "trạng thái booking" : "trạng thái thanh toán"} thành công!`;
  };

  const handleStatusChange = async (newStatus: string) => {
    // Không cho phép thay đổi trạng thái booking từ SUCCESS sang trạng thái khác
    if (type === "booking" && booking.status === "SUCCESS" && newStatus !== "SUCCESS") {
      toast.error("Không thể thay đổi trạng thái booking đã thành công!");
      return;
    }

    setIsChanging(true);
    try {
      const updateData = createUpdateData(newStatus, type);

      await updateBookingMutation.mutateAsync({
        params: { path: { id: booking.id ?? 0 } },
        body: updateData,
      });

      onUpdate();
      toast.success(getSuccessMessage(newStatus, type));
    } catch (error) {
      toast.error(`Cập nhật ${type === "booking" ? "trạng thái booking" : "trạng thái thanh toán"} thất bại!`);
      console.error("Update status error:", error);
    } finally {
      setIsChanging(false);
    }
  };

  const currentStatus = type === "booking" ? booking.status : booking.paymentStatus;
  const isPaymentSuccess = booking.paymentStatus === "SUCCESS";

  const statusOptions =
    type === "booking"
      ? [
          { value: "PENDING", label: "Chờ xử lý", variant: "secondary" as const },
          { value: "SUCCESS", label: "Thành công", variant: "default" as const },
          { value: "CANCELLED", label: "Đã hủy", variant: "destructive" as const },
        ]
      : [
          { value: "PENDING", label: "Chờ thanh toán", variant: "secondary" as const },
          { value: "SUCCESS", label: "Đã thanh toán", variant: "default" as const },
          { value: "FAILED", label: "Thất bại", variant: "destructive" as const },
        ];

  // Không cho phép thay đổi nếu thanh toán đã thành công
  const isDisabled = isPaymentSuccess;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isChanging || isDisabled}>
          {isChanging ? "Đang cập nhật..." : getStatusBadge(currentStatus || "PENDING", type)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{isDisabled ? "Không thể thay đổi" : "Đổi trạng thái"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isDisabled ? (
          <DropdownMenuItem disabled className="text-gray-400">
            Thanh toán đã hoàn tất - không thể thay đổi
          </DropdownMenuItem>
        ) : (
          statusOptions.map((option) => {
            const isCurrentStatus = currentStatus === option.value;
            const isBookingSuccess = type === "booking" && booking.status === "SUCCESS";
            const isOptionDisabled = isCurrentStatus || (isBookingSuccess && option.value !== "SUCCESS");

            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => {
                  if (!isOptionDisabled) {
                    handleStatusChange(option.value);
                  }
                }}
                disabled={isOptionDisabled}
                className={isOptionDisabled ? "bg-gray-100 text-gray-400" : ""}
              >
                <Badge variant={option.variant} className="mr-2">
                  {option.label}
                </Badge>
                {isCurrentStatus && <span className="text-xs">(Hiện tại)</span>}
                {isBookingSuccess && option.value !== "SUCCESS" && <span className="text-xs">(Không thể thay đổi)</span>}
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QuickStatusChange;
