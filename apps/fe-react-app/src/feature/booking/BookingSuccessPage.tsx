import { Button } from "@/components/Shadcn/ui/button";
import { useBooking } from "@/services/bookingService";
import { useCinemaRoom } from "@/services/cinemaRoomService";
import type {
  ApiBooking,
  Booking,
  BookingComboRelation,
  BookingSnackRelation,
  BookingSeatRelation,
} from "@/interfaces/booking.interface";
import { queryMovie } from "@/services/movieService.ts";
import { CheckCircle } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface StoredBookingData {
  bookingResult?: ApiBooking;
  movieInfo?: { id?: number; title?: string; name?: string; duration?: number };
  selectionInfo?: { showtimeId?: number; showDateTime?: string };
  selectedSeats?: Array<{ name?: string; id?: string }>;
  bookingCombos?: unknown[];
  bookingSnacks?: unknown[];
  selectedPromotion?: unknown;
  paymentMethod?: string;
  costs?: { finalTotalCost?: number };
  cinemaName?: string;
}

// Helper function to get booking ID from localStorage
const getBookingIdFromStorage = () => {
  const savedBookingData = localStorage.getItem("bookingSuccessData");
  console.log("Checking localStorage for booking data:", savedBookingData);
  if (savedBookingData) {
    try {
      const parsedData = JSON.parse(savedBookingData);
      console.log("Parsed localStorage data:", parsedData);

      // Handle both old format (direct booking result) and new format (comprehensive data)
      if (parsedData.bookingResult) {
        // New comprehensive format
        return parsedData.bookingResult.id ? String(parsedData.bookingResult.id) : null;
      } else if (parsedData.id) {
        // Old format (direct booking result)
        return String(parsedData.id);
      }
      return null;
    } catch (error) {
      console.error("Error parsing saved booking data for ID:", error);
      return null;
    }
  }
  return null;
};

// Helper function to get comprehensive booking data from localStorage
const getBookingDataFromStorage = () => {
  const savedBookingData = localStorage.getItem("bookingSuccessData");
  if (savedBookingData) {
    try {
      const parsedData = JSON.parse(savedBookingData);
      console.log("Full localStorage booking data:", parsedData);
      return parsedData;
    } catch (error) {
      console.error("Error parsing saved booking data:", error);
      return null;
    }
  }
  return null;
};

// Helper function to transform API booking data

const transformApiBookingData = (apiData: ApiBooking) => {
  return {
    id: apiData.id,
    user: {
      full_name: apiData.user?.fullName,
      phone: apiData.user?.phone,
      email: apiData.user?.email,
    },
    booking_date_time: apiData.bookingDate,
    booking_status: apiData.status,
    total_price: apiData.totalPrice,
    payment_method: apiData.paymentMethod,
    payment_status: apiData.paymentStatus,
    loyalty_point_used: apiData.loyaltyPointsUsed,
    promotion: apiData.promotion,
    showtime: {
      id: apiData.showTime?.id,
      movie_id: apiData.showTime?.movieId,
      show_date_time: apiData.showTime?.showDateTime,
      room_id: apiData.showTime?.roomId,
      cinema_room: {
        room_number: apiData.showTime?.roomName || `Room ${apiData.showTime?.roomId}`,
      },
    },
    booking_seats:
      apiData.seats?.map((seat: { name?: string; seatName?: string }) => ({
        seat: { name: seat.name || seat.seatName },
      })) || [],
    booking_combos: apiData.bookingCombos || [],
    booking_snacks: apiData.bookingSnacks || [],
  };
};

// Helper function to transform localStorage booking data

const transformLocalStorageBookingData = (savedBookingData: StoredBookingData) => {
  const bookingResult: ApiBooking =
    savedBookingData.bookingResult ?? (savedBookingData as unknown as ApiBooking);
  const movieInfo = savedBookingData.movieInfo;
  const selectionInfo = savedBookingData.selectionInfo;
  const selectedSeats = savedBookingData.selectedSeats;

  return {
    id: bookingResult.id,
    user: {
      full_name: bookingResult.user?.fullName || "N/A",
      phone: bookingResult.user?.phone || "N/A",
      email: bookingResult.user?.email || "N/A",
    },
    booking_date_time: bookingResult.bookingDate || new Date().toISOString(),
    booking_status: bookingResult.status || "CONFIRMED",
    total_price: bookingResult.totalPrice || savedBookingData.costs?.finalTotalCost || 0,
    payment_method: bookingResult.paymentMethod || savedBookingData.paymentMethod || "ONLINE",
    payment_status: bookingResult.paymentStatus || "PENDING",
    loyalty_point_used: bookingResult.loyaltyPointsUsed || 0,
    promotion: bookingResult.promotion || savedBookingData.selectedPromotion,
    showtime: {
      id: bookingResult.showTime?.id || selectionInfo?.showtimeId,
      movie_id: movieInfo?.id,
      show_date_time: bookingResult.showTime?.showDateTime || selectionInfo?.showDateTime,
      room_id: bookingResult.showTime?.roomId,
      cinema_room: {
        room_number: bookingResult.showTime?.roomName || `Room ${bookingResult.showTime?.roomId}` || "N/A",
      },
    },
    booking_seats:
      selectedSeats?.map((seat: { name?: string; id?: string }) => ({
        seat: { name: seat.name || seat.id || "N/A" },
      })) || [],
    booking_combos: bookingResult.bookingCombos || [],
    booking_snacks: bookingResult.bookingSnacks || [],
    // Add flag to indicate this is from localStorage
    _isFromLocalStorage: true,
  };
};

// Helper component for loading state
const LoadingState: React.FC<{ bookingIdNumber: number }> = ({ bookingIdNumber }) => (
  <div>
    <div className="mx-auto max-w-2xl p-8 text-center">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-red-600"></div>
      <div className="mt-4 text-lg">Đang tải thông tin booking từ server...</div>
      <p className="mt-2 text-sm text-gray-600">Booking ID: {bookingIdNumber}</p>
    </div>
  </div>
);

// Helper component for error state
const ErrorState: React.FC<{ bookingIdNumber: number }> = ({ bookingIdNumber }) => (
  <div>
    <div className="mx-auto max-w-2xl p-8 text-center">
      <div className="text-lg text-red-500">Không thể tải thông tin booking từ server</div>
      <p className="mt-2 text-sm text-gray-600">Booking ID: {bookingIdNumber}</p>
      <Link to="/">
        <Button className="mt-4">Về trang chủ</Button>
      </Link>
    </div>
  </div>
);

// Helper component for no booking ID state
const NoBookingIdState: React.FC<{ storageBookingId: string | null }> = ({ storageBookingId }) => (
  <div>
    <div className="mx-auto max-w-2xl p-8 text-center">
      <div className="text-lg text-red-500">Không tìm thấy mã booking</div>
      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <p>localStorage booking ID: {storageBookingId || "Không có"}</p>
        <p>Vui lòng thực hiện đặt vé lại</p>
      </div>
      <div className="mt-4 space-y-2">
        <Link to="/checkout">
          <Button className="w-full sm:w-auto">Đặt vé mới</Button>
        </Link>
        <Link to="/">
          <Button variant="outline" className="w-full sm:w-auto">
            Về trang chủ
          </Button>
        </Link>
      </div>
      <div className="mt-4 gap-1 rounded-lg bg-gray-100 p-4">
        <p className="mb-2 text-xs text-gray-500">Debug: Booking ID từ localStorage</p>
        <p className="mb-2 text-xs text-gray-500">Kiểm tra localStorage để lấy booking ID</p>
        <p className="text-xs text-gray-500">Đảm bảo CheckoutPage đã lưu dữ liệu đúng cách</p>
      </div>
    </div>
  </div>
);

// Helper component for no booking found state
const NoBookingFoundState: React.FC<{ bookingIdNumber: number }> = ({ bookingIdNumber }) => (
  <div>
    <div className="mx-auto max-w-2xl p-8 text-center">
      <div className="text-lg text-red-500">Không tìm thấy thông tin đặt vé</div>
      <p className="mt-2 text-sm text-gray-600">Booking ID: {bookingIdNumber}</p>
      <Link to="/">
        <Button className="mt-4">Về trang chủ</Button>
      </Link>
    </div>
  </div>
);

// Helper component for main booking success content
interface BookingSuccessContentProps {
  booking: Booking;
  movieInfo: { name: string; duration: number } | null;
  cinemaRoomInfo: { room_number: string } | null;
}

const BookingSuccessContent: React.FC<BookingSuccessContentProps> = ({
  booking,
  movieInfo,
  cinemaRoomInfo,
}) => (
  <div>
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

              <p className="font-semibold">{booking.booking_seats?.map((bs: BookingSeatRelation) => bs.seat?.name).join(", ") || "N/A"}</p>
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
          <div className="mb-6 rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Thông tin phim & suất chiếu</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Tên phim</p>
                <p className="font-semibold">{movieInfo?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phòng chiếu</p>
                <p className="font-semibold">Phòng {cinemaRoomInfo?.room_number || "N/A"}</p>
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
          <div className="mb-6 rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Đồ ăn & Thức uống</h2>

            {/* Combos */}

            {booking.booking_combos?.map((bookingCombo: BookingComboRelation, index: number) => {
              // Calculate combo price from snacks
              const comboPrice = bookingCombo.combo?.snacks?.reduce((total: number, snack: { price?: number }) => total + (snack.price || 0), 0) || 0;
              const totalPrice = comboPrice * (bookingCombo.quantity || 1);

              return (
                <div key={`combo-${index}`} className="flex items-center justify-between py-2">
                  <span>{bookingCombo.combo?.name || "Combo"}</span>
                  <span>x{bookingCombo.quantity}</span>
                  <span className="font-semibold">{totalPrice.toLocaleString("vi-VN")} VNĐ</span>
                </div>
              );
            })}

            {/* Individual Snacks */}

            {booking.booking_snacks?.map((bookingSnack: BookingSnackRelation, index: number) => (
              <div key={`snack-${index}`} className="flex items-center justify-between py-2">
                <span>{bookingSnack.snack?.name || "Snack"}</span>
                <span>x{bookingSnack.quantity}</span>
                <span className="font-semibold">{((bookingSnack.snack?.price || 0) * bookingSnack.quantity).toLocaleString("vi-VN")} VNĐ</span>
              </div>
            ))}
          </div>
        )}

        {/* Promotion & Loyalty Info */}
        {(!!booking.promotion || (!!booking.loyalty_point_used && booking.loyalty_point_used > 0)) && (
          <div className="mb-6 rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Khuyến mãi & Điểm thưởng</h2>
            <div className="space-y-4">
              {!!booking.promotion && (
                <div>
                  <p className="text-sm text-gray-500">Khuyến mãi áp dụng</p>
                  <p className="font-semibold text-green-600">{booking.promotion.title || "Khuyến mãi"}</p>
                  {!!(booking.promotion.discountValue && booking.promotion.discountValue > 0) && (
                    <p className="text-sm text-gray-600">Giảm {booking.promotion.discountValue.toLocaleString("vi-VN")} VNĐ</p>
                  )}
                </div>
              )}
              {!!(booking.loyalty_point_used && booking.loyalty_point_used > 0) && (
                <div>
                  <p className="text-sm text-gray-500">Điểm thưởng sử dụng</p>
                  <p className="font-semibold text-blue-600">{booking.loyalty_point_used.toLocaleString("vi-VN")} điểm</p>
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
          <Link to="/account">
            <Button className="w-full sm:w-auto">Xem lịch sử đặt vé</Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const BookingSuccessPage: React.FC = () => {
  // Get booking ID from localStorage only
  const storageBookingId = getBookingIdFromStorage();
  const savedBookingData = getBookingDataFromStorage();

  // Use storage booking ID as the primary source
  const bookingId = storageBookingId;
  const bookingIdNumber = bookingId ? parseInt(bookingId) : null;

  // Assume payment success if we have booking ID from localStorage
  const paymentSuccess = !!bookingId;

  console.log("BookingSuccessPage - localStorage booking ID:", storageBookingId);
  console.log("BookingSuccessPage - Final booking ID:", { bookingId, bookingIdNumber });
  console.log("BookingSuccessPage - Payment success:", paymentSuccess);

  // Use React Query hook to fetch fresh booking data using "get", "/bookings/{id}"
  const { data: bookingData, isLoading, error } = useBooking(Number(storageBookingId) || 0);

  useEffect(() => {
    // Show success message when component mounts (booking is successful)
    if (paymentSuccess) {
      toast.success("Đặt vé và thanh toán thành công!");
    } else {
      toast.success("Đặt vé thành công!");
    }
  }, [paymentSuccess]); // Depend on paymentSuccess to show appropriate message

  // Clean up localStorage when we get fresh data from API
  useEffect(() => {
    if (bookingData?.result) {
      // Remove localStorage backup since we have fresh data
      // localStorage.removeItem("bookingSuccessData");
      console.log("Fresh API data received, removed localStorage backup");
    }
  }, [bookingData?.result]);

  // Transform API response to internal format - use ONLY fresh API data, fallback to localStorage
  const booking = useMemo(() => {
    if (bookingData?.result) {
      console.log("Using fresh API data for booking:", bookingData.result);
      return transformApiBookingData(bookingData.result);
    }

    // Fallback to localStorage data while API is loading
    if (savedBookingData && (isLoading || !bookingData)) {
      console.log("Using localStorage data as fallback while API loads:", savedBookingData);
      return transformLocalStorageBookingData(savedBookingData);
    }

    return null;
  }, [bookingData, savedBookingData, isLoading]);

  // Fetch additional data based on booking showtime
  const movieId = booking?.showtime?.movie_id || 0;
  const roomId = booking?.showtime?.room_id || 0;

  const { data: movieData } = queryMovie(movieId);
  const { data: cinemaRoomData } = useCinemaRoom(roomId);

  // Transform movie and cinema room data with localStorage fallback
  const movieInfo = useMemo(() => {
    // Use API data first
    if (movieData?.result) {
      return {
        name: movieData.result.name || "N/A",
        duration: movieData.result.duration || 0,
      };
    }

    // Fallback to localStorage movie data
    if (savedBookingData?.movieInfo) {
      return {
        name: savedBookingData.movieInfo.title || savedBookingData.movieInfo.name || "N/A",
        duration: savedBookingData.movieInfo.duration || 0,
      };
    }

    return null;
  }, [movieData, savedBookingData]);

  const cinemaRoomInfo = useMemo(() => {
    // Use API data first
    if (cinemaRoomData?.result) {
      return {
        room_number: cinemaRoomData.result.name || `${roomId}` || "N/A",
      };
    }

    // Fallback to showtime room info
    if (booking?.showtime?.cinema_room?.room_number) {
      return {
        room_number: booking.showtime.cinema_room.room_number,
      };
    }

    // Fallback to localStorage cinema name
    if (savedBookingData?.cinemaName) {
      return {
        room_number: savedBookingData.cinemaName,
      };
    }

    return {
      room_number: `${roomId}` || "N/A",
    };
  }, [cinemaRoomData, booking?.showtime, roomId, savedBookingData]);

  // Show loading state - only show if we have a valid booking ID and are still loading
  if (isLoading && bookingIdNumber && !booking) {
    return <LoadingState bookingIdNumber={bookingIdNumber} />;
  }

  // Show error state - only if we have an error and no booking data
  if (error && !booking && bookingIdNumber) {
    return <ErrorState bookingIdNumber={bookingIdNumber} />;
  }

  // Show no booking ID state
  if (!bookingIdNumber) {
    return <NoBookingIdState storageBookingId={storageBookingId} />;
  }

  // Show no booking found state
  if (!booking && !isLoading) {
    return <NoBookingFoundState bookingIdNumber={bookingIdNumber} />;
  }

  // At this point, booking is guaranteed to be non-null
  if (!booking) {
    return null; // This should never happen due to the checks above
  }

  return <BookingSuccessContent booking={booking} movieInfo={movieInfo} cinemaRoomInfo={cinemaRoomInfo} />;
};

export default BookingSuccessPage;
