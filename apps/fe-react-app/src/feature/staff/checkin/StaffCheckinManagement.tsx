import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { QrCode, Search, Star, Ticket, User } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { bookingService, type Booking } from "../../../services/bookingService";
import { memberService, type Member } from "../../../services/memberService";

const StaffCheckinManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundMember, setFoundMember] = useState<Member | null>(null);
  const [memberBookings, setMemberBookings] = useState<Booking[]>([]);
  const [checkinDialogOpen, setCheckinDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [loading, setLoading] = useState(false);
  const searchMember = async () => {
    if (!searchTerm) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    try {
      setLoading(true);
      const member = await memberService.getMemberByPhone(searchTerm);

      if (member) {
        setFoundMember(member);

        // Fetch member's bookings
        const bookings = await bookingService.getBookingsByPhone(searchTerm);
        const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed" || booking.status === "completed");
        setMemberBookings(confirmedBookings);

        toast.success("Tìm thấy thành viên!");
      } else {
        setFoundMember(null);
        setMemberBookings([]);
        toast.error("Không tìm thấy thành viên!");
      }
    } catch (error) {
      console.error("Error searching member:", error);
      setFoundMember(null);
      setMemberBookings([]);
      toast.error("Có lỗi khi tìm kiếm thành viên");
    } finally {
      setLoading(false);
    }
  };
  const handleCheckin = async (bookingId: string) => {
    const booking = memberBookings.find((b) => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setCheckinDialogOpen(true);
    }
  };

  const handleConfirmCheckin = async () => {
    if (!selectedBooking || !foundMember) return;

    try {
      setLoading(true);

      // Calculate points earned (10% of total amount or minimum 10 points)
      const pointsToEarn = Math.max(10, Math.floor(selectedBooking.totalAmount * 0.1));

      // Calculate discount from points usage (1 point = 1000 VND)
      const pointsDiscount = pointsToUse * 1000;
      const finalAmount = selectedBooking.paymentStatus === "pending" ? Math.max(0, selectedBooking.totalAmount - pointsDiscount) : 0;

      // If booking is not paid and has remaining amount, process payment
      if (selectedBooking.paymentStatus === "pending" && finalAmount > 0) {
        // Update booking with payment info
        await bookingService.updateBooking(selectedBooking.id, {
          paymentStatus: "paid",
          totalAmount: finalAmount,
        });
      }

      // Update booking status to completed (checked-in)
      await bookingService.confirmBooking(selectedBooking.id);

      // Update member points: subtract used points and add earned points
      if (pointsToUse > 0) {
        await memberService.updateMemberPoints(foundMember.id, pointsToUse, "redeem", `Sử dụng điểm cho booking ${selectedBooking.id}`);
      }

      await memberService.updateMemberPoints(foundMember.id, pointsToEarn, "earn", `Check-in cho booking ${selectedBooking.id}`);

      // Update local state
      setMemberBookings((prev) =>
        prev.map((b) => (b.id === selectedBooking.id ? { ...b, status: "completed" as const, paymentStatus: "paid" as const } : b)),
      );

      // Update member info with new points
      const updatedMember = {
        ...foundMember,
        currentPoints: foundMember.currentPoints - pointsToUse + pointsToEarn,
      };
      setFoundMember(updatedMember);

      // Reset form
      setPointsToUse(0);
      setCheckinDialogOpen(false);
      setSelectedBooking(null);

      const message =
        pointsToUse > 0
          ? `Check-in thành công! Đã sử dụng ${pointsToUse} điểm và nhận ${pointsToEarn} điểm mới`
          : `Check-in thành công! +${pointsToEarn} điểm`;

      toast.success(message);
    } catch (error) {
      console.error("Error during check-in:", error);
      toast.error("Có lỗi khi check-in");
    } finally {
      setLoading(false);
    }
  };

  const getMembershipColor = (level: string) => {
    switch (level) {
      case "Silver":
        return "bg-gray-100 text-gray-800";
      case "Gold":
        return "bg-yellow-100 text-yellow-800";
      case "Platinum":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCheckinButtonText = (booking: Booking, loading: boolean) => {
    if (loading) return "Đang xử lý...";
    return booking.paymentStatus === "pending" ? "Check-in & Thanh toán" : "Check-in";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Check-in & Đổi điểm</h1>
      </div>

      {/* Search Member */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Tìm kiếm thành viên
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="mb-2 block">
                Số điện thoại thành viên
              </Label>
              <Input
                id="search"
                placeholder="Nhập số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchMember()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={searchMember} className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                Tìm kiếm
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member Info */}
      {foundMember && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin thành viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Họ tên</p>
                  <p className="font-semibold">{foundMember.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <p className="font-semibold">{foundMember.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{foundMember.email}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Hạng thành viên</p>
                  <Badge className={getMembershipColor(foundMember.membershipLevel)}>
                    <Star className="h-3 w-3 mr-1" />
                    {foundMember.membershipLevel}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Điểm hiện tại</p>
                  <p className="font-semibold text-green-600 text-xl">{foundMember.currentPoints} điểm</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                  <p className="font-semibold">{foundMember.totalSpent.toLocaleString("vi-VN")} VNĐ</p>
                </div>
              </div>{" "}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Check-in Dialog */}
      <Dialog open={checkinDialogOpen} onOpenChange={setCheckinDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Check-in Khách Hàng
            </DialogTitle>
          </DialogHeader>

          {selectedBooking && foundMember && (
            <div className="space-y-4">
              {/* Booking Info */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold text-sm">Thông tin booking</h4>
                <p className="text-sm text-gray-600">ID: {selectedBooking.id}</p>
                <p className="text-sm text-gray-600">Tổng tiền: {selectedBooking.totalAmount.toLocaleString()} VNĐ</p>
                <p className="text-sm text-gray-600">
                  Trạng thái thanh toán:
                  <Badge
                    className={`ml-2 ${selectedBooking.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}
                  >
                    {selectedBooking.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                  </Badge>
                </p>
              </div>

              {/* Points Usage */}
              {foundMember.currentPoints > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="points-use">Sử dụng điểm tích lũy (tùy chọn)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="points-use"
                      type="number"
                      placeholder="Nhập số điểm..."
                      value={pointsToUse || ""}
                      onChange={(e) => setPointsToUse(parseInt(e.target.value) || 0)}
                      max={Math.min(foundMember.currentPoints, Math.floor(selectedBooking.totalAmount / 1000))}
                      min={0}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPointsToUse(Math.min(foundMember.currentPoints, Math.floor(selectedBooking.totalAmount / 1000)))}
                    >
                      Max
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Có thể sử dụng tối đa: {Math.min(foundMember.currentPoints, Math.floor(selectedBooking.totalAmount / 1000)).toLocaleString()} điểm
                    (= {(Math.min(foundMember.currentPoints, Math.floor(selectedBooking.totalAmount / 1000)) * 1000).toLocaleString()} VNĐ)
                  </p>
                  {pointsToUse > 0 && <p className="text-sm text-green-600">Giảm giá: -{(pointsToUse * 1000).toLocaleString()} VNĐ</p>}
                </div>
              )}

              {/* Payment Summary */}
              {selectedBooking.paymentStatus === "pending" && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm text-blue-800">Tính toán thanh toán</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Tổng tiền:</span>
                      <span>{selectedBooking.totalAmount.toLocaleString()} VNĐ</span>
                    </div>
                    {pointsToUse > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm từ điểm:</span>
                        <span>-{(pointsToUse * 1000).toLocaleString()} VNĐ</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold border-t pt-1">
                      <span>Cần thanh toán:</span>
                      <span>{Math.max(0, selectedBooking.totalAmount - pointsToUse * 1000).toLocaleString()} VNĐ</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Points Earned */}
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-semibold text-sm text-green-800">Điểm thưởng</h4>
                <p className="text-sm text-green-600">+{Math.max(10, Math.floor(selectedBooking.totalAmount * 0.1))} điểm sau khi check-in</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={handleConfirmCheckin} className="flex-1" disabled={loading}>
                  {loading ? "Đang xử lý..." : "Xác nhận Check-in"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCheckinDialogOpen(false);
                    setPointsToUse(0);
                    setSelectedBooking(null);
                  }}
                  disabled={loading}
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bookings */}
      {memberBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Vé cần check-in
            </CardTitle>
          </CardHeader>
          <CardContent>
            {" "}
            <div className="space-y-4">
              {memberBookings.map((booking) => {
                const pointsToEarn = Math.max(10, Math.floor(booking.totalAmount * 0.1));
                return (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="font-mono">
                          {booking.id}
                        </Badge>{" "}
                        <Badge className={getBookingStatusColor(booking.status)}>
                          {booking.status === "confirmed" && "Chờ check-in"}
                          {booking.status === "completed" && "Đã check-in"}
                          {booking.status === "pending" && "Chờ xử lý"}
                          {booking.status === "cancelled" && "Đã hủy"}
                        </Badge>
                      </div>{" "}
                      <div className="text-right">
                        <p className="text-sm text-green-600">+{pointsToEarn} điểm</p>
                        <p className="text-sm text-muted-foreground">{booking.totalAmount.toLocaleString()} VNĐ</p>
                        <Badge
                          className={`text-xs ${booking.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}
                        >
                          {booking.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold">Booking #{booking.id}</h4>
                        <p className="text-sm text-muted-foreground">{new Date(booking.bookingDate).toLocaleDateString("vi-VN")}</p>
                        <p className="text-sm text-muted-foreground">
                          Movie ID: {booking.movieId} | Showtime ID: {booking.showtimeId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Phòng:</span> {booking.cinemaRoomId}
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Ghế:</span> {booking.seats.join(", ")}
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Thanh toán:</span> {booking.paymentMethod}
                        </p>
                      </div>
                    </div>{" "}
                    {booking.status === "confirmed" && (
                      <Button onClick={() => handleCheckin(booking.id)} className="w-full" disabled={loading}>
                        {getCheckinButtonText(booking, loading)}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StaffCheckinManagement;
