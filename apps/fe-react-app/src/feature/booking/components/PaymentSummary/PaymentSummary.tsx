import type { Promotion } from "@/interfaces/promotion.interface";
import { formatVND } from "@/utils/currency.utils";

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
  const subtotal = ticketCost + comboCost + snackCost;
  const totalDiscount = pointsDiscount + voucherDiscount + promotionDiscount;

  return (
    <div className="space-y-2 border-t pt-4">
      {ticketCost > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tổng tiền vé:</span>
          <span className="font-semibold">{formatVND(ticketCost)}</span>
        </div>
      )}

      {comboCost > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tổng tiền combo:</span>
          <span className="font-semibold">{formatVND(comboCost)}</span>
        </div>
      )}

      {snackCost > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tổng tiền snack:</span>
          <span className="font-semibold">{formatVND(snackCost)}</span>
        </div>
      )}

      {/* Subtotal */}
      {totalDiscount > 0 && (
        <div className="flex justify-between border-t pt-2 text-sm">
          <span className="text-gray-600">Tạm tính:</span>
          <span className="font-semibold">{formatVND(subtotal)}</span>
        </div>
      )}

      {/* Discounts - Hiển thị khi có giá trị */}
      {pointsDiscount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Giảm từ điểm tích lũy:</span>
          <span>-{formatVND(pointsDiscount)}</span>
        </div>
      )}

      {voucherDiscount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Giảm từ mã voucher:</span>
          <span>-{formatVND(voucherDiscount)}</span>
        </div>
      )}

      {/* Hiển thị khuyến mãi khi có selectedPromotion */}
      {selectedPromotion && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Giảm từ khuyến mãi:</span>
          <span>{promotionDiscount > 0 ? `-${formatVND(promotionDiscount)}` : formatVND(0)}</span>
        </div>
      )}

      <div className="flex justify-between border-t pt-2 text-xl font-bold">
        <span>Tổng cộng:</span>
        <span className="text-red-600">{formatVND(totalCost)}</span>
      </div>
    </div>
  );
};

export default PaymentSummary;
