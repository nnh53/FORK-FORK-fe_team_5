import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Separator } from "@/components/Shadcn/ui/separator";
import { Calendar, CheckCircle, Eye, Mail, MapPin, Phone, RefreshCw, Search, Ticket, User, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { bookingService, type Booking } from "../../../services/bookingService";

const StaffBookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);
  useEffect(() => {
    const filterBookings = () => {
      let filtered = bookings;

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(
          (booking) =>
            booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.customerInfo.phone.includes(searchTerm),
        );
      }

      // Filter by status
      if (statusFilter && statusFilter !== "all") {
        filtered = filtered.filter((booking) => booking.status === statusFilter);
      }

      // Filter by date
      if (dateFilter) {
        filtered = filtered.filter((booking) => {
          const bookingDate = new Date(booking.bookingDate).toISOString().split("T")[0];
          return bookingDate === dateFilter;
        });
      }

      setFilteredBookings(filtered);
    };

    filterBookings();
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Không thể tải danh sách booking");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      await bookingService.confirmBooking(bookingId);
      toast.success("Xác nhận booking thành công");
      fetchBookings();
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast.error("Không thể xác nhận booking");
    }
  };
  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingService.cancelBooking(bookingId);
      toast.success("Hủy booking thành công");
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Không thể hủy booking");
    }
  };

  const handleViewBookingDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xử lý";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý Booking</h1>
        <Button onClick={fetchBookings} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Tìm kiếm và lọc
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search" className="mb-2 block">
                Tìm kiếm
              </Label>
              <Input
                id="search"
                placeholder="Mã booking, tên khách hàng, SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status" className="mb-2 block">
                Trạng thái
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date" className="mb-2 block">
                Ngày
              </Label>
              <Input id="date" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setDateFilter("");
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Tổng booking</div>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Chờ xử lý</div>
            <div className="text-2xl font-bold text-yellow-600">{bookings.filter((b) => b.status === "pending").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Đã xác nhận</div>
            <div className="text-2xl font-bold text-green-600">{bookings.filter((b) => b.status === "confirmed").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Doanh thu hôm nay</div>
            <div className="text-2xl font-bold text-blue-600">
              {bookings
                .filter((b) => new Date(b.bookingDate).toDateString() === new Date().toDateString())
                .reduce((sum, b) => sum + b.totalAmount, 0)
                .toLocaleString("vi-VN")}{" "}
              VNĐ
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Booking ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="font-medium text-lg">{booking.id}</div>
                      <div className="text-sm text-gray-500">{new Date(booking.bookingDate).toLocaleString("vi-VN")}</div>
                      <Badge className={getStatusColor(booking.status)}>{getStatusText(booking.status)}</Badge>
                    </div>

                    <div>
                      <div className="font-medium">{booking.customerInfo.name}</div>
                      <div className="text-sm text-gray-500">{booking.customerInfo.phone}</div>
                      <div className="text-sm text-gray-500">{booking.customerInfo.email}</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">Ghế:</div>
                      <div className="font-medium">{booking.seats.join(", ")}</div>
                      <div className="text-sm text-gray-500">Phòng: {booking.cinemaRoomId}</div>
                    </div>

                    <div>
                      <div className="font-medium text-red-600">{booking.totalAmount.toLocaleString("vi-VN")} VNĐ</div>
                      <div className="text-sm text-gray-500 capitalize">{booking.paymentMethod}</div>
                      <div className="text-sm text-gray-500">{booking.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => handleViewBookingDetail(booking)}>
                      <Eye className="h-4 w-4" />
                    </Button>

                    {booking.status === "pending" && (
                      <>
                        <Button size="sm" variant="default" onClick={() => handleConfirmBooking(booking.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleCancelBooking(booking.id)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {booking.combos && booking.combos.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm text-gray-500">Combo:</div>
                    <div className="text-sm">
                      {booking.combos.map((combo, index) => (
                        <span key={index}>
                          {combo.name} x{combo.quantity}
                          {index < booking.combos!.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filteredBookings.length === 0 && <div className="text-center py-8 text-gray-500">Không tìm thấy booking nào</div>}
          </div>
        </CardContent>
      </Card>

      {/* Booking Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] min-w-[40vw] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Chi Tiết Booking - {selectedBooking?.id}
            </DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông Tin Khách Hàng
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Họ tên:</span>
                    <span>{selectedBooking.customerInfo.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">Điện thoại:</span>
                    <span>{selectedBooking.customerInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="font-medium">Email:</span>
                    <span>{selectedBooking.customerInfo.email || "Không có"}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Booking Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Thông Tin Đặt Vé</h3>
                <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Ngày đặt:</span>
                    <span>{new Date(selectedBooking.bookingDate).toLocaleString("vi-VN")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(selectedBooking.status)}>{getStatusText(selectedBooking.status)}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Phòng chiếu:</span>
                    <span>{selectedBooking.cinemaRoomId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Phương thức thanh toán:</span>
                    <span className="capitalize">{selectedBooking.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Seats Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Ghế Đã Chọn</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.seats.map((seat, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {seat}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">Tổng số ghế: {selectedBooking.seats.length}</div>
                </div>
              </div>

              <Separator />

              {/* Combos & Snacks */}
              {selectedBooking.combos && selectedBooking.combos.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Combo & Đồ Ăn</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      {selectedBooking.combos.map((combo, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{combo.name}</span>
                          <div className="text-right">
                            <span className="text-sm text-gray-600">x{combo.quantity}</span>
                            <div className="font-medium">{(combo.price * combo.quantity).toLocaleString("vi-VN")} VNĐ</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Payment Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Tóm Tắt Thanh Toán</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tổng tiền:</span>
                      <span className="font-bold text-lg text-red-600">{selectedBooking.totalAmount.toLocaleString("vi-VN")} VNĐ</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Trạng thái thanh toán:</span>
                      <span className={selectedBooking.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}>
                        {selectedBooking.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4">
                {selectedBooking.status === "pending" && (
                  <>
                    <Button
                      variant="default"
                      onClick={() => {
                        handleConfirmBooking(selectedBooking.id);
                        setIsDetailModalOpen(false);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Xác nhận
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleCancelBooking(selectedBooking.id);
                        setIsDetailModalOpen(false);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Hủy booking
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffBookingManagement;
