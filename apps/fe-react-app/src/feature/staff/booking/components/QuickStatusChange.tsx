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

  const handleStatusChange = async (newStatus: string) => {
    setIsChanging(true);
    try {
      const updateData = type === "booking" ? { status: newStatus as BookingStatus } : { paymentStatus: newStatus as PaymentStatus };
      await updateBookingMutation.mutateAsync({
        params: { path: { id: booking.id ?? 0 } },
        body: updateData,
      });
      onUpdate();
      toast.success(`Cập nhật ${type === "booking" ? "trạng thái booking" : "trạng thái thanh toán"} thành công!`);
    } catch (error) {
      toast.error(`Cập nhật ${type === "booking" ? "trạng thái booking" : "trạng thái thanh toán"} thất bại!`);
      console.error("Update status error:", error);
    } finally {
      setIsChanging(false);
    }
  };

  const currentStatus = type === "booking" ? booking.status : booking.paymentStatus;
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isChanging}>
          {isChanging ? "Đang cập nhật..." : getStatusBadge(currentStatus || "PENDING", type)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Đổi trạng thái</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => {
              if (currentStatus !== option.value) {
                handleStatusChange(option.value);
              }
            }}
            disabled={currentStatus === option.value}
            className={currentStatus === option.value ? "bg-gray-100 text-gray-400" : ""}
          >
            <Badge variant={option.variant} className="mr-2">
              {option.label}
            </Badge>
            {currentStatus === option.value && <span className="text-xs">(Hiện tại)</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QuickStatusChange;
