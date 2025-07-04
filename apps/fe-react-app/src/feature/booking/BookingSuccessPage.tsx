import { Button } from "@/components/Shadcn/ui/button";
import type { Booking } from "@/interfaces/booking.interface";
import { CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import UserLayout from "@/layouts/user/UserLayout";
import { bookingService } from "@/services/bookingService";

const BookingSuccessPage: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  // Get booking ID from URL params or location state
  const bookingId = searchParams.get("bookingId") || location.state?.bookingId;

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        // Try to get booking from location state as fallback
        if (location.state?.booking) {
          setBooking(location.state.booking);
        }
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Convert string ID to number if needed
        const id = typeof bookingId === "string" ? parseInt(bookingId) : bookingId;
        const bookingData = await bookingService.getBookingById(id);
        setBooking(bookingData);
      } catch (error) {
        console.error("Error fetching booking:", error);
        toast.error("Không thể tải thông tin booking");

        // Fallback to location state if API fails
        if (location.state?.booking) {
          setBooking(location.state.booking);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, location.state]);

  if (loading) {
    return (
      <UserLayout>
        <div className="max-w-2xl mx-auto p-8 text-center">
          <div className="text-lg">Đang tải thông tin booking...</div>
        </div>
      </UserLayout>
    );
  }

  if (!booking) {
    return (
      <UserLayout>
        <div className="max-w-2xl mx-auto p-8 text-center">
          <div className="text-red-500 text-lg">Không tìm thấy thông tin đặt vé.</div>
          <Link to="/">
            <Button className="mt-4">Về trang chủ</Button>
          </Link>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <CheckCircle className="mx-auto w-20 h-20 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-green-600 mb-2">Đặt Vé Thành Công!</h1>
            <p className="text-gray-600">Cảm ơn bạn đã đặt vé tại F-Cinema</p>
          </div>

          {/* Booking Info */}
          <div className="border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Thông tin đặt vé</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Mã đặt vé</p>
                <p className="font-semibold text-lg">{booking.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <p className="font-semibold text-green-600 capitalize">{booking.booking_status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ghế ngồi</p>
                <p className="font-semibold">{booking.booking_seats?.map((bs) => bs.seat?.name).join(", ") || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng tiền</p>
                <p className="font-semibold text-red-600">{booking.total_price?.toLocaleString("vi-VN") || "0"} VNĐ</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                <p className="font-semibold capitalize">{booking.payment_method}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Thời gian đặt</p>
                <p className="font-semibold">{booking.booking_date_time ? new Date(booking.booking_date_time).toLocaleString("vi-VN") : "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Movie & Showtime Info */}
          {booking.showtime && (
            <div className="border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Thông tin phim & suất chiếu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tên phim</p>
                  <p className="font-semibold">{booking.showtime.movie?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phòng chiếu</p>
                  <p className="font-semibold">Phòng {booking.showtime.cinema_room?.room_number || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Thời gian chiếu</p>
                  <p className="font-semibold">
                    {booking.showtime.show_date_time ? new Date(booking.showtime.show_date_time).toLocaleString("vi-VN") : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Thời lượng</p>
                  <p className="font-semibold">{booking.showtime.movie?.duration || "N/A"} phút</p>
                </div>
              </div>
            </div>
          )}

          {/* Customer Info */}
          <div className="border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Thông tin khách hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Họ và tên</p>
                <p className="font-semibold">{booking.user?.full_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-semibold">{booking.user?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{booking.user?.email || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Combos and Snacks */}
          {((booking.booking_combos && booking.booking_combos.length > 0) || (booking.booking_snacks && booking.booking_snacks.length > 0)) && (
            <div className="border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Đồ ăn & Thức uống</h2>

              {/* Combos */}
              {booking.booking_combos?.map((bookingCombo, index) => (
                <div key={`combo-${index}`} className="flex justify-between items-center py-2">
                  <span>{bookingCombo.combo?.name || "Combo"}</span>
                  <span>x{bookingCombo.quantity}</span>
                  <span className="font-semibold">
                    {((bookingCombo.combo?.total_price || 0) * bookingCombo.quantity).toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              ))}

              {/* Individual Snacks */}
              {booking.booking_snacks?.map((bookingSnack, index) => (
                <div key={`snack-${index}`} className="flex justify-between items-center py-2">
                  <span>{bookingSnack.snack?.name || "Snack"}</span>
                  <span>x{bookingSnack.quantity}</span>
                  <span className="font-semibold">{((bookingSnack.snack?.price || 0) * bookingSnack.quantity).toLocaleString("vi-VN")} VNĐ</span>
                </div>
              ))}
            </div>
          )}

          {/* Promotion & Loyalty Info */}
          {(booking.promotion || (booking.loyalty_point_used && booking.loyalty_point_used > 0)) && (
            <div className="border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Khuyến mãi & Điểm thưởng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.promotion && (
                  <div>
                    <p className="text-sm text-gray-500">Khuyến mãi áp dụng</p>
                    <p className="font-semibold text-green-600">{booking.promotion.title}</p>
                    <p className="text-sm text-gray-600">Giảm {booking.promotion.discount_value.toLocaleString("vi-VN")} VNĐ</p>
                  </div>
                )}
                {booking.loyalty_point_used && booking.loyalty_point_used > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Điểm thưởng sử dụng</p>
                    <p className="font-semibold text-blue-600">{booking.loyalty_point_used.toLocaleString("vi-VN")} điểm</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto">
                Về trang chủ
              </Button>
            </Link>
            <Link to="/my-bookings">
              <Button className="w-full sm:w-auto">Xem lịch sử đặt vé</Button>
            </Link>
          </div>

          {/* QR Code placeholder */}
          <div className="text-center mt-8 p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Vui lòng lưu mã đặt vé để checkin tại rạp</p>
            <div className="inline-block bg-white p-4 border rounded-lg">
              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500">
                QR Code
                <br />
                {booking.id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default BookingSuccessPage;
