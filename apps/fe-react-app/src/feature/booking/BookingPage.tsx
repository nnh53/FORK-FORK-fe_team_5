import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/Shadcn/ui/breadcrumb";
import { transformSeatsToSeatMap, useSeatsByShowtimeId } from "@/services/bookingService.ts";
import { useCinemaRoom } from "@/services/cinemaRoomService";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BookingSeatMap from "./components/BookingSeatMap/BookingSeatMap.tsx";
import BookingSummary from "./components/BookingSummary/BookingSummary.tsx";

// Modern booking seat interface for the summary (adapted to match BookingSummary expectations)
interface BookingSelectedSeat {
  id: string; // BookingSummary expects string IDs
  row: string;
  number: number;
  name: string; // Display name for the seat
  type: "standard" | "vip" | "double"; // BookingSummary expects legacy types
  price: number; // Add price information from API
  status: "selected";
}

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get booking state from location.state or localStorage
  const initialBookingState = location.state || JSON.parse(localStorage.getItem("bookingState") || "{}");
  const { movie, selection, cinemaName } = initialBookingState;

  // State for selected seats (using modern seat IDs)
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>(() => {
    // Convert legacy selectedSeats to modern IDs if they exist
    if (initialBookingState.selectedSeats && Array.isArray(initialBookingState.selectedSeats)) {
      // For backward compatibility, try to extract numeric IDs from legacy seat names
      return initialBookingState.selectedSeats
        .map((seat: unknown) => {
          const seatObj = seat as Record<string, unknown>;
          if (typeof seatObj.id === "number") return seatObj.id;
          if (typeof seatObj.id === "string") return parseInt(seatObj.id);
          return null;
        })
        .filter((id: number | null) => id !== null);
    }
    return [];
  });

  // Update selectedSeatIds when returning from checkout page
  useEffect(() => {
    const currentBookingState = location.state || JSON.parse(localStorage.getItem("bookingState") || "{}");

    if (currentBookingState.selectedSeats && Array.isArray(currentBookingState.selectedSeats)) {
      const newSelectedIds = currentBookingState.selectedSeats
        .map((seat: unknown) => {
          const seatObj = seat as Record<string, unknown>;
          if (typeof seatObj.id === "number") return seatObj.id;
          if (typeof seatObj.id === "string") return parseInt(seatObj.id);
          return null;
        })
        .filter((id: number | null) => id !== null);

      setSelectedSeatIds(newSelectedIds);
    }
    // Also check if selectedSeatIds exists directly in the state
    else if (currentBookingState.selectedSeatIds && Array.isArray(currentBookingState.selectedSeatIds)) {
      setSelectedSeatIds(currentBookingState.selectedSeatIds);
    }
  }, [location.state]);

  // Fetch seat data for the showtime
  const showtimeId = selection?.showtimeId ? parseInt(selection.showtimeId) : 0;
  const roomId = selection?.roomId ? parseInt(selection.roomId) : 0;
  const { data: seatsData, isLoading: seatsLoading } = useSeatsByShowtimeId(showtimeId);

  // Get room information for calculating room fee
  const { data: roomData } = useCinemaRoom(roomId);

  // Transform API seat data to SeatMap format
  const seatMap = useMemo(() => {
    if (!seatsData?.result) return null;

    const seats = Array.isArray(seatsData.result) ? seatsData.result : [seatsData.result];
    return transformSeatsToSeatMap(seats, roomId);
  }, [seatsData, roomId]);

  // Calculate selected seats with pricing for the summary component
  const selectedSeats = useMemo((): BookingSelectedSeat[] => {
    if (!seatMap) return [];

    return seatMap.gridData
      .filter((seat) => selectedSeatIds.includes(seat.id))
      .map((seat) => {
        // Determine legacy seat type
        let legacyType: "standard" | "vip" | "double";
        if (seat.type.name === "COUPLE") {
          legacyType = "double";
        } else if (seat.type.name === "VIP") {
          legacyType = "vip";
        } else {
          legacyType = "standard";
        }

        return {
          id: seat.id.toString(), // Convert to string for BookingSummary compatibility
          row: seat.row,
          number: parseInt(seat.name.match(/\d+/)?.[0] || "0"),
          name: seat.name, // Display name for the seat
          type: legacyType,
          price: seat.type?.price || 0, // Add price information from API
          status: "selected" as const,
        };
      });
  }, [seatMap, selectedSeatIds]);

  // Calculate total cost based on selected seats (using actual API pricing + room fee)
  const totalCost = useMemo(() => {
    if (!seatMap) return 0;

    // Calculate seat prices
    const seatsCost = seatMap.gridData
      .filter((seat) => selectedSeatIds.includes(seat.id))
      .reduce((total, seat) => {
        const price = seat.type?.price || 0;
        if (isNaN(price)) {
          console.warn("Invalid price for seat:", seat);
          return total;
        }
        return total + price;
      }, 0);

    // Add room fee per seat
    const roomFee = roomData?.result?.fee || 0;
    const totalRoomFee = roomFee * selectedSeatIds.length;

    console.log("BookingPage totalCost calculation:", {
      seatsCost,
      roomFee,
      selectedSeatsCount: selectedSeatIds.length,
      totalRoomFee,
      finalTotal: seatsCost + totalRoomFee,
    });

    return seatsCost + totalRoomFee;
  }, [seatMap, selectedSeatIds, roomData]);

  // Handle seat selection
  const handleSeatSelect = useCallback((seatId: number) => {
    setSelectedSeatIds((prev) => {
      const isSelected = prev.includes(seatId);
      if (isSelected) {
        return prev.filter((id) => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  }, []);

  // Update localStorage when selected seats change
  useEffect(() => {
    const updatedBookingState = {
      ...initialBookingState,
      selectedSeats: selectedSeats,
      selectedSeatIds: selectedSeatIds,
      totalCost: totalCost,
    };
    localStorage.setItem("bookingState", JSON.stringify(updatedBookingState));
  }, [initialBookingState, selectedSeats, selectedSeatIds, totalCost]);

  // Handle continue to checkout
  const handleContinue = useCallback(() => {
    // Get the latest booking state from localStorage
    const latestBookingState = JSON.parse(localStorage.getItem("bookingState") || "{}");

    // Ensure we have the latest selectedSeats and totalCost
    const finalBookingState = {
      ...latestBookingState,
      selectedSeats: selectedSeats,
      selectedSeatIds: selectedSeatIds,
      totalCost,
    };

    // Update localStorage with final state
    localStorage.setItem("bookingState", JSON.stringify(finalBookingState));

    navigate("/checkout", { state: finalBookingState });
  }, [navigate, selectedSeats, selectedSeatIds, totalCost]);

  if (!movie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-100">
        <div className="mx-4 max-w-md rounded-2xl bg-white p-12 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">Thiếu thông tin đặt vé</h2>
          <p className="mb-6 text-gray-600">Không tìm thấy thông tin phim để đặt vé.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-white transition-all duration-200 hover:scale-105 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (!selection?.showtimeId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-100">
        <div className="mx-4 max-w-md rounded-2xl bg-white p-12 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">Thiếu thông tin suất chiếu</h2>
          <p className="mb-6 text-gray-600">Không tìm thấy thông tin về suất chiếu đã chọn.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-white transition-all duration-200 hover:scale-105 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (seatsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-100">
        <div className="mx-4 max-w-md rounded-2xl bg-white p-12 text-center shadow-2xl">
          <div className="mx-auto mb-6">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
          </div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">Đang tải dữ liệu</h2>
          <p className="text-gray-600">Vui lòng chờ trong giây lát...</p>
        </div>
      </div>
    );
  }

  // Debug movie object
  console.log("BookingPage movie object:", movie);

  return (
    <div className="relative min-h-screen">
      {/* Full Page Background with Movie Banner */}
      {(movie?.banner || movie?.posterUrl) && (
        <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${movie.banner || movie.posterUrl})` }} />
      )}
      {/* Background overlay */}
      <div
        className={`fixed inset-0 ${movie?.banner || movie?.posterUrl ? "bg-black/80" : "bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-100"}`}
      ></div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="py-2 sm:py-4 md:py-8">
          <div className="mx-auto max-w-screen-2xl px-2 sm:px-4 md:px-4">
            {/* Breadcrumb */}
            <nav className="mb-4 sm:mb-6" aria-label="Breadcrumb">
              <Breadcrumb>
                <BreadcrumbList className="text-gray-300">
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        to="/"
                        className="flex items-center rounded-md px-1 py-1 text-xs text-gray-300 transition-all duration-200 hover:bg-white/10 hover:text-white sm:px-2 sm:text-sm"
                      >
                        <svg className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                          />
                        </svg>
                        Trang chủ
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-gray-500" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs font-medium text-white sm:text-sm">
                      Chọn ghế
                      {movie?.title && <span className="ml-1 hidden text-red-300 sm:ml-2 sm:inline">- {movie.title}</span>}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </nav>

            {/* Movie Info Header */}
            <div className="mb-2 text-center">
              <h1 className="mb-2 bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-xl font-bold text-transparent drop-shadow-2xl sm:mb-4 sm:text-2xl md:text-3xl lg:text-4xl">
                {movie?.title || "Chọn ghế ngồi"}
              </h1>

              {/* Movie Details Row */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:gap-4 sm:text-sm">
                {selection?.date && (
                  <span className="rounded-full border border-white/10 bg-white/20 px-2 py-1 font-medium text-white backdrop-blur-md sm:px-4 sm:py-2">
                    <svg className="mr-1 inline h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="hidden sm:inline">{new Date(selection.date).toLocaleDateString("vi-VN")}</span>
                    <span className="sm:hidden">{new Date(selection.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}</span>
                  </span>
                )}
                {selection?.time && (
                  <span className="rounded-full border border-red-500/50 bg-red-600/90 px-2 py-1 font-medium text-white backdrop-blur-sm sm:px-4 sm:py-2">
                    <svg className="mr-1 inline h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {selection.time}
                  </span>
                )}
                {cinemaName && (
                  <span className="rounded-full border border-gray-700/50 bg-gray-800/60 px-2 py-1 font-medium text-white backdrop-blur-md sm:px-4 sm:py-2">
                    <svg className="mr-1 inline h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="hidden sm:inline">{cinemaName}</span>
                    <span className="sm:hidden">{cinemaName.length > 10 ? cinemaName.substring(0, 10) + "..." : cinemaName}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>
          <div className="mx-auto max-w-screen-2xl px-2 sm:px-4 md:px-8">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 xl:grid-cols-3">
              {/* Left Column: Seat Map */}
              <div className="xl:col-span-2">
                <div className="overflow-hidden rounded-xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-md sm:rounded-2xl">
                  <div className="p-3 sm:p-4 lg:p-6">
                    <BookingSeatMap
                      seatMap={seatMap}
                      selectedSeats={selectedSeatIds}
                      onSeatSelect={handleSeatSelect}
                      bookedSeats={[]} // Currently using empty array - will be populated from real booking data
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Booking Summary */}
              <div className="xl:col-span-1">
                <div className="sticky top-2 sm:top-4 lg:top-6">
                  <BookingSummary
                    movie={movie}
                    selection={selection}
                    cinemaName={cinemaName}
                    selectedSeats={selectedSeats}
                    totalCost={totalCost}
                    showContinueButton={true}
                    onContinueClick={handleContinue}
                    continueText="TIẾP TỤC"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
