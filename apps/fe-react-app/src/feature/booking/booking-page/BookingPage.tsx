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
  const { movie, selection, cinemaName } = location.state || {};

  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([]);

  // ++ SỬA LỖI: KHAI BÁO KIỂU DỮ LIỆU TƯỜNG MINH CHO MOCK DATA
  // const mockSeatMap: { [key: string]: SeatMapData } = {
  //   P1: {
  //     rows: ['J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'],
  //     seats: [
  //       { id: 'J1', row: 'J', number: 1, type: 'standard', status: 'available' },
  //       { id: 'J2', row: 'J', number: 2, type: 'standard', status: 'available' },
  //       { id: 'J3', row: 'J', number: 3, type: 'standard', status: 'taken' },
  //       { id: 'J4', row: 'J', number: 4, type: 'standard', status: 'available' },
  //       { id: 'J5', row: 'J', number: 5, type: 'standard', status: 'available' },
  //       { id: 'J6', row: 'J', number: 6, type: 'standard', status: 'available' },
  //       { id: 'J7', row: 'J', number: 7, type: 'vip', status: 'available' },
  //       { id: 'J8', row: 'J', number: 8, type: 'vip', status: 'available' },
  //       { id: 'J9', row: 'J', number: 9, type: 'vip', status: 'taken' },
  //       { id: 'J10', row: 'J', number: 10, type: 'vip', status: 'available' },
  //       { id: 'J11', row: 'J', number: 11, type: 'standard', status: 'available' },
  //       { id: 'J12', row: 'J', number: 12, type: 'standard', status: 'available' },
  //       { id: 'J13', row: 'J', number: 13, type: 'standard', status: 'taken' },
  //       { id: 'J14', row: 'J', number: 14, type: 'standard', status: 'available' },
  //       { id: 'J15', row: 'J', number: 15, type: 'standard', status: 'available' },
  //       { id: 'J16', row: 'J', number: 16, type: 'standard', status: 'available' },
  //       { id: 'J17', row: 'J', number: 17, type: 'standard', status: 'available' },
  //       { id: 'J18', row: 'J', number: 18, type: 'standard', status: 'available' },
  //       { id: 'A1', row: 'A', number: 1, type: 'double', status: 'available' },
  //       { id: 'A2', row: 'A', number: 2, type: 'double', status: 'available' },
  //       { id: 'A3', row: 'A', number: 3, type: 'double', status: 'taken' },
  //       { id: 'A4', row: 'A', number: 4, type: 'double', status: 'available' },
  //       { id: 'A5', row: 'A', number: 5, type: 'double', status: 'available' },
  //       { id: 'A6', row: 'A', number: 6, type: 'double', status: 'available' },
  //     ],
  //   },
  // };
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

  if (!location.state) {
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
    navigate("/checkout", {
      state: {
        movie,
        selection,
        cinemaName,
        selectedSeats,
        totalCost,
      },
    });
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
