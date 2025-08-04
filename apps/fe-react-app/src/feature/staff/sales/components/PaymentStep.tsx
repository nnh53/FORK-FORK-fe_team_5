import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Separator } from "@/components/Shadcn/ui/separator";
import type { PaymentMethod } from "@/interfaces/booking.interface";
import type { Combo } from "@/interfaces/combo.interface";
import type { Member } from "@/interfaces/member.interface";
import type { Snack } from "@/interfaces/snacks.interface";
import { formatVND } from "@/utils/currency.utils.ts";
import { ArrowLeft, Banknote, CreditCard, Globe, Target } from "lucide-react";
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
              <span>{formatVND(calculateSeatPrice(), 0, "VNĐ")}</span>
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
                    {formatVND(
                      (combo.snacks?.reduce((total, comboSnack) => {
                        const snackPrice = comboSnack.snack?.price || 0;
                        const snackQuantity = comboSnack.quantity || 1;
                        return total + snackPrice * snackQuantity;
                      }, 0) || 0) * quantity,
                      0,
                      "VNĐ",
                    )}
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
                    <span>{formatVND((snack.price ?? 0) * quantity, 0, "VNĐ")}</span>
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
              <Label htmlFor="points">Điểm sử dụng (có {memberInfo.currentPoints} điểm, tối đa 50 điểm):</Label>
              <div className="flex items-center gap-2">
                {(() => {
                  // Calculate maximum points that can be used while keeping order ≥ 1000 VNĐ
                  const totalBeforePoints = calculateTotal() + usePoints * 1000; // Get original total
                  const maxPointsForMinimum = Math.floor((totalBeforePoints - 1000) / 1000); // Max points to keep ≥ 1000 VNĐ
                  const maxAllowedPoints = Math.min(memberInfo.currentPoints, 50, maxPointsForMinimum);

                  return (
                    <>
                      <Input
                        id="points"
                        type="number"
                        value={usePoints}
                        onChange={(e) => onUsePointsChange(Math.min(parseInt(e.target.value) || 0, Math.min(memberInfo.currentPoints, 50)))}
                        max={Math.max(0, maxAllowedPoints)}
                        min={0}
                        className="w-24"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onUsePointsChange(Math.max(0, maxAllowedPoints));
                        }}
                        className="text-xs"
                      >
                        <Target className="mr-1 h-3 w-3" />
                        Tối đa
                      </Button>
                    </>
                  );
                })()}
              </div>
              <span className="text-sm text-gray-500">= {formatVND(usePoints * 1000, 0, "VNĐ")}</span>
            </div>
            {/* Validation warning for minimum order amount */}
            {usePoints > 0 && calculateTotal() < 1000 && (
              <div className="mt-2 rounded-md bg-red-50 p-2 text-sm text-red-600">
                <span role="img" aria-label="Warning">
                  ⚠️
                </span>{" "}
                Tổng tiền sau khi trừ điểm phải từ 1,000 VNĐ trở lên
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Payment Method */}
        <div>
          <h3 className="mb-3 font-semibold">Phương Thức Thanh Toán</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
            {[
              { id: "CASH" as PaymentMethod, name: "Tiền mặt", icon: Banknote },
              { id: "ONLINE" as PaymentMethod, name: "Online", icon: Globe },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => onPaymentMethodChange(method.id)}
                className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-center transition-colors ${
                  paymentMethod === method.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <method.icon className="h-4 w-4" />
                {method.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button
            onClick={onCreateBooking}
            disabled={loading || (usePoints > 0 && calculateTotal() < 1000)}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {loading ? "Đang xử lý..." : `Thanh toán ${formatVND(calculateTotal(), 0, "VNĐ")}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentStep;
