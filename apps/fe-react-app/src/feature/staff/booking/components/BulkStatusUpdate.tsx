import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/Shadcn/ui/alert-dialog";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent } from "@/components/Shadcn/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import type { BookingStatus, PaymentStatus } from "@/interfaces/booking.interface";
import { useUpdateBooking } from "@/services/bookingService";
import React, { useState } from "react";
import { toast } from "sonner";

interface BulkStatusUpdateProps {
  selectedBookings: string[];
  onUpdate: () => void;
  onClearSelection: () => void;
}

const BulkStatusUpdate: React.FC<BulkStatusUpdateProps> = ({ selectedBookings, onUpdate, onClearSelection }) => {
  const updateBookingMutation = useUpdateBooking();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateType, setUpdateType] = useState<"booking" | "payment">("booking");
  const [newStatus, setNewStatus] = useState<string>("");

  const handleBulkUpdate = async () => {
    if (!newStatus || selectedBookings.length === 0) return;
    setIsUpdating(true);
    try {
      const updateData = updateType === "booking" ? { status: newStatus as BookingStatus } : { paymentStatus: newStatus as PaymentStatus };
      for (const bookingId of selectedBookings) {
        await updateBookingMutation.mutateAsync({
          params: { path: { id: parseInt(bookingId) } },
          body: updateData,
        });
      }
      onUpdate();
      onClearSelection();
      toast.success(`Cập nhật ${selectedBookings.length} booking thành công!`);
      setNewStatus("");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật hàng loạt!");
      console.error("Bulk update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (selectedBookings.length === 0) return null;

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardContent className="pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Đã chọn {selectedBookings.length} booking</span>
            <Button variant="outline" size="sm" onClick={onClearSelection}>
              Hủy chọn
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Select value={updateType} onValueChange={(value: "booking" | "payment") => setUpdateType(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="booking">Trạng thái booking</SelectItem>
                <SelectItem value="payment">Trạng thái thanh toán</SelectItem>
              </SelectContent>
            </Select>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Chọn trạng thái mới" />
              </SelectTrigger>
              <SelectContent>
                {updateType === "booking" ? (
                  <>
                    <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                    <SelectItem value="SUCCESS">Thành công</SelectItem>
                    <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                    <SelectItem value="SUCCESS">Đã thanh toán</SelectItem>
                    <SelectItem value="FAILED">Thất bại</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={!newStatus || isUpdating}>{isUpdating ? "Đang cập nhật..." : "Cập nhật hàng loạt"}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận cập nhật hàng loạt</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc muốn cập nhật {updateType === "booking" ? "trạng thái booking" : "trạng thái thanh toán"} của{" "}
                    {selectedBookings.length} booking được chọn không?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkUpdate}>Xác nhận</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkStatusUpdate;
