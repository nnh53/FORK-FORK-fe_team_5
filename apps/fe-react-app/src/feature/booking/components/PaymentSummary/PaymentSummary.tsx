import type { Promotion } from "@/interfaces/promotion.interface";
import React, { useEffect, useState } from "react";

interface PaymentSummaryProps {
  ticketCost: number;
  comboCost: number;
  snackCost?: number;
  pointsDiscount?: number;
  voucherDiscount?: number;
  promotionDiscount?: number;
  selectedPromotion?: Promotion | null;
  totalCost: number;
}

const HOLD_TIME_SECONDS = 8 * 60; // 8 phút

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  ticketCost,
  comboCost,
  snackCost = 0,
  pointsDiscount = 0,
  voucherDiscount = 0,
  promotionDiscount = 0,
  selectedPromotion = null,
  totalCost,
}) => {
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
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const subtotal = ticketCost + comboCost + snackCost;
  const totalDiscount = pointsDiscount + voucherDiscount + promotionDiscount;

  return (
    <div className="space-y-2 border-t pt-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Tổng tiền vé:</span>
        <span className="font-semibold">{ticketCost.toLocaleString("vi-VN")}VND</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Tổng tiền combo:</span>
        <span className="font-semibold">{comboCost.toLocaleString("vi-VN")}VND</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Tổng tiền snack:</span>
        <span className="font-semibold">{snackCost.toLocaleString("vi-VN")}VND</span>
      </div>

      {/* Subtotal */}
      {totalDiscount > 0 && (
        <div className="flex justify-between border-t pt-2 text-sm">
          <span className="text-gray-600">Tạm tính:</span>
          <span className="font-semibold">{subtotal.toLocaleString("vi-VN")}VND</span>
        </div>
      )}

      {/* Discounts - Hiển thị khi có giá trị */}
      {pointsDiscount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Giảm từ điểm tích lũy:</span>
          <span>-{pointsDiscount.toLocaleString("vi-VN")}VND</span>
        </div>
      )}

      {voucherDiscount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Giảm từ mã voucher:</span>
          <span>-{voucherDiscount.toLocaleString("vi-VN")}VND</span>
        </div>
      )}

      {/* Hiển thị khuyến mãi khi có selectedPromotion */}
      {selectedPromotion && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Giảm từ khuyến mãi:</span>
          <span>{promotionDiscount > 0 ? `-${promotionDiscount.toLocaleString("vi-VN")}VND` : "0VND"}</span>
        </div>
      )}

      <div className="flex justify-between border-t pt-2 text-xl font-bold">
        <span>Tổng cộng:</span>
        <span className="text-red-600">{totalCost.toLocaleString("vi-VN")}VND</span>
      </div>
      <div className="mt-4 text-center text-sm text-gray-500">
        Thời gian còn lại: <span className="text-lg font-bold">{formatTime(remainingTime)}</span>
      </div>
    </div>
  );
};

export default PaymentSummary;
