import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/Shadcn/ui/breadcrumb";
import DiscountSection from "@/components/shared/DiscountSection.tsx";
import { useAuth } from "@/hooks/useAuth";
import type { BookingRequest, PaymentMethod } from "@/interfaces/booking.interface.ts";
import type { Combo } from "@/interfaces/combo.interface";
import type { Member } from "@/interfaces/member.interface.ts";
import type { Promotion } from "@/interfaces/promotion.interface.ts";
import { ROUTES } from "@/routes/route.constants.ts";
import { useCreateBooking } from "@/services/bookingService";
import { useCinemaRoom } from "@/services/cinemaRoomService";
import { transformComboResponse, useCombos } from "@/services/comboService";
import { calculateDiscount, transformPromotionsResponse, usePromotions } from "@/services/promotionService";
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
import PromotionSelection from "./components/PromotionSelection/PromotionSelection.tsx";
import SnackList from "./components/SnackList/SnackList.tsx";

// Interface for selected seat with price information from BookingPage
interface SelectedSeatWithPrice {
  id: string;
  row: string;
  number: number;
  name: string;
  type: "standard" | "vip" | "double";
  price: number;
  status: "selected";
}

// Helper function to get combo price - now uses direct price from API
const calculateComboPrice = (combo: Combo): number => {
  // Use the price directly from the combo API response
  console.log("Calculating price for combo:", combo.name, "with ID:", combo.id);
  if (combo.price && combo.price > 0) {
    return combo.price;
  }

  return 0;
};

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle payment cancellation message
  useEffect(() => {
    if (location.state?.paymentCancelled) {
      toast.error(location.state.message || "Thanh toán đã bị hủy. Vui lòng thử lại.");

      // Clear the cancellation state to avoid showing the message again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
  const { data: promotionsData, isLoading: isPromotionsLoading } = usePromotions();
  const createBookingMutation = useCreateBooking();

  // Display promotion API messages
  useEffect(() => {
    if (promotionsData?.message) {
      console.log("Promotion API message:", promotionsData.message);
      // Display warning or info message from API if needed
      if (promotionsData.message.toLowerCase().includes("warning") || promotionsData.message.toLowerCase().includes("error")) {
        toast.warning(promotionsData.message);
      }
    }
  }, [promotionsData?.message]);

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

  // Transform promotions data
  const promotions = useMemo(() => {
    if (!promotionsData?.result) return [];
    if (Array.isArray(promotionsData.result)) {
      return transformPromotionsResponse(promotionsData.result);
    } else {
      return transformPromotionsResponse([promotionsData.result]);
    }
  }, [promotionsData]);

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
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
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

  const { movie, selection, cinemaName, selectedSeats } = bookingState;

  // Get room information for calculating room fee
  const roomId = selection?.roomId ? parseInt(selection.roomId) : 0;
  const { data: roomData } = useCinemaRoom(roomId);

  // Calculate ticket cost from selected seats + room fee
  const ticketCost = useMemo(() => {
    if (!selectedSeats || selectedSeats.length === 0) return 0;

    console.log("Debug selectedSeats structure:", selectedSeats);

    // Calculate seat prices
    const seatsCost = selectedSeats.reduce((total: number, seat: SelectedSeatWithPrice) => {
      console.log("Debug seat object:", seat);
      console.log("seat.price:", seat.price);
      console.log("seat.type:", seat.type);

      // Use the price property that was added in BookingPage
      const seatPrice = seat.price || 0;
      console.log("Final seatPrice used:", seatPrice);

      return total + seatPrice;
    }, 0);

    // Add room fee
    const roomFee = roomData?.result?.fee || 0;
    const totalFee = roomFee * (selectedSeats.length || 0); // Room fee per seat

    console.log("Ticket cost calculation:", {
      selectedSeatsCount: selectedSeats.length,
      seatsCost,
      roomFee,
      seatCount: selectedSeats.length,
      totalFee,
      finalTicketCost: seatsCost + totalFee,
    });

    return seatsCost + totalFee;
  }, [selectedSeats, roomData]);

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

    const cost = calculateComboPrice(combo) * quantity;
    return total + cost;
  }, 0);

  const snackCost = Object.entries(selectedSnacks).reduce((total, [snackId, quantity]) => {
    const snack = snacks.find((s) => s.id === parseInt(snackId));
    if (!snack) return total;

    const cost = (snack.price ?? 0) * quantity;
    return total + cost;
  }, 0);

  const subtotal = ticketCost + comboCost + snackCost;
  const promotionDiscount = selectedPromotion ? calculateDiscount(selectedPromotion, subtotal) : 0;
  const totalDiscount = pointsDiscount + voucherDiscount + promotionDiscount;
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

  // Handle promotion selection
  const handlePromotionSelect = (promotion: Promotion | null) => {
    console.log("handlePromotionSelect called with:", promotion);
    setSelectedPromotion(promotion);
  };

  // Extract error message from API response
  const getErrorMessage = (error: unknown): string => {
    let errorMessage = "Đặt vé thất bại. Vui lòng thử lại!";

    if (error && typeof error === "object") {
      // Check if error has a response (axios error)
      if ("response" in error && error.response && typeof error.response === "object") {
        const response = error.response as { data?: { message?: string } };
        if (response.data?.message) {
          errorMessage = response.data.message;
        }
      }
      // Check if error has a message property
      else if ("message" in error && typeof error.message === "string") {
        errorMessage = error.message;
      }
      // Check if error has an error property with message
      else if ("error" in error && error.error && typeof error.error === "object" && "message" in error.error) {
        errorMessage = error.error.message as string;
      }
    }

    return errorMessage;
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

      if (!bookingState.selection.showtimeId) {
        toast.error("Thông tin suất chiếu không hợp lệ");
        return;
      }

      const apiRequest: BookingRequest = {
        userId: userId || currentMember?.id || "",
        showtimeId: selection?.showtimeId ? parseInt(selection.showtimeId) : 0,
        promotionId: selectedPromotion?.id || (voucherCode ? 1 : undefined),
        loyaltyPointsUsed: usePoints > 0 ? usePoints : undefined,
        paymentMethod: paymentMethod,
        staffId: undefined,
        totalPrice: finalTotalCost,
        estimatedPrice: finalTotalCost,
        seatIds: bookingState.selectedSeats?.map((seat: { id: string }) => parseInt(seat.id)) || [],
        bookingCombos: Object.entries(selectedCombos)
          .filter(([comboId, quantity]) => {
            const combo = combos.find((c) => c.id === parseInt(comboId));
            return quantity > 0 && combo && combo.status === "AVAILABLE";
          })
          .map(([comboId, quantity]) => ({
            comboId: parseInt(comboId),
            quantity,
          })),
        bookingSnacks: Object.entries(selectedSnacks)
          .filter(([snackId, quantity]) => {
            const snack = snacks.find((s) => s.id === parseInt(snackId));
            return quantity > 0 && snack && snack.status === "AVAILABLE";
          })
          .map(([snackId, quantity]) => ({
            snackId: parseInt(snackId),
            quantity,
          })),
        feUrl: window.location.origin,
      };

      const bookingResponse = await createBookingMutation.mutateAsync({
        body: apiRequest,
      });

      // Save comprehensive booking data to localStorage for later use
      const bookingDataForStorage = {
        // Booking response from API
        bookingResult: bookingResponse.result,
        // Additional context data
        movieInfo: movie,
        selectionInfo: selection,
        cinemaName: cinemaName,
        selectedSeats: selectedSeats,
        selectedCombos: selectedCombos,
        selectedSnacks: selectedSnacks,
        selectedPromotion: selectedPromotion,
        paymentMethod: paymentMethod,
        costs: {
          ticketCost,
          comboCost,
          snackCost,
          subtotal,
          pointsDiscount,
          voucherDiscount,
          promotionDiscount,
          finalTotalCost,
        },
        // Timestamp for reference
        savedAt: new Date().toICTISOString(),
      };

      localStorage.setItem("bookingSuccessData", JSON.stringify(bookingDataForStorage));
      console.log("Saved booking data to localStorage:", bookingDataForStorage);

      // Only allow online payment - redirect to payment gateway
      if (bookingResponse.result?.payOsLink) {
        toast.info("Đang chuyển hướng đến trang thanh toán...");
        console.log("Redirecting to payment with booking ID:", bookingResponse.result?.id);
        window.location.href = bookingResponse.result.payOsLink;
      } else {
        throw new Error("Không thể tạo liên kết thanh toán. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error(getErrorMessage(error));
      navigate(ROUTES.BOOKING);
    } finally {
      setIsCreatingBooking(false);
    }
  };

  // Prepare detailed combo and snack data for BookingSummary
  const selectedCombosDetails = Object.entries(selectedCombos)
    .filter(([, quantity]) => quantity > 0)
    .map(([comboId, quantity]) => {
      const combo = combos.find((c) => c.id === parseInt(comboId));
      return combo
        ? {
            id: combo.id,
            name: combo.name,
            price: combo.price,
            quantity,
          }
        : null;
    })
    .filter(Boolean) as Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;

  const selectedSnacksDetails = Object.entries(selectedSnacks)
    .filter(([, quantity]) => quantity > 0)
    .map(([snackId, quantity]) => {
      const snack = snacks.find((s) => s.id === parseInt(snackId));
      return snack
        ? {
            id: snack.id,
            name: snack.name,
            price: snack.price,
            quantity,
          }
        : null;
    })
    .filter(Boolean) as Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;

  if (!movie) {
    // Xử lý khi không có dữ liệu
    return (
      <div>
        <div className="p-10 text-center">
          Lỗi dữ liệu, vui lòng{" "}
          <Link to="/" className="text-blue-500">
            quay lại trang chủ
          </Link>
          .
        </div>
      </div>
    );
  }

  // Show loading while fetching user data
  if (isUserLoading) {
    return (
      <div>
        <div className="p-10 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  // Use only API combos - remove mock combos fallback
  const uiCombos = combos;

  return (
    <div>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-8">
        {" "}
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Trang chủ</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/booking">Chọn ghế</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                Thanh toán
                {bookingState.movie?.title && <span className="text-muted-foreground ml-2">- {bookingState.movie.title}</span>}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {" "}
          {/* Cột trái: Thông tin và lựa chọn */}
          <div className="space-y-8 rounded-lg bg-white p-6 shadow-md lg:col-span-2">
            <PaymentInfo user={currentUser} selectedSeats={selectedSeats} roomFee={roomData?.result?.fee || 0} />{" "}
            <ComboList combos={uiCombos} selectedCombos={selectedCombos} onQuantityChange={handleQuantityChange} />
            <SnackList snacks={snacks} selectedSnacks={selectedSnacks} onQuantityChange={handleSnackQuantityChange} />
            {/* Promotion Selection */}
            <PromotionSelection
              promotions={promotions}
              selectedPromotion={selectedPromotion}
              onPromotionSelect={handlePromotionSelect}
              orderAmount={subtotal}
              loading={isPromotionsLoading}
              disabled={!selectedSeats || selectedSeats.length === 0}
            />
            {/* Discount Section */}
            <DiscountSection
              mode="auto"
              currentUser={
                userDetails?.result
                  ? {
                      id: userDetails.result.id || "",
                      full_name: userDetails.result.fullName || "",
                      phone: userDetails.result.phone || "",
                      email: userDetails.result.email || "",
                      loyalty_point: userDetails.result.loyaltyPoint,
                    }
                  : null
              }
              orderAmount={subtotal}
              movieId={bookingState.movie?.id?.toString()}
              onPointsChange={handlePointsChange}
              onVoucherChange={handleVoucherChange}
              onMemberChange={handleMemberChange}
              voucherDiscount={voucherDiscount}
              promotionDiscount={promotionDiscount}
            />
            <PaymentSummary
              ticketCost={ticketCost}
              comboCost={comboCost}
              snackCost={snackCost}
              pointsDiscount={pointsDiscount}
              voucherDiscount={voucherDiscount}
              promotionDiscount={promotionDiscount}
              selectedPromotion={selectedPromotion}
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
              selectedPromotion={selectedPromotion}
              promotionDiscount={promotionDiscount}
              finalTotal={finalTotalCost}
              selectedCombos={selectedCombosDetails}
              selectedSnacks={selectedSnacksDetails}
              roomType={roomData?.result?.type}
              roomFee={roomData?.result?.fee ?? 0}
              showBackButton={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
