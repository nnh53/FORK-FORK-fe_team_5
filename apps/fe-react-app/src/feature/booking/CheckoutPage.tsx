import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/Shadcn/ui/breadcrumb";
import DiscountSection from "@/components/shared/DiscountSection.tsx";
import { useAuth } from "@/hooks/useAuth";
import type { Booking, PaymentMethod } from "@/interfaces/booking.interface.ts";
import type { Member } from "@/interfaces/member.interface.ts";
import type { Promotion } from "@/interfaces/promotion.interface.ts";
import { ROUTES } from "@/routes/route.constants.ts";
import { transformBookingToRequest, useCreateBooking } from "@/services/bookingService";
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

// Helper function to calculate combo price
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const calculateComboPrice = (combo: any): number => {
  let comboPrice = 0;

  if (combo.snacks && Array.isArray(combo.snacks) && combo.snacks.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    comboPrice = combo.snacks.reduce((snackTotal: number, comboSnack: any) => {
      const snackPrice = comboSnack.snack?.price || 0;
      // Use the actual quantity from ComboSnack, or default to 1 if it's 0 or undefined
      let snackQuantity = comboSnack.quantity;

      // Fallback logic: if quantity is 0 or undefined, use default quantities based on snack type
      if (!snackQuantity || snackQuantity === 0) {
        // Default quantity is 1 for all items in combo
        snackQuantity = 1;
      }

      return snackTotal + snackPrice * snackQuantity;
    }, 0);
  }

  // Fallback: if combo price is still 0, use a reasonable default based on combo name
  if (comboPrice === 0) {
    // Estimate price based on number of snacks and their average price
    if (combo.snacks && combo.snacks.length > 0) {
      // Calculate average snack price and multiply by number of snacks
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const avgSnackPrice = combo.snacks.reduce((sum: number, cs: any) => sum + (cs.snack?.price || 0), 0) / combo.snacks.length;
      comboPrice = avgSnackPrice * combo.snacks.length;
    }

    // If still 0, use default based on combo name
    if (comboPrice === 0 && combo.name) {
      const comboNameLower = combo.name.toLowerCase();
      if (comboNameLower.includes("couple") || comboNameLower.includes("đôi")) {
        comboPrice = 120000; // Default price for couple combo
      } else if (comboNameLower.includes("family") || comboNameLower.includes("gia đình")) {
        comboPrice = 200000; // Default price for family combo
      } else if (comboNameLower.includes("sweet") || comboNameLower.includes("ngọt")) {
        comboPrice = 80000; // Default price for sweet combo
      } else {
        comboPrice = 100000; // Default combo price
      }
    }

    console.warn(`Using fallback price calculation for combo ${combo.name}: ${comboPrice} VND`);
  }

  return comboPrice;
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

    const cost = calculateComboPrice(combo) * quantity;
    return total + cost;
  }, 0);

  const snackCost = Object.entries(selectedSnacks).reduce((total, [snackId, quantity]) => {
    const snack = snacks.find((s) => s.id === parseInt(snackId));
    if (!snack) return total;

    const cost = snack.price * quantity;
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

      // Prepare internal booking data - simplified version for transformBookingToRequest
      const internalBookingData: Partial<Booking> = {
        user_id: userId || currentMember?.id, // Use actual user ID from auth
        showtime_id: selection?.showtimeId ? parseInt(selection.showtimeId) : undefined,
        promotion_id: selectedPromotion?.id || (voucherCode ? 1 : undefined),
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
        savedAt: new Date().toISOString(),
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
            <PaymentInfo user={currentUser} selectedSeats={selectedSeats} />{" "}
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
              showBackButton={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
