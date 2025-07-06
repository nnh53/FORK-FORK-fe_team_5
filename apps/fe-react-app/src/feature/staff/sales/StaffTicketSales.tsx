import { Button } from "@/components/Shadcn/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { PaymentMethod } from "@/interfaces/booking.interface";
import type { Combo } from "@/interfaces/combo.interface";
import type { Member } from "@/interfaces/member.interface";
import type { Movie } from "@/interfaces/movies.interface";
import { transformSeatsToSeatMap, useCreateBooking, useSeatsByShowtimeId } from "@/services/bookingService";
import { transformComboResponse, useCombos } from "@/services/comboService";
import { transformMovieResponse, useMovies } from "@/services/movieService";
import { useShowtimesByMovie } from "@/services/showtimeService";
import { transformSnacksResponse, useSnacks } from "@/services/snackService";
import type { BookingRequest, MovieResponse, ShowtimeResponse } from "@/type-from-be";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import type { CustomerInfo as CustomerInfoType, StaffSalesStep, UIShowtime } from "./types";

// Utility function to convert API Showtime to UI Showtime format
const convertApiShowtimeToUI = (apiShowtime: ShowtimeResponse): UIShowtime => {
  const showDateTime = new Date(apiShowtime.showDateTime ?? "");
  const endDateTime = new Date(apiShowtime.endDateTime ?? "");

  return {
    id: (apiShowtime.id ?? 0).toString(),
    movieId: apiShowtime.movieId ?? 0,
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
    format: "2D", // Default format - could be enhanced later
    availableSeats: 50, // Mock value - would need actual seat data from API
    price: 100000, // Mock value - would need actual price from API
  };
};

const StaffTicketSales: React.FC = () => {
  // Get current staff information from auth context
  const { user } = useAuth();

  // Use React Query to fetch movies
  const moviesQuery = useMovies();

  // React Query hook for creating bookings
  const createBookingMutation = useCreateBooking();

  // React Query hook for showtimes (will be enabled when selectedMovie changes)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const showtimesQuery = useShowtimesByMovie(selectedMovieId ?? 0);

  // React Query hooks for combos and snacks
  const combosQuery = useCombos();
  const snacksQuery = useSnacks();

  // State for data
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<UIShowtime[]>([]);

  // Transform API data to component format
  const combos = useMemo(() => {
    if (!combosQuery.data?.result) return [];

    if (Array.isArray(combosQuery.data.result)) {
      return combosQuery.data.result.map(transformComboResponse);
    } else {
      return [transformComboResponse(combosQuery.data.result)];
    }
  }, [combosQuery.data]);

  const snacks = useMemo(() => {
    if (!snacksQuery.data?.result) return [];

    if (Array.isArray(snacksQuery.data.result)) {
      return transformSnacksResponse(snacksQuery.data.result);
    } else {
      return transformSnacksResponse([snacksQuery.data.result]);
    }
  }, [snacksQuery.data]);

  // State for selection
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<UIShowtime | null>(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);

  // Update state format to match ComboSelection component expectations
  const [selectedCombos, setSelectedCombos] = useState<Array<{ combo: Combo; quantity: number }>>([]);
  const [selectedSnacks, setSelectedSnacks] = useState<Record<number, number>>({});

  // Fetch seat data for the selected showtime
  const showtimeId = selectedShowtime?.id ? parseInt(selectedShowtime.id) : 0;
  const { data: seatsData, isLoading: seatsLoading } = useSeatsByShowtimeId(showtimeId);

  // Transform API seat data to SeatMap format
  const seatMap = useMemo(() => {
    if (!seatsData?.result || !selectedShowtime) return null;

    const seats = Array.isArray(seatsData.result) ? seatsData.result : [seatsData.result];
    const roomId = parseInt(selectedShowtime.cinemaRoomId) || 0;
    return transformSeatsToSeatMap(seats, roomId);
  }, [seatsData, selectedShowtime]);

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

  // Handle showtimes data from React Query
  useEffect(() => {
    if (showtimesQuery.data?.result && selectedMovieId !== null) {
      try {
        const convertedShowtimes = showtimesQuery.data.result.map(convertApiShowtimeToUI);
        setShowtimes(convertedShowtimes);
      } catch (error) {
        console.error("Error converting showtimes:", error);
        toast.error("Không thể tải lịch chiếu");
      }
    } else if (showtimesQuery.isError) {
      console.error("Error fetching showtimes:", showtimesQuery.error);
      toast.error("Không thể tải lịch chiếu");
    }
  }, [showtimesQuery.data, showtimesQuery.isError, showtimesQuery.error, selectedMovieId]);

  useEffect(() => {
    if (selectedShowtime) {
      // No longer need manual fetchSeats - using React Query hook
    }
  }, [selectedShowtime]);

  // Helper function to calculate total seat price
  const calculateSeatPrice = useCallback(() => {
    return selectedSeatIds.reduce((sum, seatId) => {
      const seat = seatMap?.gridData.find((s) => s.id === seatId);
      return sum + (seat?.type?.price || 0);
    }, 0);
  }, [selectedSeatIds, seatMap]);

  // Helper function to get seat display names
  const getSeatDisplayNames = useCallback(() => {
    return selectedSeatIds.map((seatId) => {
      const seat = seatMap?.gridData.find((s) => s.id === seatId);
      return seat ? `${seat.row}${seat.column}` : seatId.toString();
    });
  }, [selectedSeatIds, seatMap]);

  // Handle seat selection with seat IDs
  const handleSeatSelect = useCallback(
    (seatId: number) => {
      if (selectedSeatIds.includes(seatId)) {
        setSelectedSeatIds((prev) => prev.filter((id) => id !== seatId));
      } else {
        setSelectedSeatIds((prev) => [...prev, seatId]);
      }
    },
    [selectedSeatIds],
  );
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
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    try {
      setLoading(true);
      const member = await memberService.getMemberByPhone(memberPhone);

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
        toast.error("Không tìm thấy hội viên với số điện thoại này");
      }
    } catch (error) {
      console.error("Error searching member:", error);
      toast.error("Có lỗi khi tìm kiếm hội viên");
      setMemberInfo(null);
    } finally {
      setLoading(false);
    }
  };
  const calculateTotal = useCallback(() => {
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
      return sum + (snack ? snack.price * quantity : 0);
    }, 0);

    const subtotal = ticketCost + comboCost + snackCost;
    const pointsDiscount = usePoints * 1000; // 1 point = 1000 VND

    return Math.max(0, subtotal - pointsDiscount);
  }, [selectedSeatIds, seatMap, selectedCombos, selectedSnacks, snacks, usePoints]);
  const handleCreateBooking = useCallback(async () => {
    if (!selectedMovie || !selectedShowtime || selectedSeatIds.length === 0) {
      toast.error("Vui lòng chọn đầy đủ thông tin");
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      toast.error("Vui lòng nhập thông tin khách hàng");
      return;
    }

    if (!user?.id) {
      toast.error("Không thể xác định thông tin nhân viên. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      setLoading(true);
      const totalPrice = calculateTotal();
      const bookingData: BookingRequest = {
        userId: memberInfo?.id || `guest_${Date.now()}`,
        showtimeId: parseInt(selectedShowtime.id) || 1,
        promotionId: undefined,
        seatIds: selectedSeatIds,
        totalPrice,
        paymentMethod: paymentMethod,
        staffId: user?.id || "STAFF_UNKNOWN", // Use current staff ID from auth context
        estimatedPrice: totalPrice,
        loyaltyPointsUsed: usePoints > 0 ? usePoints : undefined,
        bookingCombos: selectedCombos
          .filter(({ quantity }) => quantity > 0)
          .map(({ combo, quantity }) => ({
            comboId: combo.id,
            quantity,
          })),
        bookingSnacks: Object.entries(selectedSnacks)
          .filter(([, quantity]) => quantity > 0)
          .map(([snackId, quantity]) => ({
            snackId: parseInt(snackId.replace("SN", "")),
            quantity,
          })),
      };

      // Use the booking service to create the booking
      const response = await createBookingMutation.mutateAsync({ body: bookingData });

      if (response.result) {
        const booking = response.result;

        // If member used points, update their points
        if (memberInfo && usePoints > 0) {
          try {
            await memberService.updateMemberPoints(memberInfo.id, usePoints, "redeem", `Sử dụng điểm cho booking ${booking.id}`);
          } catch (error) {
            console.error("Error updating member points:", error);
            // Don't fail the booking if points update fails
            toast.warning("Booking thành công nhưng không thể cập nhật điểm");
          }
        }

        const successMessage = `Đặt vé thành công! Mã booking: ${booking.id}`;
        const staffInfo = user?.fullName ? ` - Nhân viên: ${user.fullName}` : "";
        toast.success(successMessage + staffInfo);
        resetForm();
      } else {
        throw new Error("Booking failed: No result returned");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Đặt vé thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, [
    selectedMovie,
    selectedShowtime,
    selectedSeatIds,
    customerInfo,
    memberInfo,
    usePoints,
    paymentMethod,
    selectedCombos,
    selectedSnacks,
    createBookingMutation,
    calculateTotal,
    user?.id, // Added dependency for staff ID
    user?.fullName, // Added dependency for staff name
  ]);
  const resetForm = () => {
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeatIds([]);
    setSelectedCombos([]);
    setSelectedSnacks({});
    setCustomerInfo({ name: "", phone: "", email: "" });
    setMemberPhone("");
    setMemberInfo(null);
    setUsePoints(0);
    setStep("movie");
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

          {/* Step 4: Snacks & Beverages */}
          {step === "snacks" && (
            <SnackSelection
              combos={combos}
              snacks={snacks}
              selectedCombos={selectedCombos}
              selectedSnacks={selectedSnacks}
              combosLoading={combosQuery.isLoading}
              onComboSelect={handleComboSelect}
              onSnackQuantityChange={handleSnackQuantityChange}
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
            usePoints={usePoints}
            getSeatDisplayNames={getSeatDisplayNames}
            calculateSeatPrice={calculateSeatPrice}
            calculateTotal={calculateTotal}
          />
        </div>
      </div>
    </div>
  );
};

export default StaffTicketSales;
