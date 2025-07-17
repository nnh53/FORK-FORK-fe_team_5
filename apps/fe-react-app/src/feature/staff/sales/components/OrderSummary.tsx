import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Separator } from "@/components/Shadcn/ui/separator";
import type { Combo } from "@/interfaces/combo.interface";
import type { Movie } from "@/interfaces/movies.interface";
import type { Promotion } from "@/interfaces/promotion.interface";
import type { Snack } from "@/interfaces/snacks.interface";
import { calculateDiscount, formatCurrency } from "@/services/promotionService";
import React from "react";
import type { UIShowtime } from "@/interfaces/staff-sales.interface";

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
          </div>
        )}

        {selectedSeatIds.length > 0 && (
          <div>
            <h4 className="font-semibold">Ghế đã chọn</h4>
            <p className="text-sm">{getSeatDisplayNames().join(", ")}</p>
            <p className="text-sm font-medium">{calculateSeatPrice().toLocaleString("vi-VN")} VNĐ</p>
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
                  <span>
                    {(
                      (combo.snacks?.reduce((total, comboSnack) => {
                        const snackPrice = comboSnack.snack?.price || 0;
                        const snackQuantity = comboSnack.quantity || 1;
                        return total + snackPrice * snackQuantity;
                      }, 0) || 0) * quantity
                    ).toLocaleString("vi-VN")}{" "}
                    VNĐ
                  </span>
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
                    <span>{((snack.price ?? 0) * quantity).toLocaleString("vi-VN")} VNĐ</span>
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
            <p className="text-sm text-green-600">-{(usePoints * 1000).toLocaleString("vi-VN")} VNĐ</p>
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
                      const comboPrice =
                        combo.snacks?.reduce((total, comboSnack) => {
                          const snackPrice = comboSnack.snack?.price || 0;
                          const snackQuantity = comboSnack.quantity || 1;
                          return total + snackPrice * snackQuantity;
                        }, 0) || 0;
                      return sum + comboPrice * quantity;
                    }, 0) +
                    Object.entries(selectedSnacks).reduce((sum, [snackId, quantity]) => {
                      const snack = snacks.find((s) => s.id === parseInt(snackId));
                      return sum + (snack?.price ?? 0) * quantity;
                    }, 0),
                ),
              )}
            </p>
          </div>
        )}

        <Separator />

        <div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Tổng cộng</span>
            <span className="text-xl font-bold text-red-600">{calculateTotal().toLocaleString("vi-VN")} VNĐ</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
