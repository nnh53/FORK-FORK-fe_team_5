import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BookingBreadcrumb from "../../../components/booking/BookingBreadcrumb.tsx";
import UserLayout from "../../../layouts/userLayout/UserLayout";
import { bookingService, type BookingCreateRequest, type Combo } from "../../../services/bookingService";
import BookingSummary from "../components/BookingSummary/BookingSummary.tsx";

import ComboList from "../components/ComboList/ComboList.tsx";
import PaymentInfo from "../components/PaymentInfo/PaymentInfo.tsx";
import PaymentMethodSelector from "../components/PaymentMethodSelector/PaymentMethodSelector.tsx";
import PaymentSummary from "../components/PaymentSummary/PaymentSummary.tsx";

const mockCombos: Combo[] = [
  {
    id: "combo1",
    name: "Family Combo Bắp",
    description: "02 bắp ngọt lớn + 02 nước siêu lớn",
    price: 129000,
    imageUrl: "https://www.betacinemas.vn/images/common/combo-1.png",
  },
  {
    id: "combo2",
    name: "Combo lon Milo",
    description: "01 lon Milo + 01 bắp ngọt lớn",
    price: 89000,
    imageUrl: "https://www.betacinemas.vn/images/common/combo-milo.png",
  },
  {
    id: "combo3",
    name: "Beta Combo Bắp",
    description: "01 bắp ngọt lớn + 01 nước siêu lớn",
    price: 79000,
    imageUrl: "https://www.betacinemas.vn/images/common/combo-2.png",
  },
  {
    id: "combo4",
    name: "Sweet Combo Bắp",
    description: "01 bắp ngọt lớn + 01 KitKat + 01 nước ngọt",
    price: 95000,
    imageUrl: "https://www.betacinemas.vn/images/common/sweet-combo.png",
  },
];

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Always prioritize localStorage for consistent state
  const [bookingState, setBookingState] = useState(() => {
    const stored = localStorage.getItem("bookingState");
    if (stored) {
      return JSON.parse(stored);
    }
    return location.state || {};
  });

  const [selectedCombos, setSelectedCombos] = useState<Record<string, number>>({});
  const [combos, setCombos] = useState<Combo[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "momo" | "banking">("momo");
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [usePoints, setUsePoints] = useState(0);
  const [voucherCode, setVoucherCode] = useState("");
  // Ensure localStorage is updated if we receive new state via location
  useEffect(() => {
    if (location.state) {
      localStorage.setItem("bookingState", JSON.stringify(location.state));
      setBookingState(location.state);
    }
  }, [location.state]);

  // Fetch combos from API
  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const combosData = await bookingService.getCombos();
        setCombos(combosData);
      } catch (error) {
        console.error("Error fetching combos:", error);
        // Fallback to mock data
        setCombos(
          mockCombos.map((combo) => ({
            id: combo.id,
            name: combo.name,
            description: combo.description,
            price: combo.price,
            imageUrl: combo.imageUrl,
          })),
        );
        setUsePoints(100);
        setVoucherCode("");
      }
    };

    fetchCombos();
  }, []);

  const { movie, selection, cinemaName, selectedSeats, totalCost: ticketCost } = bookingState;
  // State quản lý số lượng combo đã chọn

  const handleQuantityChange = (comboId: string, quantity: number) => {
    setSelectedCombos((prev) => ({
      ...prev,
      [comboId]: quantity,
    }));
  };

  const comboCost = Object.entries(selectedCombos).reduce((total, [comboId, quantity]) => {
    const combo = mockCombos.find((c) => c.id === comboId);
    return total + (combo ? combo.price * quantity : 0);
  }, 0);

  const finalTotalCost = ticketCost + comboCost;

  const handlePayment = () => {
    alert("thành công");
  };

  const handleCreateBooking = async () => {
    try {
      setIsCreatingBooking(true);

      // Validate required data
      if (!bookingState.selectedSeats || bookingState.selectedSeats.length === 0) {
        toast.error("Vui lòng chọn ghế");
        return;
      }

      if (!bookingState.movie || !bookingState.selection) {
        toast.error("Thông tin phim hoặc suất chiếu không hợp lệ");
        return;
      }

      // Prepare booking data
      const bookingData: BookingCreateRequest = {
        movieId: bookingState.movie.id.toString(),
        showtimeId: "ST001", // Mock showtime ID
        cinemaRoomId: "ROOM001", // Mock cinema room ID
        seats: bookingState.selectedSeats.map((seat: { id: string }) => seat.id),
        customerInfo: {
          name: "Phát Đạt", // Should come from form
          phone: "0123456789",
          email: "test@gmail.com",
        },
        paymentMethod: paymentMethod,
        combos: Object.entries(selectedCombos)
          .filter(([, quantity]) => quantity > 0)
          .map(([comboId, quantity]) => ({
            id: comboId,
            quantity,
          })),
        usePoints: usePoints > 0 ? usePoints : undefined,
        voucherCode: voucherCode || undefined,
      };

      const booking = await bookingService.createBooking(bookingData);

      toast.success("Đặt vé thành công!");

      // Clear localStorage and navigate to success page
      localStorage.removeItem("bookingState");
      navigate("/booking-success", {
        state: {
          booking,
          bookingId: booking.id,
        },
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Đặt vé thất bại. Vui lòng thử lại!");
    } finally {
      setIsCreatingBooking(false);
    }
  };

  if (!movie) {
    // Xử lý khi không có dữ liệu
    return (
      <UserLayout>
        <div className="text-center p-10">
          Lỗi dữ liệu, vui lòng{" "}
          <Link to="/" className="text-blue-500">
            quay lại trang chủ
          </Link>
          .
        </div>
      </UserLayout>
    );
  }

  // Convert API combos to match UI component interface
  const uiCombos =
    combos.length > 0
      ? combos.map((combo) => ({
          id: combo.id,
          name: combo.name,
          description: combo.description,
          price: combo.price,
          imageUrl: combo.imageUrl,
        }))
      : mockCombos;

  return (
    <UserLayout background={"https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg"}>
      <div className="max-w-screen-2xl mx-auto p-4 md:p-8">
        {" "}
        {/* Breadcrumb */}
        <BookingBreadcrumb movieTitle={bookingState.movie?.title} className="mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Thông tin và lựa chọn */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-8">
            <PaymentInfo user={{ name: "Phát Đạt", phone: "0123456789", email: "test@gmail.com" }} selectedSeats={selectedSeats} />{" "}
            <ComboList combos={uiCombos} selectedCombos={selectedCombos} onQuantityChange={handleQuantityChange} />
            <PaymentSummary ticketCost={ticketCost} comboCost={comboCost} totalCost={finalTotalCost} />{" "}
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={(method) => setPaymentMethod(method as "cash" | "card" | "momo" | "banking")}
            />
            {/* Booking Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleCreateBooking}
                disabled={isCreatingBooking}
                className="w-full max-w-md bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                {isCreatingBooking ? "Đang xử lý..." : "ĐẶT VÉ NGAY"}
              </button>
            </div>
          </div>

          {/* Cột phải: Tổng hợp vé */}
          <div className="lg:col-span-1">
            <BookingSummary
              movie={movie}
              selection={selection}
              cinemaName={cinemaName}
              selectedSeats={selectedSeats}
              totalCost={ticketCost}
              actionText="THANH TOÁN" // Thay đổi văn bản nút
              onActionClick={handlePayment} // Gọi hàm thanh toán
              showBackButton={true} // Hiển thị nút Quay lại
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default CheckoutPage;
