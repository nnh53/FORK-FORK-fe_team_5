import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BookingBreadcrumb from "../../../components/booking/BookingBreadcrumb.tsx";
import UserLayout from "../../../layouts/userLayout/UserLayout.tsx";
import BookingFooter from "../components/BookingFooter/BookingFooter.tsx";
import BookingSummary from "../components/BookingSummary/BookingSummary.tsx";
import SeatMap from "../components/SeatMap/SeatMap.tsx";

export interface SeatType {
  id: string;
  row: string;
  number: number;
  type: "standard" | "vip" | "double";
  status: "available" | "taken" | "selected";
}

// ++ TẠO MỘT TYPE CHO SƠ ĐỒ GHẾ ĐỂ DỄ TÁI SỬ DỤNG
interface SeatMapData {
  rows: string[];
  seats: SeatType[];
}

const SeatSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get booking state from location.state or localStorage
  const initialBookingState = location.state || JSON.parse(localStorage.getItem("bookingState") || "{}");
  const { movie, selection, cinemaName } = initialBookingState;

  // Initialize selectedSeats from initialBookingState or empty array
  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>(() => {
    // Prioritize selectedSeats from initialBookingState
    return initialBookingState.selectedSeats || [];
  });
  // Save booking state to localStorage whenever selectedSeats changes
  const updateBookingState = useCallback(
    (newSelectedSeats: SeatType[]) => {
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

  const createSeatsForRow = (row: string, count: number, type: SeatType["type"], taken: number[] = []): SeatType[] => {
    const seats: SeatType[] = [];
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

  const seatMapData = mockSeatMap.P1;

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
      <UserLayout background={"https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg"}>
        <div className="text-center py-20">
          <p>Lỗi: Không có thông tin đặt vé.</p>
          <Link to="/" className="text-blue-500 hover:underline">
            Quay về trang chủ
          </Link>
        </div>
      </UserLayout>
    );
  }
  const handleSeatSelect = (seat: SeatType) => {
    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.id === seat.id);
      let newSelectedSeats: SeatType[];

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

  const handleContinue = () => {
    // Get the latest booking state from localStorage
    const latestBookingState = JSON.parse(localStorage.getItem("bookingState") || "{}");

    // Ensure we have the latest selectedSeats and totalCost
    const finalBookingState = {
      ...latestBookingState,
      selectedSeats,
      totalCost,
    };

    // Update localStorage with final state
    localStorage.setItem("bookingState", JSON.stringify(finalBookingState));

    navigate("/checkout", { state: finalBookingState });
  };

  const totalCost = selectedSeats.reduce((total, seat) => {
    if (seat.type === "vip") return total + 90000;
    if (seat.type === "double") return total + 150000;
    return total + 75000;
  }, 0);
  return (
    <UserLayout background={"https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg"}>
      <div className="max-w-screen-2xl mx-auto p-4 md:p-8">
        {/* Breadcrumb */}
        <BookingBreadcrumb movieTitle={movie?.title} className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Sơ đồ ghế */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            {seatMapData ? (
              <SeatMap seatMap={seatMapData} selectedSeats={selectedSeats} onSeatSelect={handleSeatSelect} />
            ) : (
              <p>Không tìm thấy sơ đồ ghế.</p>
            )}

            {/* ++ THÊM BOOKING FOOTER VÀO ĐÂY ++ */}
            <BookingFooter selectedSeats={selectedSeats} totalCost={totalCost} />
          </div>{" "}
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

export default SeatSelectionPage;
