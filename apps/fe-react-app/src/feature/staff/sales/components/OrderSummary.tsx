import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Separator } from "@/components/Shadcn/ui/separator";
import type { Combo } from "@/interfaces/combo.interface";
import type { Movie } from "@/interfaces/movies.interface";
import type { Promotion } from "@/interfaces/promotion.interface";
import type { Snack } from "@/interfaces/snacks.interface";
import type { UIShowtime } from "@/interfaces/staff-sales.interface";
import { calculateDiscount, formatCurrency } from "@/services/promotionService";
import { formatVND } from "@/utils/currency.utils";
import React from "react";

interface OrderSummaryProps {
  selectedMovie: Movie | null;
  selectedShowtime: UIShowtime | null;
  selectedSeatIds: number[];
  selectedCombos: Array<{ combo: Combo; quantity: number }>;
  selectedSnacks: Record<number, number>;
  snacks: Snack[];
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
  selectedPromotion?: Promotion | null;
  usePoints: number;
  // Room information
  roomType?: string;
  roomFee?: number;
  getSeatDisplayNames: () => string[];
  calculateSeatPrice: () => number;
  calculateTotal: () => number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedMovie,
  selectedShowtime,
  selectedSeatIds,
  selectedCombos,
  selectedSnacks,
  snacks,
  customerInfo,
  selectedPromotion,
  usePoints,
  roomType,
  roomFee = 0,
  getSeatDisplayNames,
  calculateSeatPrice,
  calculateTotal,
}) => {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Tóm Tắt Đơn Hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedMovie && (
          <div>
            <h4 className="font-semibold">Phim</h4>
            <p className="text-sm">{selectedMovie.name ?? "Movie"}</p>
          </div>
        )}

        {selectedShowtime && (
          <div>
            <h4 className="font-semibold">Suất chiếu</h4>
            <p className="text-sm">
              {selectedShowtime.startTime} - {selectedShowtime.date}
            </p>
            <p className="text-sm">Phòng {selectedShowtime.cinemaRoomId}</p>
            {roomType && <p className="text-xs text-gray-500">{roomType}</p>}
          </div>
        )}

        {selectedSeatIds.length > 0 && (
          <div>
            <h4 className="font-semibold">Ghế đã chọn</h4>
            <p className="text-sm">{getSeatDisplayNames().join(", ")}</p>
            <p className="text-sm font-medium">{formatVND(calculateSeatPrice())}</p>
            {roomFee > 0 && <p className="text-xs text-gray-500">Phí phòng: {formatVND(roomFee * selectedSeatIds.length)}</p>}
          </div>
        )}

        {selectedCombos.length > 0 && selectedCombos.some(({ quantity }) => quantity > 0) && (
          <div>
            <h4 className="font-semibold">Combo</h4>
            {selectedCombos
              .filter(({ quantity }) => quantity > 0)
              .map(({ combo, quantity }) => (
                <div key={combo.id} className="flex justify-between text-sm">
                  <span>
                    {combo.name} x{quantity}
                  </span>
                  <span>{formatVND((combo.price ?? 0) * quantity)}</span>
                </div>
              ))}
          </div>
        )}

        {Object.values(selectedSnacks).some((qty) => qty > 0) && (
          <div>
            <h4 className="font-semibold">Bắp Nước</h4>
            {Object.entries(selectedSnacks)
              .filter(([, quantity]) => quantity > 0)
              .map(([snackId, quantity]) => {
                const snack = snacks.find((s) => s.id === parseInt(snackId));
                return snack ? (
                  <div key={snackId} className="flex justify-between text-sm">
                    <span>
                      {snack.name} x{quantity}
                    </span>
                    <span>{formatVND((snack.price ?? 0) * quantity)}</span>
                  </div>
                ) : null;
              })}
          </div>
        )}

        {customerInfo.name && (
          <div>
            <h4 className="font-semibold">Khách hàng</h4>
            <p className="text-sm">{customerInfo.name}</p>
            <p className="text-sm">{customerInfo.phone}</p>
          </div>
        )}

        {usePoints > 0 && (
          <div>
            <h4 className="font-semibold">Giảm giá điểm</h4>
            <p className="text-sm text-green-600">-{formatVND(usePoints * 1000, 0, "VNĐ")}</p>
          </div>
        )}

        {selectedPromotion && (
          <div>
            <h4 className="font-semibold">Khuyến mãi</h4>
            <p className="text-sm">{selectedPromotion.title}</p>
            <p className="text-sm text-green-600">
              -
              {formatCurrency(
                calculateDiscount(
                  selectedPromotion,
                  calculateSeatPrice() +
                    selectedCombos.reduce((sum, { combo, quantity }) => {
                      const comboPrice = combo.price ?? 0;
                      return sum + comboPrice * quantity;
                    }, 0) +
                    Object.entries(selectedSnacks).reduce((sum, [snackId, quantity]) => {
                      const snack = snacks.find((s) => s.id === parseInt(snackId));
                      return sum + (snack?.price ?? 0) * quantity;
                    }, 0) +
                    (roomFee * selectedSeatIds.length),
                ),
              )}
            </p>
          </div>
        )}

        <Separator />

        <div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Tổng cộng</span>
            <span className="text-xl font-bold text-red-600">{formatVND(calculateTotal(), 0, "VNĐ")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
