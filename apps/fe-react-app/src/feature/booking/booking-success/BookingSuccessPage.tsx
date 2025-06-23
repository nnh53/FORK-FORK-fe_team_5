import { Button } from "@/components/Shadcn/ui/button";
import type { Booking } from "@/interfaces/booking.interface";
import { CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import UserLayout from "../../../layouts/user/UserLayout";
import { bookingService } from "../../../services/bookingService";

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
        const bookingData = await bookingService.getBookingById(bookingId);
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
      <UserLayout background={"https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg"}>
        <div className="max-w-2xl mx-auto p-8 text-center">
          <div className="text-lg">Đang tải thông tin booking...</div>
        </div>
      </UserLayout>
    );
  }

  if (!booking) {
    return (
      <UserLayout background={"https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg"}>
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
    <UserLayout background={"https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg"}>
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
                <p className="font-semibold text-green-600 capitalize">{booking.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ghế ngồi</p>
                <p className="font-semibold">{booking.seats.join(", ")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng tiền</p>
                <p className="font-semibold text-red-600">{booking.totalAmount.toLocaleString("vi-VN")} VNĐ</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                <p className="font-semibold capitalize">{booking.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Thời gian đặt</p>
                <p className="font-semibold">{new Date(booking.createdAt).toLocaleString("vi-VN")}</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Thông tin khách hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Họ và tên</p>
                <p className="font-semibold">{booking.customerInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-semibold">{booking.customerInfo.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{booking.customerInfo.email}</p>
              </div>
            </div>
          </div>

          {/* Combos (if any) */}
          {booking.combos && booking.combos.length > 0 && (
            <div className="border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Combo đồ ăn</h2>
              {booking.combos.map((combo: { name: string; quantity: number; price: number }, index: number) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span>{combo.name}</span>
                  <span>x{combo.quantity}</span>
                  <span className="font-semibold">{(combo.price * combo.quantity).toLocaleString("vi-VN")} VNĐ</span>
                </div>
              ))}
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
