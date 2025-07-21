import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import type { ApiBooking, BookingStatus, PaymentStatus } from "@/interfaces/booking.interface";
import { useUpdateBooking } from "@/services/bookingService";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CheckCircle, Edit, Eye } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function formatCurrency(amount?: number) {
  return amount ? `${amount.toLocaleString()}đ` : "N/A";
}
function formatDateTime(dateString?: string) {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
  } catch {
    return "N/A";
  }
}
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
function getPaymentMethodText(method?: string) {
  switch (method) {
    case "CASH":
      return "Tiền mặt";
    case "ONLINE":
      return "Thanh toán online";
    default:
      return method || "N/A";
  }
}

interface BookingDetailModalProps {
  booking: ApiBooking;
  onUpdate: () => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ booking, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    status: booking.status || ("PENDING" as BookingStatus),
    paymentStatus: booking.paymentStatus || ("PENDING" as PaymentStatus),
    payOsCode: booking.payOsCode || "",
  });
  const updateBookingMutation = useUpdateBooking();
  const handleUpdate = async () => {
    try {
      await updateBookingMutation.mutateAsync({
        params: { path: { id: booking.id ?? 0 } },
        body: editForm,
      });
      onUpdate();
      toast.success("Cập nhật booking thành công!");
      setIsEditing(false);
      setIsOpen(false);
    } catch (error) {
      toast.error("Cập nhật booking thất bại!");
      console.error("Update booking error:", error);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] min-w-[60vw] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết Booking #{booking.id}</DialogTitle>
          <DialogDescription>Thông tin chi tiết về booking và các thao tác quản lý</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          {/* Left column: Basic + Customer */}
          <div className="flex-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Mã booking</Label>
                  <p className="text-sm">{booking.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Ngày đặt</Label>
                  <p className="text-sm">{formatDateTime(booking.bookingDate)}</p>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Trạng thái booking</Label>
                    <div className="mt-1">
                      {isEditing ? (
                        <Select
                          value={editForm.status}
                          onValueChange={(value) => setEditForm((prev) => ({ ...prev, status: value as BookingStatus }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                            <SelectItem value="SUCCESS">Thành công</SelectItem>
                            <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        getStatusBadge(booking.status || "PENDING", "booking")
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Trạng thái thanh toán</Label>
                    <div className="mt-1">
                      {isEditing ? (
                        <Select
                          value={editForm.paymentStatus}
                          onValueChange={(value) => setEditForm((prev) => ({ ...prev, paymentStatus: value as PaymentStatus }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                            <SelectItem value="SUCCESS">Đã thanh toán</SelectItem>
                            <SelectItem value="FAILED">Thanh toán thất bại</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        getStatusBadge(booking.paymentStatus || "PENDING", "payment")
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Phương thức thanh toán</Label>
                  <p className="text-sm">{getPaymentMethodText(booking.paymentMethod)}</p>
                </div>
                {isEditing && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Mã PayOS</Label>
                    <Input
                      value={editForm.payOsCode}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, payOsCode: e.target.value }))}
                      placeholder="Mã PayOS (nếu có)"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin khách hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Tên khách hàng</Label>
                  <p className="text-sm">{booking.user?.fullName || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="text-sm">{booking.user?.email || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Số điện thoại</Label>
                  <p className="text-sm">{booking.user?.phone || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Điểm tích lũy sử dụng</Label>
                  <p className="text-sm">{booking.loyaltyPointsUsed || 0} điểm</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Nhân viên xử lý</Label>
                  <p className="text-sm">{booking.staffId || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Right column: Movie + Seats */}
          <div className="flex-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin phim & suất chiếu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Tên phim</Label>
                  <p className="text-sm font-medium">Movie ID: {booking.showTime?.movieId || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Thời gian chiếu</Label>
                  <p className="text-sm">
                    {booking.showTime?.showDateTime ? format(new Date(booking.showTime.showDateTime), "dd/MM/yyyy HH:mm", { locale: vi }) : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Phòng chiếu</Label>
                  <p className="text-sm">Phòng chiếu #{booking.showTime?.roomName || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ghế & Sản phẩm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Ghế đã đặt</Label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {booking.seats?.map((seat) => (
                      <Badge key={seat.id} variant="outline" className="text-xs">
                        {seat.row}
                        {seat.column}
                      </Badge>
                    )) || <p className="text-sm text-gray-500">Không có ghế</p>}
                  </div>
                </div>
                {booking.bookingSnacks && booking.bookingSnacks.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Đồ ăn & thức uống</Label>
                    <div className="mt-1 space-y-1">
                      {booking.bookingSnacks.map((item, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span>
                            {item.snack?.name} x{item.quantity}
                          </span>
                          <span>{item.totalPrice ? `${item.totalPrice.toLocaleString()}đ` : "N/A"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {booking.bookingCombos && booking.bookingCombos.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Combo</Label>
                    <div className="mt-1 space-y-1">
                      {booking.bookingCombos.map((item, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span>
                            {item.combo?.name} x{item.quantity}
                          </span>
                          <span>{item.totalPrice ? `${item.totalPrice.toLocaleString()}đ` : "N/A"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Tổng tiền:</span>
                    <span className="text-red-600">{formatCurrency(booking.totalPrice)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <DialogFooter className="mt-6 flex gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Đóng
          </Button>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Hủy
              </Button>
              <Button onClick={handleUpdate} disabled={updateBookingMutation.isPending}>
                <CheckCircle className="mr-2 h-4 w-4" />
                {updateBookingMutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailModal;
