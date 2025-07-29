import { Button } from "@/components/Shadcn/ui/button";
import type { ApiBooking, Booking } from "@/interfaces/booking.interface";
import { ROUTES } from "@/routes/route.constants";
import { useBooking } from "@/services/bookingService";
import { useCinemaRoom } from "@/services/cinemaRoomService";
import { queryMovie } from "@/services/movieService.ts";
import { formatVND } from "@/utils/currency.utils";
import { CheckCircle } from "lucide-react";
import React, { useEffect } from "react";
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
  isStaffBooking?: boolean;
  staffInfo?: string;
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

const transformApiBookingData = (apiData: ApiBooking): Booking => {
  return apiData;
};

// Helper function to transform localStorage booking data

const transformLocalStorageBookingData = (savedBookingData: StoredBookingData): Booking => {
  const bookingResult: ApiBooking = savedBookingData.bookingResult ?? (savedBookingData as unknown as ApiBooking);

  return bookingResult;
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
  isStaffBooking?: boolean;
  staffInfo?: string;
}

const BookingSuccessContent: React.FC<BookingSuccessContentProps> = ({ booking, movieInfo, cinemaRoomInfo, isStaffBooking, staffInfo }) => (
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
              <p className="font-semibold text-green-600 capitalize">{booking.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ghế ngồi</p>

              <p className="font-semibold">{booking.seats?.map((s) => s.name).join(", ") || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng tiền</p>
              <p className="font-semibold text-red-600">{formatVND(booking.totalPrice || 0, 0, "VNĐ")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phương thức thanh toán</p>
              <p className="font-semibold capitalize">{booking.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Thời gian đặt</p>
              <p className="font-semibold">{booking.bookingDate ? new Date(booking.bookingDate).toLocaleString("vi-VN") : "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Movie & Showtime Info */}
        {booking.showTime && (
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
                  {booking.showTime?.showDateTime ? new Date(booking.showTime.showDateTime).toLocaleString("vi-VN") : "N/A"}
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
              <p className="font-semibold">{booking.user?.fullName || "N/A"}</p>
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
        {((booking.bookingCombos && booking.bookingCombos.length > 0) || (booking.bookingSnacks && booking.bookingSnacks.length > 0)) && (
          <div className="mb-6 rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Đồ ăn & Thức uống</h2>

            {/* Combos */}

            {booking.bookingCombos?.map((bookingCombo, index) => {
              // Use combo price directly from API
              const comboPrice = bookingCombo.combo?.price || 0;
              const totalPrice = comboPrice * (bookingCombo.quantity || 1);

              return (
                <div key={`combo-${index}`} className="flex items-center justify-between py-2">
                  <span>{bookingCombo.combo?.name || "Combo"}</span>
                  <span>x{bookingCombo.quantity}</span>
                  <span className="font-semibold">{formatVND(totalPrice, 0, "VNĐ")}</span>
                </div>
              );
            })}

            {/* Individual Snacks */}

            {booking.bookingSnacks?.map((bookingSnack, index) => (
              <div key={`snack-${index}`} className="flex items-center justify-between py-2">
                <span>{bookingSnack.snack?.name || "Snack"}</span>
                <span>x{bookingSnack.quantity}</span>
                <span className="font-semibold">{formatVND((bookingSnack.snack?.price || 0) * (bookingSnack.quantity ?? 0), 0, "VNĐ")}</span>
              </div>
            ))}
          </div>
        )}

        {/* Promotion & Loyalty Info */}
        {(!!booking.promotion || (!!booking.loyaltyPointsUsed && booking.loyaltyPointsUsed > 0)) && (
          <div className="mb-6 rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Khuyến mãi & Điểm thưởng</h2>
            <div className="space-y-4">
              {!!booking.promotion && (
                <div>
                  <p className="text-sm text-gray-500">Khuyến mãi áp dụng</p>
                  <p className="font-semibold text-green-600">{booking.promotion.title || "Khuyến mãi"}</p>
                  {!!(booking.promotion.discountValue && booking.promotion.discountValue > 0) && (
                    <p className="text-sm text-gray-600">Giảm {formatVND(booking.promotion.discountValue, 0, "VNĐ")}</p>
                  )}
                </div>
              )}
              {!!(booking.loyaltyPointsUsed && booking.loyaltyPointsUsed > 0) && (
                <div>
                  <p className="text-sm text-gray-500">Điểm thưởng sử dụng</p>
                  <p className="font-semibold text-blue-600">{booking.loyaltyPointsUsed.toLocaleString("vi-VN")} điểm</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          {isStaffBooking ? (
            // Staff booking actions
            <>
              <Link to={ROUTES.STAFF.TICKET_SALES}>
                <Button className="w-full sm:w-auto">Tạo đơn mới</Button>
              </Link>
              <Link to="/staff">
                <Button variant="outline" className="w-full sm:w-auto">
                  Về trang staff
                </Button>
              </Link>
            </>
          ) : (
            // Regular customer booking actions
            <>
              <Link to="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  Về trang chủ
                </Button>
              </Link>
              <Link to="/account">
                <Button className="w-full sm:w-auto">Xem lịch sử đặt vé</Button>
              </Link>
            </>
          )}
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
  let booking: ReturnType<typeof transformApiBookingData> | null = null;
  if (bookingData?.result) {
    booking = transformApiBookingData(bookingData.result);
  } else if (savedBookingData && (isLoading || !bookingData)) {
    booking = transformLocalStorageBookingData(savedBookingData);
  }

  // Fetch additional data based on booking showtime
  const movieId = booking?.showTime?.movieId || 0;
  const roomId = booking?.showTime?.roomId || 0;

  const { data: movieData } = queryMovie(movieId);
  const { data: cinemaRoomData } = useCinemaRoom(roomId);

  // Transform movie and cinema room data with localStorage fallback
  const movieInfo = (() => {
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
  })();

  const cinemaRoomInfo = (() => {
    // Use API data first
    if (cinemaRoomData?.result) {
      return {
        room_number: cinemaRoomData.result.name || `${roomId}` || "N/A",
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
  })();

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

  return (
    <BookingSuccessContent
      booking={booking}
      movieInfo={movieInfo}
      cinemaRoomInfo={cinemaRoomInfo}
      isStaffBooking={savedBookingData?.isStaffBooking}
      staffInfo={savedBookingData?.staffInfo}
    />
  );
};

export default BookingSuccessPage;
