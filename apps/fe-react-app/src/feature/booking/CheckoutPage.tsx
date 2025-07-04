import type { BookingRequest, PaymentMethod } from "@/interfaces/booking.interface.ts";
import type { Member } from "@/interfaces/member.interface.ts";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BookingBreadcrumb from "@/components/BookingBreadcrumb.tsx";
import DiscountSection from "@/components/DiscountSection.tsx";
import UserLayout from "@/layouts/user/UserLayout.tsx";
import { bookingService } from "@/services/bookingService";
import BookingSummary from "./components/BookingSummary/BookingSummary.tsx";
import ComboList from "./components/ComboList/ComboList.tsx";
import PaymentInfo from "./components/PaymentInfo/PaymentInfo.tsx";
import PaymentMethodSelector from "./components/PaymentMethodSelector/PaymentMethodSelector.tsx";
import PaymentSummary from "./components/PaymentSummary/PaymentSummary.tsx";

// Legacy interface for UI compatibility
interface UICombo {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const mockCombos: UICombo[] = [
  {
    id: "1",
    name: "Family Combo Bắp",
    description: "02 bắp ngọt lớn + 02 nước siêu lớn",
    price: 129000,
    imageUrl: "https://www.betacinemas.vn/images/common/combo-1.png",
  },
  {
    id: "2",
    name: "Combo lon Milo",
    description: "01 lon Milo + 01 bắp ngọt lớn",
    price: 89000,
    imageUrl: "https://www.betacinemas.vn/images/common/combo-milo.png",
  },
  {
    id: "3",
    name: "Beta Combo Bắp",
    description: "01 bắp ngọt lớn + 01 nước siêu lớn",
    price: 79000,
    imageUrl: "https://www.betacinemas.vn/images/common/combo-2.png",
  },
  {
    id: "4",
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
  const [combos, setCombos] = useState<UICombo[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("BANKING");
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [usePoints, setUsePoints] = useState(0);
  const [pointsDiscount, setPointsDiscount] = useState(0);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
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
        console.log("Fetched combos from API:", combosData);
        // Convert BookingCombo to UICombo for compatibility
        const uiCombos: UICombo[] = combosData.map((combo) => ({
          id: combo.id.toString(),
          name: combo.name,
          description: combo.description,
          price: combo.total_price || 0,
          imageUrl: combo.img || "https://via.placeholder.com/100x100",
        }));
        setCombos(uiCombos);
      } catch (error) {
        console.error("Error fetching combos:", error);
        console.log("Using fallback mock combos");
        // Fallback to mock data
        setCombos(mockCombos);
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
    // Use API combos first, fallback to mock combos
    const combo = combos.find((c) => c.id === comboId) || mockCombos.find((c) => c.id === comboId);
    const cost = combo ? combo.price * quantity : 0;
    console.log(`Combo ${comboId}: ${quantity} x ${combo?.price || 0} = ${cost}`);
    return total + cost;
  }, 0);

  console.log("Total combo cost:", comboCost);
  console.log("Selected combos:", selectedCombos);
  console.log("Available combos from API:", combos);

  const subtotal = ticketCost + comboCost;
  const totalDiscount = pointsDiscount + voucherDiscount;
  const finalTotalCost = Math.max(0, subtotal - totalDiscount);

  // Handle points change
  const handlePointsChange = (points: number, discount: number) => {
    setUsePoints(points);
    setPointsDiscount(discount);
  };
  // Handle voucher change
  const handleVoucherChange = (code: string, discount: number) => {
    setVoucherCode(code);
    setVoucherDiscount(discount);
  };

  // Handle member change
  const handleMemberChange = (member: Member | null) => {
    setCurrentMember(member);
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
      const bookingData: BookingRequest = {
        user_id: currentMember?.id,
        showtime_id: 1, // Mock showtime ID - should come from bookingState
        promotion_id: voucherCode ? 1 : undefined, // Mock promotion ID
        loyalty_point_used: usePoints > 0 ? usePoints : undefined,
        payment_method: paymentMethod,
        staff_id: undefined, // For customer bookings
        seat_ids: bookingState.selectedSeats.map((seat: { id: string }) => parseInt(seat.id)), // Convert to numbers
        combos: Object.entries(selectedCombos)
          .filter(([, quantity]) => quantity > 0)
          .map(([comboId, quantity]) => ({
            combo_id: parseInt(comboId),
            quantity,
          })),
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
  const uiCombos = combos.length > 0 ? combos : mockCombos;

  return (
    <UserLayout>
      <div className="max-w-screen-2xl mx-auto p-4 md:p-8">
        {" "}
        {/* Breadcrumb */}
        <BookingBreadcrumb movieTitle={bookingState.movie?.title} className="mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {" "}
          {/* Cột trái: Thông tin và lựa chọn */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-8">
            <PaymentInfo
              user={{ id: "GUEST", full_name: "Phát Đạt", phone: "0123456789", email: "test@gmail.com", loyalty_point: 0 }}
              selectedSeats={selectedSeats}
            />{" "}
            <ComboList combos={uiCombos} selectedCombos={selectedCombos} onQuantityChange={handleQuantityChange} />
            {/* Discount Section */}
            <DiscountSection
              orderAmount={subtotal}
              movieId={bookingState.movie?.id?.toString()}
              onPointsChange={handlePointsChange}
              onVoucherChange={handleVoucherChange}
              onMemberChange={handleMemberChange}
            />
            <PaymentSummary
              ticketCost={ticketCost}
              comboCost={comboCost}
              pointsDiscount={pointsDiscount}
              voucherDiscount={voucherDiscount}
              totalCost={finalTotalCost}
            />{" "}
            <PaymentMethodSelector selectedMethod={paymentMethod} onMethodChange={(method) => setPaymentMethod(method as PaymentMethod)} />
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
          </div>{" "}
          {/* Cột phải: Tổng hợp vé */}
          <div className="lg:col-span-1">
            <BookingSummary
              movie={movie}
              selection={selection}
              cinemaName={cinemaName}
              selectedSeats={selectedSeats}
              totalCost={ticketCost}
              comboCost={comboCost}
              pointsDiscount={pointsDiscount}
              voucherDiscount={voucherDiscount}
              finalTotal={finalTotalCost}
              showBackButton={true}
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default CheckoutPage;
