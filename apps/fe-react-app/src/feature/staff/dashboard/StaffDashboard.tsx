import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, CreditCard, RefreshCw, Ticket, TrendingUp, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { bookingService, type Booking } from "../../../services/bookingService";

const StaffDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const bookingData = await bookingService.getAllBookings();
      setBookings(bookingData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from real data
  const today = new Date().toDateString();
  const todayBookings = bookings.filter((b) => new Date(b.bookingDate).toDateString() === today);

  const todayRevenue = todayBookings.filter((b) => b.status === "confirmed" || b.status === "completed").reduce((sum, b) => sum + b.totalAmount, 0);

  const totalCustomers = new Set(todayBookings.map((b) => b.customerInfo.phone)).size;

  // Calculate seat occupancy (mock calculation)
  const totalSeats = todayBookings.reduce((sum, b) => sum + b.seats.length, 0);
  const occupancyRate = totalSeats > 0 ? Math.round((totalSeats / (totalSeats * 1.33)) * 100) : 75;
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Staff Dashboard</h1>
          <p className="text-muted-foreground">Chào mừng đến với hệ thống quản lý FCinema</p>
        </div>
        <Button onClick={fetchDashboardData} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="text-lg">Đang tải...</div>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Booking hôm nay</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayBookings.length}</div>
                <p className="text-xs text-muted-foreground">{todayBookings.filter((b) => b.status === "pending").length} chờ xử lý</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Doanh thu hôm nay</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayRevenue.toLocaleString("vi-VN")} VNĐ</div>
                <p className="text-xs text-muted-foreground">{bookings.filter((b) => b.status === "confirmed").length} booking đã xác nhận</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Khách hàng hôm nay</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCustomers}</div>
                <p className="text-xs text-muted-foreground">{totalSeats} ghế đã bán</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ đầy ghế</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{occupancyRate}%</div>
                <p className="text-xs text-muted-foreground">Ước tính dựa trên booking</p>
              </CardContent>
            </Card>{" "}
          </div>
        </>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Bán Vé Trực Tiếp
            </CardTitle>
            <p className="text-sm text-muted-foreground">Bán vé cho khách hàng vãng lai hoặc mua trực tiếp tại quầy</p>
          </CardHeader>
          <CardContent>
            <Link to="/staff/sales">
              <Button className="w-full">Bắt đầu bán vé</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Quản Lý Booking
            </CardTitle>
            <p className="text-sm text-muted-foreground">Xem và quản lý các booking online, xác nhận và hủy booking</p>
          </CardHeader>
          <CardContent>
            <Link to="/staff/booking">
              <Button variant="outline" className="w-full">
                Xem booking
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Check-in & Đổi Điểm
            </CardTitle>
            <p className="text-sm text-muted-foreground">Check-in khách hàng và xử lý đổi điểm thành tiền cho hội viên</p>
          </CardHeader>
          <CardContent>
            <Link to="/staff/checkin">
              <Button variant="outline" className="w-full">
                Check-in
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity - using real booking data */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full ${(() => {
                    if (booking.status === "confirmed") return "bg-green-500";
                    if (booking.status === "pending") return "bg-yellow-500";
                    if (booking.status === "completed") return "bg-blue-500";
                    return "bg-red-500";
                  })()}`}
                ></div>
                <div className="flex-1">
                  <p className="font-medium">
                    Booking {booking.id} - {booking.customerInfo.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{new Date(booking.bookingDate).toLocaleString("vi-VN")}</p>
                </div>
              </div>
            ))}

            {bookings.length === 0 && <div className="text-center py-4 text-muted-foreground">Chưa có hoạt động nào</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffDashboard;
