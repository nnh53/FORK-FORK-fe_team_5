import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/Shadcn/ui/breadcrumb";
import { transformSeatsToSeatMap, useSeatsByShowtimeId } from "@/services/bookingService.ts";
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
          status: "selected" as const,
        };
      });
  }, [seatMap, selectedSeatIds]);

  // Calculate total cost based on selected seats (using actual API pricing)
  const totalCost = useMemo(() => {
    if (!seatMap) return 0;

    const cost = seatMap.gridData
      .filter((seat) => selectedSeatIds.includes(seat.id))
      .reduce((total, seat) => {
        const price = seat.type?.price || 0;
        if (isNaN(price)) {
          console.warn("Invalid price for seat:", seat);
          return total;
        }
        return total + price;
      }, 0);

    return cost;
  }, [seatMap, selectedSeatIds]);

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
      <div>
        <div className="py-20 text-center">
          <p>Lỗi: Không có thông tin đặt vé.</p>
          <Link to="/" className="text-blue-500 hover:underline">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (!selection?.showtimeId) {
    return (
      <div>
        <div className="py-20 text-center">
          <p>Lỗi: Không có thông tin suất chiếu.</p>
          <Link to="/" className="text-blue-500 hover:underline">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (seatsLoading) {
    return (
      <div>
        <div className="py-20 text-center">
          <p>Đang tải dữ liệu ghế...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-8">
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
              <BreadcrumbPage>
                Chọn ghế
                {movie?.title && <span className="text-muted-foreground ml-2">- {movie.title}</span>}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Seat Map */}
          <div className="lg:col-span-2">
            <BookingSeatMap
              seatMap={seatMap}
              selectedSeats={selectedSeatIds}
              onSeatSelect={handleSeatSelect}
              bookedSeats={[]} // Currently using empty array - will be populated from real booking data
            />
          </div>

          {/* Right Column: Booking Summary */}
          <div className="lg:col-span-1">
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
  );
};

export default BookingPage;
