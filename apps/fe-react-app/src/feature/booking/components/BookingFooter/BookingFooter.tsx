// src/pages/SeatSelectionPage/components/BookingFooter.tsx
import React, { useState, useEffect } from 'react';
import type { SeatType } from '../../booking-page/BookingPage.tsx';

interface BookingFooterProps {
  selectedSeats: SeatType[];
  totalCost: number;
}

// Thời gian giữ ghế (ví dụ: 10 phút)
const HOLD_TIME_SECONDS = 10 * 60;

const BookingFooter: React.FC<BookingFooterProps> = ({ selectedSeats, totalCost }) => {
  const [remainingTime, setRemainingTime] = useState(HOLD_TIME_SECONDS);

  // Logic đếm ngược thời gian
  useEffect(() => {
    // Chỉ bắt đầu đếm khi người dùng đã chọn ít nhất 1 ghế
    if (selectedSeats.length > 0) {
      // Reset lại thời gian mỗi khi lựa chọn ghế thay đổi
      setRemainingTime(HOLD_TIME_SECONDS);

      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            // Ở đây có thể gọi một hàm để xử lý khi hết giờ
            // Ví dụ: onTimeout();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      // Cleanup function: rất quan trọng để tránh memory leak
      return () => clearInterval(timer);
    } else {
      // Nếu không có ghế nào được chọn, reset thời gian
      setRemainingTime(HOLD_TIME_SECONDS);
    }
  }, [selectedSeats.length]); // Chỉ chạy lại effect khi số lượng ghế chọn thay đổi

  // Format thời gian từ giây thành MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  // Đếm số lượng từng loại ghế
  const seatCounts = selectedSeats.reduce((acc, seat) => {
    acc[seat.type] = (acc[seat.type] || 0) + 1;
    return acc;
  }, {} as Record<SeatType['type'], number>);

  return (
    <div className="mt-8 p-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
      {/* Các loại ghế */}
      <div className="md:col-span-2 grid grid-cols-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-gray-200"></div>
          <div>
            <p className="text-xs text-gray-500">Ghế thường</p>
            <p className="font-bold">{seatCounts.standard || 0}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-yellow-400"></div>
          <div>
            <p className="text-xs text-gray-500">Ghế VIP</p>
            <p className="font-bold">{seatCounts.vip || 0}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-5 rounded-t-md bg-pink-400"></div>
          <div>
            <p className="text-xs text-gray-500">Ghế đôi</p>
            <p className="font-bold">{seatCounts.double || 0}</p>
          </div>
        </div>
      </div>

      {/* Tổng tiền */}
      <div className="text-center">
        <p className="text-sm text-gray-500">Tổng tiền</p>
        <p className="font-bold text-xl text-red-600">{totalCost.toLocaleString('vi-VN')}đ</p>
      </div>

      {/* Thời gian còn lại */}
      <div className="text-center">
        <p className="text-sm text-gray-500">Thời gian còn lại</p>
        <p className="font-bold text-xl">{formatTime(remainingTime)}</p>
      </div>
    </div>
  );
};

export default BookingFooter;
