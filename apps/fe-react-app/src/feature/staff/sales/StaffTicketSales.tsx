import { Button } from "@/components/Shadcn/ui/button";
import CashPaymentDialog from "@/components/shared/CashPaymentDialog.tsx";
import { useAuth } from "@/hooks/useAuth";
import type { PaymentMethod } from "@/interfaces/booking.interface";
import type { Combo } from "@/interfaces/combo.interface";
import type { Member } from "@/interfaces/member.interface";
import type { Movie } from "@/interfaces/movies.interface";
import type { Promotion } from "@/interfaces/promotion.interface";
import type { CustomerInfo as CustomerInfoType, StaffSalesStep, UIShowtime } from "@/interfaces/staff-sales.interface";
import { ROUTES } from "@/routes/route.constants.ts";
import type { components, paths } from "@/schema-from-be";
import { transformSeatsToSeatMap, useConfirmBookingPayment, useCreateBooking } from "@/services/bookingService";
import { transformComboResponse, useCombos } from "@/services/comboService";
import { queryMovies, transformMovieResponse } from "@/services/movieService";
import { calculateDiscount, transformPromotionsResponse, usePromotions } from "@/services/promotionService";
import { transformSnacksResponse, useSnacks } from "@/services/snackService";
import { $api } from "@/utils/api";
import createFetchClient from "openapi-fetch";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { memberService } from "../../../services/memberService";
import {
  CustomerInfo,
  MovieSelection,
  OrderSummary,
  PaymentStep,
  SeatSelection,
  ShowtimeSelection,
  SnackSelection,
  StepProgress,
} from "./components";
type BookingRequest = components["schemas"]["BookingRequest"];
type BookingResponse = components["schemas"]["BookingResponse"];
type MovieResponse = components["schemas"]["MovieResponse"];
type ShowtimeResponse = components["schemas"]["ShowtimeResponse"];

// Shared fetch client to avoid re-creating on each render
const fetchClient = createFetchClient<paths>({
  baseUrl: `${import.meta.env.VITE_API_URL}/movie_theater/`,
  headers: {
    "Content-Type": "application/json",
  },
});

fetchClient.use({
  onRequest({ request }) {
    const token = localStorage.getItem("token");
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
});

// Utility function to convert API Showtime to UI Showtime format
const convertApiShowtimeToUI = (apiShowtime: ShowtimeResponse, availableSeats = 0): UIShowtime => {
  const showDateTime = new Date(apiShowtime.showDateTime ?? "");
  const endDateTime = new Date(apiShowtime.endDateTime ?? "");

  return {
    id: (apiShowtime.id ?? 0).toString(),
    movieId: apiShowtime.movieId ?? 0,
    roomId: apiShowtime.roomId ?? 0,
    roomName: apiShowtime.roomName ?? "Unknown",
    showDateTime: apiShowtime.showDateTime ?? "",
    endDateTime: apiShowtime.endDateTime ?? "",
    status: apiShowtime.status ?? "SCHEDULE",
    cinemaRoomId: apiShowtime.roomId?.toString() ?? apiShowtime.roomName ?? "Unknown",
    date: showDateTime.toLocaleDateString("vi-VN"),
    startTime: showDateTime.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    endTime: endDateTime.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    format: "2D",
    availableSeats,
    price: 100000,
  };
};

const StaffTicketSales: React.FC = () => {
  // Get current staff information from auth context
  const { user } = useAuth();
  const navigate = useNavigate();

  // Cash payment dialog state
  const [showCashPaymentDialog, setShowCashPaymentDialog] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState<BookingRequest | null>(null);

  // Use React Query to fetch movies
  const moviesQuery = queryMovies();

  // React Query hook for creating bookings
  const createBookingMutation = useCreateBooking();

  // React Query hook for confirming payment
  const confirmPaymentMutation = useConfirmBookingPayment();

  // React Query hook for showtimes (enabled only when a movie is selected)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const showtimesQuery = $api.useQuery(
    "get",
    "/showtimes/movie/{movieId}",
    { params: { path: { movieId: selectedMovieId ?? 0 } } },
    { enabled: selectedMovieId !== null },
  );

  // React Query hooks for combos and snacks
  const combosQuery = useCombos();
  const snacksQuery = useSnacks();

  // React Query hook for promotions
  const promotionsQuery = usePromotions();

  // State for data
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<UIShowtime[]>([]);

  // Transform API data to component format
  let combos: Combo[] = [];
  if (combosQuery.data?.result) {
    combos = Array.isArray(combosQuery.data.result)
      ? combosQuery.data.result.map(transformComboResponse)
      : [transformComboResponse(combosQuery.data.result)];
  }

  let snacks: ReturnType<typeof transformSnacksResponse> = [];
  if (snacksQuery.data?.result) {
    snacks = Array.isArray(snacksQuery.data.result)
      ? transformSnacksResponse(snacksQuery.data.result)
      : transformSnacksResponse([snacksQuery.data.result]);
  }

  // Transform promotions data
  let promotions: Promotion[] = [];
  if (promotionsQuery.data?.result) {
    promotions = Array.isArray(promotionsQuery.data.result)
      ? transformPromotionsResponse(promotionsQuery.data.result)
      : transformPromotionsResponse([promotionsQuery.data.result]);
  }

  // State for selection
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<UIShowtime | null>(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);

  // Update state format to match ComboSelection component expectations
  const [selectedCombos, setSelectedCombos] = useState<Array<{ combo: Combo; quantity: number }>>([]);
  const [selectedSnacks, setSelectedSnacks] = useState<Record<number, number>>({});

  // State for promotion selection
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  // Fetch seat data for the selected showtime
  const showtimeId = selectedShowtime ? parseInt(selectedShowtime.id) : 0;
  const { data: seatsData, isLoading: seatsLoading } = $api.useQuery(
    "get",
    "/seats/showtime/{showtimeId}",
    { params: { path: { showtimeId } } },
    { enabled: !!selectedShowtime },
  );

  // Transform API seat data to SeatMap format
  let seatMap: ReturnType<typeof transformSeatsToSeatMap> | null = null;
  if (seatsData?.result && selectedShowtime) {
    const seats = Array.isArray(seatsData.result) ? seatsData.result : [seatsData.result];
    const roomId = parseInt(selectedShowtime.cinemaRoomId) || 0;
    seatMap = transformSeatsToSeatMap(seats, roomId);
  }

  // State for customer info
  const [customerInfo, setCustomerInfo] = useState<CustomerInfoType>({
    name: "",
    phone: "",
    email: "",
  });
  // State for payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [usePoints, setUsePoints] = useState(0);
  const [memberPhone, setMemberPhone] = useState("");
  const [memberInfo, setMemberInfo] = useState<Member | null>(null);
  // State for UI
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<StaffSalesStep>("movie");

  useEffect(() => {
    // No longer need fetchCombos and fetchSnackItems - using React Query hooks
  }, []);

  // Transform movies data when React Query data changes
  useEffect(() => {
    if (moviesQuery.data?.result) {
      const transformedMovies = moviesQuery.data.result.map((movieResponse: MovieResponse) => transformMovieResponse(movieResponse));
      setMovies(transformedMovies);
    }
  }, [moviesQuery.data]);

  // Handle movie selection and trigger showtime fetching
  useEffect(() => {
    if (selectedMovie?.id) {
      setSelectedMovieId(selectedMovie.id);
      // Clear showtimes when selecting a new movie
      setShowtimes([]);
      setSelectedShowtime(null);
    }
  }, [selectedMovie]);

  const convertShowtime = useCallback(
    async (apiShowtime: components["schemas"]["ShowtimeResponse"]) => {
      const seatsResponse = await fetchClient.GET("/seats/showtime/{showtimeId}", {
        params: { path: { showtimeId: apiShowtime.id ?? 0 } },
      });
      const seats = Array.isArray(seatsResponse.data?.result)
        ? (seatsResponse.data.result as components["schemas"]["SeatResponse"][])
        : [];
      const availableSeats = seats.filter((seat) => seat.status === "AVAILABLE").length;
      return convertApiShowtimeToUI(apiShowtime, availableSeats);
    },
    [],
  );

  const loadShowtimes = useCallback(async () => {
    if (showtimesQuery.data?.result && selectedMovieId !== null) {
      try {
        const convertedShowtimes = await Promise.all(
          showtimesQuery.data.result.map((apiShowtime) => convertShowtime(apiShowtime)),
        );
        setShowtimes(convertedShowtimes);
      } catch (error) {
        console.error("Error converting showtimes:", error);
        toast.error("Không thể tải lịch chiếu");
      }
    } else if (showtimesQuery.isError) {
      console.error("Error fetching showtimes:", showtimesQuery.error);
      toast.error("Không thể tải lịch chiếu");
    }
  }, [convertShowtime, showtimesQuery.data, showtimesQuery.isError, showtimesQuery.error, selectedMovieId]);

  useEffect(() => {
    void loadShowtimes();
  }, [loadShowtimes]);

  useEffect(() => {
    if (selectedShowtime) {
      // No longer need manual fetchSeats - using React Query hook
    }
  }, [selectedShowtime]);

  // Helper function to calculate total seat price
  const calculateSeatPrice = () =>
    selectedSeatIds.reduce((sum, seatId) => {
      const seat = seatMap?.gridData.find((s) => s.id === seatId);
      return sum + (seat?.type?.price || 0);
    }, 0);

  // Helper function to get seat display names
  const getSeatDisplayNames = () =>
    selectedSeatIds.map((seatId) => {
      const seat = seatMap?.gridData.find((s) => s.id === seatId);
      return seat ? `${seat.row}${seat.column}` : seatId.toString();
    });

  // Handle seat selection with seat IDs
  const handleSeatSelect = (seatId: number) => {
    if (selectedSeatIds.includes(seatId)) {
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seatId));
    } else {
      setSelectedSeatIds((prev) => [...prev, seatId]);
    }
  };
  const handleComboSelect = (combo: Combo, quantity: number) => {
    setSelectedCombos((prev) => {
      const existingIndex = prev.findIndex((item) => item.combo.id === combo.id);
      if (existingIndex >= 0) {
        if (quantity <= 0) {
          // Remove combo if quantity is 0 or less
          return prev.filter((item) => item.combo.id !== combo.id);
        } else {
          // Update existing combo quantity
          return prev.map((item) => (item.combo.id === combo.id ? { ...item, quantity } : item));
        }
      } else if (quantity > 0) {
        // Add new combo
        return [...prev, { combo, quantity }];
      }
      return prev;
    });
  };

  const handleSnackQuantityChange = (snackId: number, quantity: number) => {
    setSelectedSnacks((prev) => ({
      ...prev,
      [snackId]: Math.max(0, quantity),
    }));
  };
  const searchMember = async () => {
    if (!memberPhone) {
      toast.error("Vui lòng nhập số điện thoại hoặc email");
      return;
    }

    try {
      setLoading(true);
      const member = await memberService.searchMember(memberPhone);

      if (member) {
        setMemberInfo(member);
        setCustomerInfo({
          name: member.name,
          phone: member.phone,
          email: member.email,
        });
        toast.success(`Tìm thấy hội viên: ${member.name}`);
      } else {
        setMemberInfo(null);
        toast.error("Không tìm thấy hội viên với thông tin này");
      }
    } catch (error) {
      console.error("Error searching member:", error);
      toast.error("Có lỗi khi tìm kiếm hội viên");
      setMemberInfo(null);
    } finally {
      setLoading(false);
    }
  };
  const calculateTotal = () => {
    // Calculate ticket cost from seat map using selected seat IDs
    const ticketCost = selectedSeatIds.reduce((sum, seatId) => {
      const seat = seatMap?.gridData.find((s) => s.id === seatId);
      return sum + (seat?.type?.price || 0);
    }, 0);

    // Calculate combo cost from selected combos array
    const comboCost = selectedCombos.reduce((sum, { combo, quantity }) => {
      // Calculate combo price from snacks
      const comboPrice =
        combo.snacks?.reduce((total, comboSnack) => {
          const snackPrice = comboSnack.snack?.price || 0;
          const snackQuantity = comboSnack.quantity || 1;
          return total + snackPrice * snackQuantity;
        }, 0) || 0;

      return sum + comboPrice * quantity;
    }, 0);

    // Calculate snack cost from selected snacks
    const snackCost = Object.entries(selectedSnacks).reduce((sum, [snackId, quantity]) => {
      const snack = snacks.find((s) => s.id === parseInt(snackId));
      return sum + (snack ? (snack.price ?? 0) * quantity : 0);
    }, 0);

    const subtotal = ticketCost + comboCost + snackCost;
    const pointsDiscount = usePoints * 1000; // 1 point = 1000 VND
    const promotionDiscount = selectedPromotion ? calculateDiscount(selectedPromotion, subtotal) : 0;

    return Math.max(0, subtotal - pointsDiscount - promotionDiscount);
  };

  const resetForm = () => {
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeatIds([]);
    setSelectedCombos([]);
    setSelectedSnacks({});
    setSelectedPromotion(null);
    setCustomerInfo({ name: "", phone: "", email: "" });
    setMemberPhone("");
    setMemberInfo(null);
    setUsePoints(0);
    setStep("movie");
  };

  // Helper function to validate booking requirements
  const validateBookingRequirements = () => {
    if (!selectedMovie || !selectedShowtime || selectedSeatIds.length === 0) {
      toast.error("Vui lòng chọn đầy đủ thông tin");
      return false;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      toast.error("Vui lòng nhập thông tin khách hàng");
      return false;
    }

    if (!user?.id) {
      toast.error("Không thể xác định thông tin nhân viên. Vui lòng đăng nhập lại.");
      return false;
    }

    return true;
  };

  // Helper function to create booking data
  const createBookingData = () => {
    const totalPrice = calculateTotal();
    return {
      userId: memberInfo?.id || `guest_${Date.now()}`,
      showtimeId: selectedShowtime ? parseInt(selectedShowtime.id) : 1,
      promotionId: selectedPromotion?.id,
      seatIds: selectedSeatIds,
      totalPrice,
      paymentMethod: paymentMethod,
      staffId: user?.id || "STAFF_UNKNOWN",
      estimatedPrice: totalPrice,
      loyaltyPointsUsed: usePoints > 0 ? usePoints : undefined,
      bookingCombos: selectedCombos
        .filter(({ quantity }) => quantity > 0)
        .map(({ combo, quantity }) => ({
          comboId: combo.id ?? 0,
          quantity,
        })),
      bookingSnacks: Object.entries(selectedSnacks)
        .filter(([, quantity]) => quantity > 0)
        .map(([snackId, quantity]) => ({
          snackId: parseInt(snackId.replace("SN", "")),
          quantity,
        })),
    };
  };

  // Helper function to handle online payment
  const handleOnlinePayment = async (bookingData: BookingRequest) => {
    const response = await createBookingMutation.mutateAsync({ body: bookingData });

    if (response.result) {
      const booking = response.result;

      // If member used points, update their points
      if (memberInfo && usePoints > 0) {
        try {
          await memberService.updateMemberPoints(memberInfo.id, usePoints, "redeem", `Sử dụng điểm cho booking ${booking.id}`);
        } catch (error) {
          console.error("Error updating member points:", error);
          toast.warning("Booking thành công nhưng không thể cập nhật điểm");
        }
      }

      // Save booking data to localStorage
      const bookingDataForStorage = {
        bookingResult: booking,
        movieInfo: selectedMovie,
        selectionInfo: selectedShowtime,
        cinemaName: `Phòng ${selectedShowtime?.cinemaRoomId}`,
        paymentMethod: paymentMethod,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem("bookingSuccessData", JSON.stringify(bookingDataForStorage));

      const successMessage = `Đặt vé thành công! Mã booking: ${booking.id}`;
      const staffInfo = user?.fullName ? ` - Nhân viên: ${user.fullName}` : "";
      toast.success(successMessage + staffInfo);

      // For online payment, redirect to PayOS
      if (booking.payOsLink) {
        window.location.href = booking.payOsLink;
      } else {
        navigate(ROUTES.BOOKING_SUCCESS);
      }

      resetForm();
    } else {
      throw new Error("Booking failed: No result returned");
    }
  };

  const handleCreateBooking = async () => {
    // Validate booking requirements before proceeding
    const isValid = validateBookingRequirements();
    if (!isValid) return;

    // Create booking data object
    const bookingData = createBookingData();

    // Handle different payment methods
    if (paymentMethod === "CASH") {
      // For cash payment, show dialog for staff to confirm payment
      setPendingBookingData(bookingData);
      setShowCashPaymentDialog(true);
    } else {
      // For online payment, proceed with booking creation directly
      try {
        await handleOnlinePayment(bookingData);
      } catch (error) {
        console.error("Error processing online booking:", error);
        toast.error("Đặt vé thất bại. Vui lòng thử lại!");
      }
    }
  };

  // Helper function to create booking storage data
  const createBookingStorageData = (booking: BookingResponse, receivedAmount: number, changeAmount: number) => {
    return {
      bookingResult: booking,
      movieInfo: selectedMovie,
      selectionInfo: selectedShowtime,
      cinemaName: `Phòng ${selectedShowtime?.cinemaRoomId}`,
      selectedSeats: selectedSeatIds.map((id) => {
        const seat = seatMap?.gridData.find((s) => s.id === id);
        return seat ? { id: id.toString(), name: `${seat.row}${seat.column}` } : { id: id.toString(), name: id.toString() };
      }),
      selectedCombos: selectedCombos.reduce(
        (acc, { combo, quantity }) => {
          if (combo.id !== undefined) {
            acc[combo.id] = quantity;
          }
          return acc;
        },
        {} as Record<number, number>,
      ),
      selectedSnacks: selectedSnacks,
      selectedPromotion: selectedPromotion,
      paymentMethod: "CASH",
      costs: {
        ticketCost: calculateSeatPrice(),
        comboCost: selectedCombos.reduce((sum, { combo, quantity }) => {
          const comboPrice =
            combo.snacks?.reduce((total, comboSnack) => {
              const snackPrice = comboSnack.snack?.price || 0;
              const snackQuantity = comboSnack.quantity || 1;
              return total + snackPrice * snackQuantity;
            }, 0) || 0;
          return sum + comboPrice * quantity;
        }, 0),
        snackCost: Object.entries(selectedSnacks).reduce((sum, [snackId, quantity]) => {
          const snack = snacks.find((s) => s.id === parseInt(snackId));
          return sum + (snack ? (snack.price ?? 0) * quantity : 0);
        }, 0),
        subtotal: calculateTotal() + usePoints * 1000 + (selectedPromotion ? calculateDiscount(selectedPromotion, calculateTotal()) : 0),
        pointsDiscount: usePoints * 1000,
        voucherDiscount: 0,
        promotionDiscount: selectedPromotion ? calculateDiscount(selectedPromotion, calculateTotal()) : 0,
        finalTotalCost: calculateTotal(),
      },
      cashPaymentInfo: {
        receivedAmount,
        changeAmount,
        totalAmount: calculateTotal(),
        confirmedAt: new Date().toISOString(),
      },
      savedAt: new Date().toISOString(),
    };
  };

  // Helper function to handle member points update
  const updateMemberPoints = async (bookingId: number) => {
    if (memberInfo && usePoints > 0) {
      try {
        await memberService.updateMemberPoints(memberInfo.id, usePoints, "redeem", `Sử dụng điểm cho booking ${bookingId}`);
      } catch (error) {
        console.error("Error updating member points:", error);
        toast.warning("Booking thành công nhưng không thể cập nhật điểm");
      }
    }
  };

  // Helper function to handle cash payment success
  const handleCashPaymentSuccess = (booking: BookingResponse, receivedAmount: number, changeAmount: number) => {
    const bookingDataForStorage = createBookingStorageData(booking, receivedAmount, changeAmount);
    localStorage.setItem("bookingSuccessData", JSON.stringify(bookingDataForStorage));

    const successMessage = `Thanh toán tiền mặt thành công! Mã booking: ${booking.id}`;
    const staffInfo = user?.fullName ? ` - Nhân viên: ${user.fullName}` : "";
    toast.success(successMessage + staffInfo);

    // Navigate directly to booking success page for staff bookings
    navigate(ROUTES.BOOKING_SUCCESS);

    resetForm();
  };

  // Handle cash payment confirmation
  const handleCashPaymentConfirm = async (receivedAmount: number, changeAmount: number) => {
    if (pendingBookingData) {
      console.log("Cash payment confirmed:", { receivedAmount, changeAmount, totalAmount: calculateTotal() });

      try {
        setLoading(true);

        // Step 1: Create booking first with PENDING payment status
        const response = await createBookingMutation.mutateAsync({ body: pendingBookingData });

        if (response.result) {
          const booking = response.result;

          // Ensure booking ID exists
          if (!booking.id) {
            throw new Error("Booking ID not found in response");
          }

          // Step 2: Confirm the payment using the confirm payment API
          await confirmPaymentMutation.mutateAsync({
            params: { path: { id: booking.id } },
          });

          // Step 3: Update member points if applicable
          await updateMemberPoints(booking.id);

          // Step 4: Handle success flow
          handleCashPaymentSuccess(booking, receivedAmount, changeAmount);
        } else {
          throw new Error("Booking creation failed: No result returned");
        }
      } catch (error) {
        console.error("Error processing cash payment:", error);
        toast.error("Thanh toán tiền mặt thất bại. Vui lòng thử lại!");
      } finally {
        setLoading(false);
        setShowCashPaymentDialog(false);
        setPendingBookingData(null);
      }
    }
  };

  // Handle cash payment cancellation
  const handleCashPaymentCancel = () => {
    setShowCashPaymentDialog(false);
    setPendingBookingData(null);
    setLoading(false);
  };

  // Handler functions for component communication
  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleShowtimeSelect = (showtime: UIShowtime) => {
    setSelectedShowtime(showtime);
  };

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  // Handle promotion selection
  const handlePromotionSelect = (promotion: Promotion | null) => {
    setSelectedPromotion(promotion);
  };

  const setStepTo = (newStep: StaffSalesStep) => {
    setStep(newStep);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bán Vé Trực Tiếp</h1>
          {user?.fullName && (
            <p className="mt-1 text-sm text-gray-600">
              Nhân viên: <span className="font-medium">{user.fullName}</span>
            </p>
          )}
        </div>
        <Button variant="outline" onClick={resetForm}>
          Làm mới
        </Button>
      </div>

      {/* Progress Steps */}
      <StepProgress currentStep={step} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Step 1: Movie Selection */}
          {step === "movie" && (
            <MovieSelection movies={movies} selectedMovie={selectedMovie} onMovieSelect={handleMovieSelect} onNext={() => setStepTo("showtime")} />
          )}

          {/* Step 2: Showtime Selection */}
          {step === "showtime" && selectedMovie && (
            <ShowtimeSelection
              selectedMovie={selectedMovie}
              showtimes={showtimes}
              selectedShowtime={selectedShowtime}
              onShowtimeSelect={handleShowtimeSelect}
              onBack={() => setStepTo("movie")}
              onNext={() => setStepTo("seats")}
            />
          )}

          {/* Step 3: Seat Selection */}
          {step === "seats" && selectedShowtime && (
            <SeatSelection
              selectedShowtime={selectedShowtime}
              seatMap={seatMap}
              selectedSeatIds={selectedSeatIds}
              seatsLoading={seatsLoading}
              onSeatSelect={handleSeatSelect}
              onBack={() => setStepTo("showtime")}
              onNext={() => setStepTo("snacks")}
            />
          )}

          {/* Step 4: Snacks & Beverages with Promotion Selection */}
          {step === "snacks" && (
            <SnackSelection
              combos={combos}
              snacks={snacks}
              promotions={promotions}
              selectedCombos={selectedCombos}
              selectedSnacks={selectedSnacks}
              selectedPromotion={selectedPromotion}
              combosLoading={combosQuery.isLoading}
              promotionsLoading={promotionsQuery.isLoading}
              orderAmount={(() => {
                // Calculate subtotal without promotion discount for promotion selection
                const ticketCost = selectedSeatIds.reduce((sum, seatId) => {
                  const seat = seatMap?.gridData.find((s) => s.id === seatId);
                  return sum + (seat?.type?.price || 0);
                }, 0);
                const comboCost = selectedCombos.reduce((sum, { combo, quantity }) => {
                  const comboPrice =
                    combo.snacks?.reduce((total, comboSnack) => {
                      const snackPrice = comboSnack.snack?.price || 0;
                      const snackQuantity = comboSnack.quantity || 1;
                      return total + snackPrice * snackQuantity;
                    }, 0) || 0;
                  return sum + comboPrice * quantity;
                }, 0);
                const snackCost = Object.entries(selectedSnacks).reduce((sum, [snackId, quantity]) => {
                  const snack = snacks.find((s) => s.id === parseInt(snackId));
                  return sum + (snack ? (snack.price ?? 0) * quantity : 0);
                }, 0);
                return ticketCost + comboCost + snackCost;
              })()}
              onComboSelect={handleComboSelect}
              onSnackQuantityChange={handleSnackQuantityChange}
              onPromotionSelect={handlePromotionSelect}
              onBack={() => setStepTo("seats")}
              onNext={() => setStepTo("customer")}
            />
          )}

          {/* Step 5: Customer Info */}
          {step === "customer" && (
            <CustomerInfo
              customerInfo={customerInfo}
              memberPhone={memberPhone}
              memberInfo={memberInfo}
              onCustomerInfoChange={handleCustomerInfoChange}
              onMemberPhoneChange={setMemberPhone}
              onSearchMember={searchMember}
              onBack={() => setStepTo("snacks")}
              onNext={() => setStepTo("payment")}
            />
          )}

          {/* Step 6: Payment */}
          {step === "payment" && (
            <PaymentStep
              selectedSeatIds={selectedSeatIds}
              selectedCombos={selectedCombos}
              selectedSnacks={selectedSnacks}
              snacks={snacks}
              memberInfo={memberInfo}
              usePoints={usePoints}
              paymentMethod={paymentMethod}
              loading={loading}
              calculateSeatPrice={calculateSeatPrice}
              calculateTotal={calculateTotal}
              onUsePointsChange={setUsePoints}
              onPaymentMethodChange={setPaymentMethod}
              onBack={() => setStepTo("customer")}
              onCreateBooking={handleCreateBooking}
            />
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <OrderSummary
            selectedMovie={selectedMovie}
            selectedShowtime={selectedShowtime}
            selectedSeatIds={selectedSeatIds}
            selectedCombos={selectedCombos}
            selectedSnacks={selectedSnacks}
            snacks={snacks}
            customerInfo={customerInfo}
            selectedPromotion={selectedPromotion}
            usePoints={usePoints}
            getSeatDisplayNames={getSeatDisplayNames}
            calculateSeatPrice={calculateSeatPrice}
            calculateTotal={calculateTotal}
          />
        </div>
      </div>

      {/* Cash Payment Dialog */}
      <CashPaymentDialog
        isOpen={showCashPaymentDialog}
        onClose={() => setShowCashPaymentDialog(false)}
        onConfirm={handleCashPaymentConfirm}
        onCancel={handleCashPaymentCancel}
        totalAmount={calculateTotal()}
      />
    </div>
  );
};

export default StaffTicketSales;
