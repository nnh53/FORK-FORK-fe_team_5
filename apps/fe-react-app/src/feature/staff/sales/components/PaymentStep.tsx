import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Separator } from "@/components/Shadcn/ui/separator";
import type { PaymentMethod } from "@/interfaces/booking.interface";
import type { Combo } from "@/interfaces/combo.interface";
import type { Member } from "@/interfaces/member.interface";
import type { Snack } from "@/interfaces/snacks.interface";
import { CreditCard } from "lucide-react";
import React from "react";

interface PaymentStepProps {
  selectedSeatIds: number[];
  selectedCombos: Array<{ combo: Combo; quantity: number }>;
  selectedSnacks: Record<number, number>;
  snacks: Snack[];
  memberInfo: Member | null;
  usePoints: number;
  paymentMethod: PaymentMethod;
  loading: boolean;
  calculateSeatPrice: () => number;
  calculateTotal: () => number;
  onUsePointsChange: (points: number) => void;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onBack: () => void;
  onCreateBooking: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  selectedSeatIds,
  selectedCombos,
  selectedSnacks,
  snacks,
  memberInfo,
  usePoints,
  paymentMethod,
  loading,
  calculateSeatPrice,
  calculateTotal,
  onUsePointsChange,
  onPaymentMethodChange,
  onBack,
  onCreateBooking,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Thanh Toán
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div>
          <h3 className="mb-3 font-semibold">Tóm Tắt Đơn Hàng</h3>
          <div className="space-y-2 rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between">
              <span>Vé phim ({selectedSeatIds.length} ghế):</span>
              <span>{calculateSeatPrice().toLocaleString("vi-VN")} VNĐ</span>
            </div>

            {/* Show selected combos */}
            {selectedCombos
              .filter(({ quantity }) => quantity > 0)
              .map(({ combo, quantity }) => (
                <div key={combo.id} className="flex justify-between">
                  <span>
                    {combo.name} x{quantity}:
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

            {/* Show selected snacks */}
            {Object.entries(selectedSnacks)
              .filter(([, quantity]) => quantity > 0)
              .map(([snackId, quantity]) => {
                const snack = snacks.find((s) => s.id === parseInt(snackId));
                return snack ? (
                  <div key={snackId} className="flex justify-between">
                    <span>
                      {snack.name} x{quantity}:
                    </span>
                    <span>{(snack.price * quantity).toLocaleString("vi-VN")} VNĐ</span>
                  </div>
                ) : null;
              })}
          </div>
        </div>

        <Separator />

        {/* Points Usage */}
        {memberInfo && (
          <div>
            <h3 className="mb-3 font-semibold">Sử Dụng Điểm Tích Lũy</h3>
            <div className="flex items-center gap-4">
              <Label htmlFor="points">Điểm sử dụng (có {memberInfo.currentPoints} điểm):</Label>
              <Input
                id="points"
                type="number"
                value={usePoints}
                onChange={(e) => onUsePointsChange(Math.min(parseInt(e.target.value) || 0, memberInfo.currentPoints))}
                max={memberInfo.currentPoints}
                className="w-24"
              />
              <span className="text-sm text-gray-500">= {(usePoints * 1000).toLocaleString("vi-VN")} VNĐ</span>
            </div>
          </div>
        )}

        <Separator />

        {/* Payment Method */}
        <div>
          <h3 className="mb-3 font-semibold">Phương Thức Thanh Toán</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
            {[
              { id: "CASH" as PaymentMethod, name: "Tiền mặt" },
              { id: "ONLINE" as PaymentMethod, name: "Online" },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => onPaymentMethodChange(method.id)}
                className={`rounded-lg border p-3 text-center transition-colors ${
                  paymentMethod === method.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                {method.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          <Button variant="outline" onClick={onBack}>
            Quay lại
          </Button>
          <Button onClick={onCreateBooking} disabled={loading} className="bg-green-600 hover:bg-green-700">
            {loading ? "Đang xử lý..." : `Thanh toán ${calculateTotal().toLocaleString("vi-VN")} VNĐ`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentStep;
