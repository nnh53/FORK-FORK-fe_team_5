import { Badge } from "@/components/Shadcn/ui/badge";
import type { ApiBooking } from "@/interfaces/booking.interface";
import React from "react";

interface StatusStatisticsProps {
  bookings: ApiBooking[];
}

const StatusStatistics: React.FC<StatusStatisticsProps> = ({ bookings }) => {
  const pending = bookings.filter((b) => b.status === "PENDING").length;
  const success = bookings.filter((b) => b.status === "SUCCESS").length;
  const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;
  const paymentPending = bookings.filter((b) => b.paymentStatus === "PENDING").length;
  const paymentSuccess = bookings.filter((b) => b.paymentStatus === "SUCCESS").length;
  const paymentFailed = bookings.filter((b) => b.paymentStatus === "FAILED").length;
  const stats = {
    booking: { pending, success, cancelled },
    payment: { pending: paymentPending, success: paymentSuccess, failed: paymentFailed },
  };
  if (bookings.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        Chờ: {stats.booking.pending}
      </Badge>
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
        Thành công: {stats.booking.success}
      </Badge>
      <Badge variant="destructive">Hủy: {stats.booking.cancelled}</Badge>
      <span className="text-gray-400">|</span>
      <Badge variant="outline" className="border-yellow-500 text-yellow-700">
        Chờ TT: {stats.payment.pending}
      </Badge>
      <Badge variant="outline" className="border-green-500 text-green-700">
        Đã TT: {stats.payment.success}
      </Badge>
      <Badge variant="outline" className="border-red-500 text-red-700">
        TT thất bại: {stats.payment.failed}
      </Badge>
    </div>
  );
};

export default StatusStatistics;
