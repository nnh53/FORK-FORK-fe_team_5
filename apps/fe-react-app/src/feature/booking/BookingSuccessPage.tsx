import { Button } from "@/components/Shadcn/ui/button";
import UserLayout from "@/layouts/user/UserLayout";
import { transformBookingResponse, useBooking } from "@/services/bookingService";
import { useCinemaRoom } from "@/services/cinemaRoomService";
import { queryMovie } from "@/services/movieService";
import { CheckCircle } from "lucide-react";
import React, { useMemo } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

const BookingSuccessPage: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Get booking ID from URL params or location state
  const bookingId = searchParams.get("bookingId") ?? location.state?.bookingId;
  const bookingIdNumber = bookingId ? parseInt(bookingId.toString()) : null;

  // Use React Query hook to fetch booking data
  const { data: bookingData, isLoading, error } = useBooking(bookingIdNumber ?? 0);

  // Transform API response to internal format
  const booking = useMemo(() => {
    if (!bookingData?.result) {
      // Fallback to location state if available
      return location.state?.booking ?? null;
    }
    return transformBookingResponse(bookingData.result);
  }, [bookingData, location.state?.booking]);

  // Fetch additional data based on booking showtime
  const movieId = booking?.showtime?.movie_id ?? 0;
  const roomId = booking?.showtime?.room_id ?? 0;

  const { data: movieData } = queryMovie(movieId);
  const { data: cinemaRoomData } = useCinemaRoom(roomId);

  // Transform movie and cinema room data
  const movieInfo = useMemo(() => {
    if (!movieData?.result) return null;
    return {
      name: movieData.result.name ?? "N/A",
      duration: movieData.result.duration ?? 0,
    };
  }, [movieData]);

  const cinemaRoomInfo = useMemo(() => {
    if (!cinemaRoomData?.result) {
      // Fallback to roomName from showtime if available
      return {
        room_number: booking?.showtime?.cinema_room?.room_number ?? booking?.showtime?.roomName ?? (roomId ? `${roomId}` : "N/A"),
      };
    }
    return {
      room_number: cinemaRoomData.result.name ?? (roomId ? `${roomId}` : "N/A"),
    };
  }, [cinemaRoomData, booking?.showtime, roomId]);

  // Show loading state
  if (isLoading && !location.state?.booking) {
    return (
      <UserLayout>
        <div className="mx-auto max-w-2xl p-8 text-center">
          <div className="text-lg">Đang tải thông tin booking...</div>
        </div>
      </UserLayout>
    );
  }

  // Show error state
  if (error && !location.state?.booking) {
    return (
      <UserLayout>
        <div className="mx-auto max-w-2xl p-8 text-center">
          <div className="text-lg text-red-500">Không thể tải thông tin booking</div>
          <Link to="/">
            <Button className="mt-4">Về trang chủ</Button>
          </Link>
        </div>
      </UserLayout>
    );
  }

  // Show no booking found state
  if (!booking) {
    return (
      <UserLayout>
        <div className="mx-auto max-w-2xl p-8 text-center">
          <div className="text-lg text-red-500">Không tìm thấy thông tin đặt vé.</div>
          <Link to="/">
            <Button className="mt-4">Về trang chủ</Button>
          </Link>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="mx-auto max-w-4xl p-8">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          {/* Success Icon */}
          <div className="mb-8 text-center">
            <CheckCircle className="mx-auto mb-4 h-20 w-20 text-green-500" />
            <h1 className="mb-2 text-3xl font-bold text-green-600">Đặt Vé Thành Công!</h1>
            <p className="text-gray-600">Cảm ơn bạn đã đặt vé tại F-Cinema</p>
          </div>

          {/* Booking Info */}
          <div className="mb-6 rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Thông tin đặt vé</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Mã đặt vé</p>
                <p className="text-lg font-semibold">{booking.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <p className="font-semibold capitalize text-green-600">{booking.booking_status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ghế ngồi</p>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <p className="font-semibold">{booking.booking_seats?.map((bs: any) => bs.seat?.name).join(", ") ?? "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng tiền</p>
                <p className="font-semibold text-red-600">{booking.total_price?.toLocaleString("vi-VN") ?? "0"} VNĐ</p>
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
            <div className="mb-6 rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">Thông tin phim & suất chiếu</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Tên phim</p>
                  <p className="font-semibold">{movieInfo?.name ?? "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phòng chiếu</p>
                  <p className="font-semibold">Phòng {cinemaRoomInfo?.room_number ?? "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Thời gian chiếu</p>
                  <p className="font-semibold">
                    {booking.showtime.show_date_time ? new Date(booking.showtime.show_date_time).toLocaleString("vi-VN") : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Thời lượng</p>
                  <p className="font-semibold">{movieInfo?.duration ? `${movieInfo.duration} phút` : "N/A"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Customer Info */}
          <div className="mb-6 rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Thông tin khách hàng</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500">Họ và tên</p>
                <p className="font-semibold">{booking.user?.full_name ?? "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-semibold">{booking.user?.phone ?? "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{booking.user?.email ?? "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Combos and Snacks */}
          {((booking.booking_combos && booking.booking_combos.length > 0) || (booking.booking_snacks && booking.booking_snacks.length > 0)) && (
            <div className="mb-6 rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">Đồ ăn & Thức uống</h2>

              {/* Combos */}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {booking.booking_combos?.map((bookingCombo: any, index: number) => (
                <div
                  key={bookingCombo.combo?.id ? `combo-${bookingCombo.combo.id}` : `combo-idx-${index}`}
                  className="flex items-center justify-between py-2"
                >
                  <span>{bookingCombo.combo?.name ?? "Combo"}</span>
                  <span>x{bookingCombo.quantity}</span>
                  <span className="font-semibold">
                    {((bookingCombo.combo?.total_price ?? 0) * bookingCombo.quantity).toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              ))}

              {/* Individual Snacks */}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {booking.booking_snacks?.map((bookingSnack: any, index: number) => (
                <div
                  key={bookingSnack.snack?.id ? `snack-${bookingSnack.snack.id}` : `snack-idx-${index}`}
                  className="flex items-center justify-between py-2"
                >
                  <span>{bookingSnack.snack?.name ?? "Snack"}</span>
                  <span>x{bookingSnack.quantity}</span>
                  <span className="font-semibold">{((bookingSnack.snack?.price ?? 0) * bookingSnack.quantity).toLocaleString("vi-VN")} VNĐ</span>
                </div>
              ))}
            </div>
          )}

          {/* Promotion & Loyalty Info */}
          {(booking.promotion || (booking.loyalty_point_used && booking.loyalty_point_used > 0)) && (
            <div className="mb-6 rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">Khuyến mãi & Điểm thưởng</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {booking.promotion && (
                  <div>
                    <p className="text-sm text-gray-500">Khuyến mãi áp dụng</p>
                    <p className="font-semibold text-green-600">{booking.promotion.title ?? "Khuyến mãi"}</p>
                    <p className="text-sm text-gray-600">Giảm {(booking.promotion.discount_value ?? 0).toLocaleString("vi-VN")} VNĐ</p>
                  </div>
                )}
                {booking.loyalty_point_used && booking.loyalty_point_used > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Điểm thưởng sử dụng</p>
                    <p className="font-semibold text-blue-600">{(booking.loyalty_point_used ?? 0).toLocaleString("vi-VN")} điểm</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
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
          <div className="mt-8 rounded-lg bg-gray-50 p-6 text-center">
            <p className="mb-2 text-sm text-gray-500">Vui lòng lưu mã đặt vé để checkin tại rạp</p>
            <div className="inline-block rounded-lg border bg-white p-4">
              <div className="flex h-32 w-32 items-center justify-center bg-gray-200 text-gray-500">
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
