import React, { useState, useEffect } from 'react';

interface PaymentSummaryProps {
  ticketCost: number;
  comboCost: number;
  totalCost: number;
}

const HOLD_TIME_SECONDS = 8 * 60; // 8 phút

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ ticketCost, comboCost, totalCost }) => {
  const [remainingTime, setRemainingTime] = useState(HOLD_TIME_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="border-t pt-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Tổng tiền vé:</span>
        <span className="font-semibold">{ticketCost.toLocaleString('vi-VN')}đ</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Tổng tiền combo:</span>
        <span className="font-semibold">{comboCost.toLocaleString('vi-VN')}đ</span>
      </div>
      <div className="flex justify-between text-xl font-bold">
        <span>Tổng cộng:</span>
        <span className="text-red-600">{totalCost.toLocaleString('vi-VN')}đ</span>
      </div>
      <div className="text-center text-sm text-gray-500 mt-4">
        Thời gian còn lại: <span className="font-bold text-lg">{formatTime(remainingTime)}</span>
      </div>
    </div>
  );
};

export default PaymentSummary;
