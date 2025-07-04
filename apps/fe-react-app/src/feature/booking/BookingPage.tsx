import BookingBreadcrumb from "@/components/BookingBreadcrumb.tsx";
import type { Seat } from "@/interfaces/seat.interface";
import UserLayout from "@/layouts/user/UserLayout.tsx";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BookingSummary from "./components/BookingSummary/BookingSummary.tsx";

// Booking-specific seat interface that extends the base Seat
export interface BookingSeat extends Seat {
  bookingStatus: "available" | "taken" | "selected";
}

// Legacy seat type for backward compatibility with existing booking system
export interface LegacySeatType {
  id: string;
  row: string;
  number: number;
  type: "standard" | "vip" | "double";
  status: "available" | "taken" | "selected";
}

// ++ TẠO MỘT TYPE CHO SƠ ĐỒ GHẾ ĐỂ DỄ TÁI SỬ DỤNG
interface SeatMapData {
  rows: string[];
  seats: LegacySeatType[];
}

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get booking state from location.state or localStorage
  const initialBookingState = location.state || JSON.parse(localStorage.getItem("bookingState") || "{}");
  const { movie, selection, cinemaName } = initialBookingState;

  // Initialize selectedSeats from initialBookingState or empty array (legacy system)
  const [selectedSeats, setSelectedSeats] = useState<LegacySeatType[]>(() => {
    // Prioritize selectedSeats from initialBookingState
    return initialBookingState.selectedSeats || [];
  });

  // Save booking state to localStorage whenever selectedSeats changes
  const updateBookingState = useCallback(
    (newSelectedSeats: LegacySeatType[]) => {
      const updatedBookingState = {
        ...initialBookingState,
        selectedSeats: newSelectedSeats,
        totalCost: newSelectedSeats.reduce((total, seat) => {
          if (seat.type === "vip") return total + 90000;
          if (seat.type === "double") return total + 150000;
          return total + 75000;
        }, 0),
      };
      localStorage.setItem("bookingState", JSON.stringify(updatedBookingState));
    },
    [initialBookingState],
  );

  // Legacy seat creation functions for backward compatibility
  const createSeatsForRow = (row: string, count: number, type: LegacySeatType["type"], taken: number[] = []): LegacySeatType[] => {
    const seats: LegacySeatType[] = [];
    for (let i = 1; i <= count; i++) {
      seats.push({
        id: `${row}${i}`,
        row: row,
        number: i,
        type: type,
        status: taken.includes(i) ? "taken" : "available",
      });
    }
    return seats;
  };

  const mockSeatMap: { [key: string]: SeatMapData } = {
    P1: {
      rows: ["J", "I", "H", "G", "F", "E", "D", "C", "B", "A"],
      seats: [
        ...createSeatsForRow("J", 18, "vip", [3, 9, 13]),
        ...createSeatsForRow("I", 18, "vip", [5, 15]),
        ...createSeatsForRow("H", 18, "vip", [1, 2, 17, 18]),
        ...createSeatsForRow("G", 18, "standard", [8, 10]),
        ...createSeatsForRow("F", 18, "standard", [4]),
        ...createSeatsForRow("E", 18, "standard", [11, 12]),
        ...createSeatsForRow("D", 18, "standard", [7]),
        ...createSeatsForRow("C", 18, "standard", [6, 14]),
        ...createSeatsForRow("B", 16, "standard", [3, 12]),
        ...createSeatsForRow("A", 6, "double", [3]),
      ],
    },
  };

  // Function to get seat CSS classes
  const getSeatClassName = (seat: LegacySeatType, isSelected: boolean) => {
    if (seat.status === "taken") {
      return "bg-gray-400 text-white cursor-not-allowed";
    }
    if (isSelected) {
      return "bg-green-500 text-white border-green-600";
    }
    if (seat.type === "vip") {
      return "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200";
    }
    if (seat.type === "double") {
      return "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200";
    }
    return "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200";
  };

  // Ensure localStorage is updated when component mounts or data changes
  useEffect(() => {
    if (movie && selection && cinemaName) {
      const currentBookingState = {
        movie,
        selection,
        cinemaName,
        selectedSeats,
        totalCost: selectedSeats.reduce((total, seat) => {
          if (seat.type === "vip") return total + 90000;
          if (seat.type === "double") return total + 150000;
          return total + 75000;
        }, 0),
      };
      localStorage.setItem("bookingState", JSON.stringify(currentBookingState));
    }
  }, [movie, selection, cinemaName, selectedSeats]);

  if (!movie) {
    return (
      <UserLayout>
        <div className="py-20 text-center">
          <p>Lỗi: Không có thông tin đặt vé.</p>
          <Link to="/" className="text-blue-500 hover:underline">
            Quay về trang chủ
          </Link>
        </div>
      </UserLayout>
    );
  }
  const handleSeatSelect = (seat: LegacySeatType) => {
    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.id === seat.id);
      let newSelectedSeats: LegacySeatType[];

      if (isSelected) {
        newSelectedSeats = prev.filter((s) => s.id !== seat.id);
      } else {
        newSelectedSeats = [...prev, seat];
      }

      // Update localStorage whenever selectedSeats changes
      updateBookingState(newSelectedSeats);

      return newSelectedSeats;
    });
  };

  const totalCost = selectedSeats.reduce((total, seat) => {
    if (seat.type === "vip") return total + 90000;
    if (seat.type === "double") return total + 150000;
    return total + 75000;
  }, 0);

  const handleContinue = () => {
    // Calculate total cost
    const totalCost = selectedSeats.reduce((total, seat) => {
      if (seat.type === "vip") return total + 90000;
      if (seat.type === "double") return total + 150000;
      return total + 75000;
    }, 0);

    // Get the latest booking state from localStorage
    const latestBookingState = JSON.parse(localStorage.getItem("bookingState") || "{}");

    // Ensure we have the latest selectedSeats and totalCost
    const finalBookingState = {
      ...latestBookingState,
      selectedSeats: selectedSeats,
      totalCost,
    };

    // Update localStorage with final state
    localStorage.setItem("bookingState", JSON.stringify(finalBookingState));

    navigate("/checkout", { state: finalBookingState });
  };
  return (
    <UserLayout>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-8">
        {/* Breadcrumb */}
        <BookingBreadcrumb movieTitle={movie?.title} className="mb-6" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cột trái: Sơ đồ ghế */}
          <div className="rounded-lg bg-white p-6 shadow-md lg:col-span-2">
            <h2 className="mb-4 text-xl font-bold">Chọn ghế</h2>
            <div className="mb-4">
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border border-blue-300 bg-blue-100"></div>
                  <span>Ghế thường</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border border-yellow-300 bg-yellow-100"></div>
                  <span>Ghế VIP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border border-purple-300 bg-purple-100"></div>
                  <span>Ghế đôi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-gray-400"></div>
                  <span>Đã đặt</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-green-500"></div>
                  <span>Đã chọn</span>
                </div>
              </div>
            </div>

            {/* Screen */}
            <div className="mb-6">
              <div className="rounded-t-2xl bg-gray-200 py-2 text-center font-medium text-gray-600">MÀN HÌNH</div>
            </div>

            {/* Seat Grid */}
            <div className="space-y-2">
              {mockSeatMap.P1.rows.map((row) => (
                <div key={row} className="flex items-center justify-center gap-2">
                  <span className="w-8 text-center font-bold text-gray-600">{row}</span>
                  <div className="flex gap-1">
                    {mockSeatMap.P1.seats
                      .filter((seat) => seat.row === row)
                      .map((seat) => {
                        const isSelected = selectedSeats.some((s) => s.id === seat.id);
                        return (
                          <button
                            key={seat.id}
                            className={`h-8 w-8 rounded border-2 text-xs font-medium transition-colors ${getSeatClassName(seat, isSelected)}`}
                            disabled={seat.status === "taken"}
                            onClick={() => handleSeatSelect(seat)}
                          >
                            {seat.number}
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột phải: Thông tin */}
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
    </UserLayout>
  );
};

export default BookingPage;
