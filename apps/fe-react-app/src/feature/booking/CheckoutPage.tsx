import BookingBreadcrumb from "@/components/BookingBreadcrumb.tsx";
import DiscountSection from "@/components/DiscountSection.tsx";
import { useAuth } from "@/hooks/useAuth";
import type { Booking, PaymentMethod } from "@/interfaces/booking.interface.ts";
import type { Member } from "@/interfaces/member.interface.ts";
import UserLayout from "@/layouts/user/UserLayout.tsx";
import { transformBookingToRequest, useCreateBooking } from "@/services/bookingService";
import { transformComboResponse, useCombos } from "@/services/comboService";
import { transformSnacksResponse, useSnacks } from "@/services/snackService";
import { useGetUserById } from "@/services/userService";
import { getUserIdFromCookie } from "@/utils/auth.utils";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BookingSummary from "./components/BookingSummary/BookingSummary.tsx";
import ComboList from "./components/ComboList/ComboList.tsx";
import PaymentInfo from "./components/PaymentInfo/PaymentInfo.tsx";
import PaymentMethodSelector from "./components/PaymentMethodSelector/PaymentMethodSelector.tsx";
import PaymentSummary from "./components/PaymentSummary/PaymentSummary.tsx";
import SnackList from "./components/SnackList/SnackList.tsx";

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Auth hooks
  const { user } = useAuth();

  // Get user ID from context or cookies
  const userId = user?.id || getUserIdFromCookie();

  // Query user details by ID
  const { data: userDetails, isLoading: isUserLoading } = useGetUserById(userId || "");

  // Create user object for PaymentInfo
  const currentUser = userDetails?.result
    ? {
        id: userDetails.result.id || userId || "GUEST",
        full_name: userDetails.result.fullName || user?.fullName || "Guest User",
        phone: userDetails.result.phone || "",
        email: userDetails.result.email || "",
        loyalty_point: 0, // Default to 0 since loyaltyPoint is not available in current User interface
      }
    : {
        id: userId || "GUEST",
        full_name: user?.fullName || "Guest User",
        phone: "",
        email: "",
        loyalty_point: 0,
      };

  // React Query hooks
  const { data: combosData } = useCombos();
  const { data: snacksData } = useSnacks();
  const createBookingMutation = useCreateBooking();

  // Transform API data to internal format - show all combos (available and unavailable)
  const combos = useMemo(() => {
    if (!combosData?.result) return [];
    if (Array.isArray(combosData.result)) {
      return combosData.result.map(transformComboResponse);
    } else {
      return [transformComboResponse(combosData.result)];
    }
    // Don't filter by status - show all combos
  }, [combosData]);

  // Transform snacks data
  const snacks = useMemo(() => {
    if (!snacksData?.result) return [];
    if (Array.isArray(snacksData.result)) {
      return transformSnacksResponse(snacksData.result);
    } else {
      // Handle single snack result
      const singleSnack = snacksData.result as {
        id?: number;
        category?: string;
        name?: string;
        size?: string;
        flavor?: string;
        price?: number;
        description?: string;
        img?: string;
        status?: string;
      };
      return [
        {
          id: Number(singleSnack.id),
          category: singleSnack.category as "DRINK" | "FOOD",
          name: String(singleSnack.name),
          size: singleSnack.size as "SMALL" | "MEDIUM" | "LARGE",
          flavor: String(singleSnack.flavor ?? ""),
          price: Number(singleSnack.price),
          description: String(singleSnack.description ?? ""),
          img: String(singleSnack.img ?? ""),
          status: singleSnack.status as "AVAILABLE" | "UNAVAILABLE",
        },
      ];
    }
  }, [snacksData]);

  // Always prioritize localStorage for consistent state
  const [bookingState, setBookingState] = useState(() => {
    const stored = localStorage.getItem("bookingState");
    if (stored) {
      return JSON.parse(stored);
    }
    return location.state || {};
  });
  const [selectedCombos, setSelectedCombos] = useState<Record<number, number>>({});
  const [selectedSnacks, setSelectedSnacks] = useState<Record<number, number>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ONLINE");
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

  const { movie, selection, cinemaName, selectedSeats, totalCost: ticketCost } = bookingState;
  // State quản lý số lượng combo đã chọn

  const handleQuantityChange = (comboId: number, quantity: number) => {
    // Find the combo to check its availability
    const combo = combos.find((c) => c.id === comboId);

    // Don't allow quantity changes for unavailable combos
    if (combo && combo.status === "UNAVAILABLE") {
      return;
    }

    setSelectedCombos((prev) => ({
      ...prev,
      [comboId]: Math.max(0, quantity), // Ensure quantity is never negative
    }));
  };

  const handleSnackQuantityChange = (snackId: number, quantity: number) => {
    // Find the snack to check its availability
    const snack = snacks.find((s) => s.id === snackId);

    // Don't allow quantity changes for unavailable snacks
    if (snack && snack.status === "UNAVAILABLE") {
      return;
    }

    setSelectedSnacks((prev) => ({
      ...prev,
      [snackId]: Math.max(0, quantity), // Ensure quantity is never negative
    }));
  };
  const comboCost = Object.entries(selectedCombos).reduce((total, [comboId, quantity]) => {
    // Only use API combos - no fallback to mock combos
    const combo = combos.find((c) => c.id === parseInt(comboId));
    if (!combo) return total;

    // Calculate combo price from snacks
    const comboPrice = combo.snacks.reduce((snackTotal, comboSnack) => snackTotal + comboSnack.snack.price * comboSnack.quantity, 0);
    const cost = comboPrice * quantity;
    console.log(`Combo ${comboId}: ${quantity} x ${comboPrice} = ${cost}`);
    return total + cost;
  }, 0);

  const snackCost = Object.entries(selectedSnacks).reduce((total, [snackId, quantity]) => {
    const snack = snacks.find((s) => s.id === parseInt(snackId));
    if (!snack) return total;

    const cost = snack.price * quantity;
    console.log(`Snack ${snackId}: ${quantity} x ${snack.price} = ${cost}`);
    return total + cost;
  }, 0);

  console.log("Total combo cost:", comboCost);
  console.log("Total snack cost:", snackCost);
  console.log("Selected combos:", selectedCombos);
  console.log("Selected snacks:", selectedSnacks);
  console.log("Available combos from API:", combos);
  console.log("Current user info:", currentUser);
  console.log("Auth user:", user);
  console.log("User details from API:", userDetails?.result);

  const subtotal = ticketCost + comboCost + snackCost;
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

      // Prepare internal booking data - simplified version for transformBookingToRequest
      const internalBookingData: Partial<Booking> = {
        user_id: userId || currentMember?.id, // Use actual user ID from auth
        showtime_id: 1, // Mock showtime ID - should come from bookingState
        promotion_id: voucherCode ? 1 : undefined,
        loyalty_point_used: usePoints > 0 ? usePoints : undefined,
        payment_method: paymentMethod,
        staff_id: undefined, // For customer bookings
        total_price: finalTotalCost,
        booking_seats: bookingState.selectedSeats?.map((seat: { id: string }, index: number) => ({
          id: index + 1, // Generate relation ID
          booking_id: 0, // Will be set by backend
          seat_id: parseInt(seat.id),
          seat: undefined, // Not needed for creation
        })),
        booking_combos: Object.entries(selectedCombos)
          .filter(([comboId, quantity]) => {
            // Only include combos with quantity > 0 and that are available
            const combo = combos.find((c) => c.id === parseInt(comboId));
            return quantity > 0 && combo && combo.status === "AVAILABLE";
          })
          .map(([comboId, quantity], index) => ({
            id: index + 1, // Generate relation ID
            booking_id: 0, // Will be set by backend
            combo_id: parseInt(comboId),
            quantity,
            combo: undefined, // Not needed for creation
          })),
        booking_snacks: Object.entries(selectedSnacks)
          .filter(([snackId, quantity]) => {
            // Only include snacks with quantity > 0 and that are available
            const snack = snacks.find((s) => s.id === parseInt(snackId));
            return quantity > 0 && snack && snack.status === "AVAILABLE";
          })
          .map(([snackId, quantity], index) => ({
            id: index + 1, // Generate relation ID
            booking_id: 0, // Will be set by backend
            snack_id: parseInt(snackId),
            quantity,
            snack: undefined, // Not needed for creation
          })),
      };

      // Transform to API request format
      const apiRequest = transformBookingToRequest(internalBookingData);

      const bookingResponse = await createBookingMutation.mutateAsync({
        body: apiRequest,
      });

      toast.success("Đặt vé thành công!");

      // Clear localStorage and navigate to success page
      localStorage.removeItem("bookingState");
      navigate("/booking-success", {
        state: {
          booking: bookingResponse.result,
          bookingId: bookingResponse.result?.id,
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
        <div className="p-10 text-center">
          Lỗi dữ liệu, vui lòng{" "}
          <Link to="/" className="text-blue-500">
            quay lại trang chủ
          </Link>
          .
        </div>
      </UserLayout>
    );
  }

  // Show loading while fetching user data
  if (isUserLoading) {
    return (
      <UserLayout>
        <div className="p-10 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin người dùng...</p>
        </div>
      </UserLayout>
    );
  }

  // Use only API combos - remove mock combos fallback
  const uiCombos = combos;

  return (
    <UserLayout>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-8">
        {" "}
        {/* Breadcrumb */}
        <BookingBreadcrumb movieTitle={bookingState.movie?.title} className="mb-6" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {" "}
          {/* Cột trái: Thông tin và lựa chọn */}
          <div className="space-y-8 rounded-lg bg-white p-6 shadow-md lg:col-span-2">
            <PaymentInfo user={currentUser} selectedSeats={selectedSeats} />{" "}
            <ComboList combos={uiCombos} selectedCombos={selectedCombos} onQuantityChange={handleQuantityChange} />
            <SnackList snacks={snacks} selectedSnacks={selectedSnacks} onQuantityChange={handleSnackQuantityChange} />
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
              snackCost={snackCost}
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
                className="w-full max-w-md rounded-lg bg-red-600 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-red-700 disabled:bg-gray-400"
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
              snackCost={snackCost}
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
