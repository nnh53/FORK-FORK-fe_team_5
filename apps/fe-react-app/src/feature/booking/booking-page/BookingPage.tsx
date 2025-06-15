import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const initialBookingState = location.state || JSON.parse(localStorage.getItem("bookingState") || "{}");
  const { movie, selection, cinemaName } = initialBookingState;
  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>(initialBookingState.selectedSeats || []);

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
      if (isSelected) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const handleContinue = () => {
    const updatedBookingState = {
      ...initialBookingState, // Giữ lại thông tin cũ
      selectedSeats,
      totalCost,
    };
    localStorage.setItem("bookingState", JSON.stringify(updatedBookingState));

    navigate("/checkout", { state: updatedBookingState });
  };

  const totalCost = selectedSeats.reduce((total, seat) => {
    if (seat.type === "vip") return total + 90000;
    if (seat.type === "double") return total + 150000;
    return total + 75000;
  }, 0);

  return (
    <UserLayout background={"https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg"}>
      <div className="max-w-screen-2xl mx-auto p-4 md:p-8">
        {/* ... Breadcrumbs ... */}
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
          </div>

          {/* Cột phải: Thông tin */}
          <div className="lg:col-span-1">
            <BookingSummary
              movie={movie}
              selection={selection}
              cinemaName={cinemaName}
              selectedSeats={selectedSeats}
              totalCost={totalCost}
              actionText="TIẾP TỤC"
              onActionClick={handleContinue}
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default SeatSelectionPage;
