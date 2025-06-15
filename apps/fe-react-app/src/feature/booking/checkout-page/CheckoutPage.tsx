import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import UserLayout from "../../../layouts/userLayout/UserLayout";
import BookingSummary from "../components/BookingSummary/BookingSummary.tsx";
import { mockCombos } from "../components/ComboItem/ComboItem.tsx";
import ComboList from "../components/ComboList/ComboList.tsx";
import PaymentInfo from "../components/PaymentInfo/PaymentInfo.tsx";
import PaymentMethodSelector from "../components/PaymentMethodSelector/PaymentMethodSelector.tsx";
import PaymentSummary from "../components/PaymentSummary/PaymentSummary.tsx";

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  //const { movie, selection, cinemaName, selectedSeats, totalCost: ticketCost } = location.state || {};
  //const bookingState = location.state || JSON.parse(sessionStorage.getItem("bookingState") || "{}");
  useEffect(() => {
    if (location.state) {
      localStorage.setItem("bookingState", JSON.stringify(location.state));
    }
  }, [location.state]);

  const bookingState = JSON.parse(localStorage.getItem("bookingState") || "{}");

  const [selectedCombos, setSelectedCombos] = useState<Record<string, number>>({});
  const { movie, selection, cinemaName, selectedSeats, totalCost: ticketCost } = bookingState;
  // State quản lý số lượng combo đã chọn

  const handleQuantityChange = (comboId: string, quantity: number) => {
    setSelectedCombos((prev) => {
      const newCombos = { ...prev };
      if (quantity <= 0) {
        delete newCombos[comboId];
      } else {
        newCombos[comboId] = quantity;
      }
      return newCombos;
    });
  };

  const comboCost = Object.entries(selectedCombos).reduce((total, [comboId, quantity]) => {
    const combo = mockCombos.find((c) => c.id === comboId);
    return total + (combo ? combo.price * quantity : 0);
  }, 0);

  const finalTotalCost = ticketCost + comboCost;

  const handlePayment = () => {
    alert("thành công");
  };

  if (!movie) {
    // Xử lý khi không có dữ liệu
    return (
      <UserLayout>
        <div className="text-center p-10">
          Lỗi dữ liệu, vui lòng{" "}
          <Link to="/" className="text-blue-500">
            quay lại trang chủ
          </Link>
          .
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout background={"https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg"}>
      <div className="max-w-screen-2xl mx-auto p-4 md:p-8">
        {/* Breadcrumbs */}
        <div className="text-sm breadcrumbs mb-4 text-white">
          <ul>
            <li>
              <Link to="/">Trang chủ</Link>
            </li>
            <li>
              <Link to="/booking" state={location.state}>
                Đặt vé
              </Link>
            </li>
            <li className="font-semibold">Thanh toán</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Thông tin và lựa chọn */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-8">
            <PaymentInfo user={{ name: "Phát Đạt", phone: "0123456789", email: "test@gmail.com" }} selectedSeats={selectedSeats} />
            <ComboList combos={mockCombos} selectedCombos={selectedCombos} onQuantityChange={handleQuantityChange} />
            <PaymentSummary ticketCost={ticketCost} comboCost={comboCost} totalCost={finalTotalCost} />
            <PaymentMethodSelector />
          </div>

          {/* Cột phải: Tổng hợp vé */}
          <div className="lg:col-span-1">
            <BookingSummary
              movie={movie}
              selection={selection}
              cinemaName={cinemaName}
              selectedSeats={selectedSeats}
              totalCost={ticketCost}
              actionText="THANH TOÁN" // Thay đổi văn bản nút
              onActionClick={handlePayment} // Gọi hàm thanh toán
              showBackButton={true} // Hiển thị nút Quay lại
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default CheckoutPage;
