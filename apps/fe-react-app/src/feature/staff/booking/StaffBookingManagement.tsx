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
import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Checkbox } from "@/components/Shadcn/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/Shadcn/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Shadcn/ui/dropdown-menu";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Shadcn/ui/tabs";
import type { ApiBooking, BookingStatus, PaymentStatus } from "@/interfaces/booking.interface";
import { useBookings, useBookingsByStatus, useUpdateBooking } from "@/services/bookingService";
import { useSearchUser } from "@/services/userService";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CheckCheck, CheckCircle, Edit, Eye, Filter, MoreHorizontal, RotateCcw, Search, X, Zap } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

// Types for filters and booking management
interface BookingFilters {
  status?: BookingStatus | "";
  paymentStatus?: PaymentStatus | "" | "ALL";
  searchTerm?: string;
  userId?: string;
}

// Helper function to get status badge variant
const getStatusBadge = (status: string, type: "booking" | "payment") => {
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
};

// Helper function to get payment method text
const getPaymentMethodText = (method: string | undefined) => {
  switch (method) {
    case "CASH":
      return "Tiền mặt";
    case "ONLINE":
      return "Thanh toán online";
    default:
      return method || "N/A";
  }
};

// Helper functions for safe operations
const formatCurrency = (amount: number | undefined): string => {
  return amount ? `${amount.toLocaleString()}đ` : "N/A";
};

const formatDateTime = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
  } catch {
    return "N/A";
  }
};

// Quick Action Buttons Component
const QuickActionButtons: React.FC<{
  booking: ApiBooking;
  onUpdate: () => void;
}> = ({ booking, onUpdate }) => {
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
      {/* Quick approve if pending */}
      {booking.status === "PENDING" && (
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2 text-xs text-green-600 hover:bg-green-50 hover:text-green-700"
          onClick={() => handleQuickAction("approve")}
          disabled={isUpdating}
          title="Duyệt booking (Ctrl+A)"
        >
          <CheckCheck className="h-3 w-3" />
        </Button>
      )}

      {/* Quick cancel if not cancelled */}
      {booking.status !== "CANCELLED" && (
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => handleQuickAction("cancel")}
          disabled={isUpdating}
          title="Hủy booking (Ctrl+X)"
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
          title="Đánh dấu đã thanh toán (Ctrl+P)"
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
          title="Đặt lại chờ xử lý (Ctrl+R)"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

// Booking Detail Modal Component
const BookingDetailModal: React.FC<{ booking: ApiBooking; onUpdate: () => void }> = ({ booking, onUpdate }) => {
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
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết Booking #{booking.id}</DialogTitle>
          <DialogDescription>Thông tin chi tiết về booking và các thao tác quản lý</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Basic Information */}
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
              <div>
                <Label className="text-sm font-medium text-gray-500">Trạng thái booking</Label>
                <div className="mt-1">
                  {isEditing ? (
                    <Select value={editForm.status} onValueChange={(value) => setEditForm((prev) => ({ ...prev, status: value as BookingStatus }))}>
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

          {/* Customer Information */}
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

          {/* Movie & Showtime Information */}
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

          {/* Seats & Items */}
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

        <DialogFooter className="flex gap-2">
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

// Quick Status Change Component
const QuickStatusChange: React.FC<{
  booking: ApiBooking;
  onUpdate: () => void;
  type: "booking" | "payment";
}> = ({ booking, onUpdate, type }) => {
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

// Bulk Status Update Component
const BulkStatusUpdate: React.FC<{
  selectedBookings: string[];
  onUpdate: () => void;
  onClearSelection: () => void;
}> = ({ selectedBookings, onUpdate, onClearSelection }) => {
  const updateBookingMutation = useUpdateBooking();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateType, setUpdateType] = useState<"booking" | "payment">("booking");
  const [newStatus, setNewStatus] = useState<string>("");

  const handleBulkUpdate = async () => {
    if (!newStatus || selectedBookings.length === 0) return;

    setIsUpdating(true);
    try {
      const updateData = updateType === "booking" ? { status: newStatus as BookingStatus } : { paymentStatus: newStatus as PaymentStatus };

      // Update each booking sequentially
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
                    Bạn có chắc muốn cập nhật {updateType === "booking" ? "trạng thái booking" : "trạng thái thanh toán"}
                    của {selectedBookings.length} booking được chọn không?
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

// Status Statistics Component
const StatusStatistics: React.FC<{ bookings: ApiBooking[] }> = ({ bookings }) => {
  const stats = useMemo(() => {
    const pending = bookings.filter((b) => b.status === "PENDING").length;
    const success = bookings.filter((b) => b.status === "SUCCESS").length;
    const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;
    const paymentPending = bookings.filter((b) => b.paymentStatus === "PENDING").length;
    const paymentSuccess = bookings.filter((b) => b.paymentStatus === "SUCCESS").length;
    const paymentFailed = bookings.filter((b) => b.paymentStatus === "FAILED").length;

    return {
      booking: { pending, success, cancelled },
      payment: { pending: paymentPending, success: paymentSuccess, failed: paymentFailed },
    };
  }, [bookings]);

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

const StaffBookingManagement: React.FC = () => {
  // State for filters and search
  const [filters, setFilters] = useState<BookingFilters>({
    status: "",
    paymentStatus: "ALL",
    searchTerm: "",
    userId: "",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [searchUser, setSearchUser] = useState("");

  // State for bulk selection
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // API hooks with error handling
  const { data: allBookings, isLoading: isLoadingAll, error: errorAll, refetch: refetchAll } = useBookings();

  const { data: pendingBookings, isLoading: isLoadingPending, error: errorPending } = useBookingsByStatus("PENDING");

  const { data: successBookings, isLoading: isLoadingSuccess, error: errorSuccess } = useBookingsByStatus("SUCCESS");

  const { data: cancelledBookings, isLoading: isLoadingCancelled, error: errorCancelled } = useBookingsByStatus("CANCELLED");

  // User search for filtering - only search if searchUser has content
  const { data: searchResults } = useSearchUser(searchUser.length > 2 ? searchUser : "");
  const searchData = searchResults?.result;

  // Check for any API errors
  const hasApiError = errorAll || errorPending || errorSuccess || errorCancelled;

  // Get data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "pending":
        return { data: pendingBookings, isLoading: isLoadingPending };
      case "success":
        return { data: successBookings, isLoading: isLoadingSuccess };
      case "cancelled":
        return { data: cancelledBookings, isLoading: isLoadingCancelled };
      default:
        return { data: allBookings, isLoading: isLoadingAll };
    }
  };

  const { data: currentBookings, isLoading } = getCurrentData();

  // Filter bookings based on current filters
  const filteredBookings = useMemo(() => {
    const bookingsData = currentBookings?.result || [];
    if (!Array.isArray(bookingsData)) return [];

    let filtered = [...bookingsData];

    // Filter by search term (customer name, email, phone, booking ID)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.id?.toString().includes(searchLower) ||
          booking.user?.fullName?.toLowerCase().includes(searchLower) ||
          booking.user?.email?.toLowerCase().includes(searchLower) ||
          booking.user?.phone?.toLowerCase().includes(searchLower),
      );
    }

    // Filter by specific user ID (from user search)
    if (filters.userId) {
      filtered = filtered.filter((booking) => booking.user?.id === filters.userId);
    }

    // Filter by payment status
    if (filters.paymentStatus && filters.paymentStatus !== "ALL") {
      filtered = filtered.filter((booking) => booking.paymentStatus === filters.paymentStatus);
    }

    return filtered;
  }, [currentBookings, filters]);

  // Handle bulk selection functions
  const handleSelectBooking = (bookingId: string, checked: boolean) => {
    if (checked) {
      setSelectedBookings((prev) => [...prev, bookingId]);
    } else {
      setSelectedBookings((prev) => prev.filter((id) => id !== bookingId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const allIds = filteredBookings.map((booking) => booking.id?.toString()).filter(Boolean) as string[];
      setSelectedBookings(allIds);
    } else {
      setSelectedBookings([]);
    }
  };

  const clearSelection = () => {
    setSelectedBookings([]);
    setSelectAll(false);
  };

  // Table columns definition - removed complex ColumnDef and replaced with simple table
  const renderBookingRow = (booking: ApiBooking) => (
    <TableRow key={booking.id} className={selectedBookings.includes(booking.id?.toString() || "") ? "bg-blue-50" : ""}>
      <TableCell>
        <Checkbox
          checked={selectedBookings.includes(booking.id?.toString() || "")}
          onCheckedChange={(checked) => handleSelectBooking(booking.id?.toString() || "", checked as boolean)}
        />
      </TableCell>
      <TableCell>
        <div className="font-medium">#{booking.id}</div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium">{booking.user?.fullName || "N/A"}</div>
          <div className="text-xs text-gray-500">{booking.user?.email || booking.user?.phone || ""}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="text-sm font-medium">Movie ID: {booking.showTime?.movieId || "N/A"}</div>
          <div className="text-xs text-gray-500">
            {booking.showTime?.showDateTime ? format(new Date(booking.showTime.showDateTime), "dd/MM/yyyy HH:mm", { locale: vi }) : "N/A"}
          </div>
          <div className="text-xs text-gray-500">{booking.showTime?.roomName || "N/A"}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {booking.seats?.slice(0, 3).map((seat) => (
            <Badge key={seat.id} variant="outline" className="text-xs">
              {seat.row}
              {seat.column}
            </Badge>
          ))}
          {booking.seats && booking.seats.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{booking.seats.length - 3}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium text-red-600">{booking.totalPrice ? `${booking.totalPrice.toLocaleString()}đ` : "N/A"}</div>
      </TableCell>
      <TableCell>
        <QuickStatusChange booking={booking} onUpdate={() => refetchAll()} type="booking" />
      </TableCell>
      <TableCell>
        <QuickStatusChange booking={booking} onUpdate={() => refetchAll()} type="payment" />
      </TableCell>
      <TableCell>
        <div className="text-sm">{booking.bookingDate ? format(new Date(booking.bookingDate), "dd/MM/yyyy HH:mm", { locale: vi }) : "N/A"}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {/* Quick Action Buttons */}
          <QuickActionButtons booking={booking} onUpdate={() => refetchAll()} />

          {/* Detail Modal */}
          <BookingDetailModal
            booking={booking}
            onUpdate={() => {
              // Refetch data to update the table
              refetchAll();
            }}
          />

          {/* More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(booking.id?.toString() || "")}>Sao chép mã booking</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(booking.user?.email || "")}>Sao chép email khách hàng</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );

  // Handle user search selection
  const handleUserSelect = (userId: string, userName: string) => {
    setFilters((prev) => ({ ...prev, userId }));
    setSearchUser(userName);
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {hasApiError && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">⚠️ Lỗi kết nối API</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-red-700">Không thể tải dữ liệu booking. Vui lòng kiểm tra:</p>
            <ul className="ml-4 list-disc space-y-1 text-sm text-red-600">
              <li>Kết nối internet</li>
              <li>Server backend đang hoạt động</li>
              <li>Cấu hình VITE_API_URL trong file .env</li>
            </ul>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => {
                  refetchAll();
                  window.location.reload();
                }}
                variant="outline"
                size="sm"
              >
                Thử lại
              </Button>
              <Button onClick={() => console.log("API URL:", import.meta.env.VITE_API_URL)} variant="outline" size="sm">
                Kiểm tra cấu hình
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Booking</h1>
          <p className="text-muted-foreground">Quản lý và theo dõi tất cả các booking của khách hàng</p>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Bộ lọc tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* General Search */}
            <div className="space-y-2">
              <Label>Tìm kiếm tổng quát</Label>
              <div className="relative">
                <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
                <Input
                  placeholder="Mã booking, tên KH, email, SĐT, tên phim..."
                  className="pl-8"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
                />
              </div>
            </div>

            {/* User Search */}
            <div className="space-y-2">
              <Label>Tìm khách hàng</Label>
              <div className="relative">
                <Input placeholder="Nhập tên, email hoặc SĐT..." value={searchUser} onChange={(e) => setSearchUser(e.target.value)} />
                {searchData && Array.isArray(searchData) && searchData.length > 0 && searchUser.length > 2 && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                    {searchData.slice(0, 5).map((user: { id: string; fullName: string; email: string; phoneNumber?: string }) => (
                      <div
                        key={user.id}
                        className="cursor-pointer border-b p-2 last:border-b-0 hover:bg-gray-100"
                        onClick={() => handleUserSelect(user.id, user.fullName)}
                      >
                        <div className="text-sm font-medium">{user.fullName}</div>
                        <div className="text-xs text-gray-500">
                          {user.email} • {user.phoneNumber}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Status Filter */}
            <div className="space-y-2">
              <Label>Trạng thái thanh toán</Label>
              <Select
                value={filters.paymentStatus}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, paymentStatus: value as PaymentStatus }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                  <SelectItem value="SUCCESS">Đã thanh toán</SelectItem>
                  <SelectItem value="FAILED">Thanh toán thất bại</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({ status: "", paymentStatus: "ALL", searchTerm: "", userId: "" });
                  setSearchUser("");
                }}
                className="w-full"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.searchTerm || filters.userId || (filters.paymentStatus && filters.paymentStatus !== "ALL")) && (
            <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
              <span className="text-sm text-gray-500">Bộ lọc đang áp dụng:</span>
              {filters.searchTerm && (
                <Badge variant="secondary">
                  Tìm kiếm: {filters.searchTerm}
                  <button onClick={() => setFilters((prev) => ({ ...prev, searchTerm: "" }))} className="ml-2 hover:text-red-500">
                    ×
                  </button>
                </Badge>
              )}
              {filters.userId && (
                <Badge variant="secondary">
                  Khách hàng: {searchUser}
                  <button
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, userId: "" }));
                      setSearchUser("");
                    }}
                    className="ml-2 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.paymentStatus &&
                filters.paymentStatus !== "ALL" &&
                (() => {
                  let statusText = "Thất bại";
                  if (filters.paymentStatus === "PENDING") statusText = "Chờ thanh toán";
                  if (filters.paymentStatus === "SUCCESS") statusText = "Đã thanh toán";

                  return (
                    <Badge variant="secondary">
                      Thanh toán: {statusText}
                      <button onClick={() => setFilters((prev) => ({ ...prev, paymentStatus: "ALL" }))} className="ml-2 hover:text-red-500">
                        ×
                      </button>
                    </Badge>
                  );
                })()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
          <TabsTrigger value="success">Thành công</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng số booking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Array.isArray(allBookings?.result) ? allBookings.result.length : 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{Array.isArray(pendingBookings?.result) ? pendingBookings.result.length : 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Thành công</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{Array.isArray(successBookings?.result) ? successBookings.result.length : 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã hủy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {Array.isArray(cancelledBookings?.result) ? cancelledBookings.result.length : 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Status Update */}
          <BulkStatusUpdate selectedBookings={selectedBookings} onUpdate={() => refetchAll()} onClearSelection={clearSelection} />

          {/* Data Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Danh sách booking
                    {activeTab !== "all" &&
                      ` - ${(() => {
                        if (activeTab === "pending") return "Chờ xử lý";
                        if (activeTab === "success") return "Thành công";
                        return "Đã hủy";
                      })()}`}
                  </CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-4">
                    <span>{filteredBookings.length} booking được tìm thấy</span>
                    <StatusStatistics bookings={filteredBookings.filter((b) => b.id !== undefined) as ApiBooking[]} />
                  </CardDescription>
                </div>
                {selectedBookings.length > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Đã chọn: {selectedBookings.length}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Đang tải dữ liệu...</div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox checked={selectAll} onCheckedChange={(checked) => handleSelectAll(checked as boolean)} />
                      </TableHead>
                      <TableHead>Mã Booking</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Phim & Suất chiếu</TableHead>
                      <TableHead>Ghế</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thanh toán</TableHead>
                      <TableHead>Ngày đặt</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking) => (booking.id ? renderBookingRow(booking as ApiBooking) : null))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} className="py-8 text-center text-gray-500">
                          Không có booking nào được tìm thấy
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffBookingManagement;
