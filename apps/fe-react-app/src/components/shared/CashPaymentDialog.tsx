import { Button } from "@/components/Shadcn/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import React, { useState } from "react";

interface CashPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (receivedAmount: number, changeAmount: number) => void;
  totalAmount: number;
  onCancel: () => void;
}

const CashPaymentDialog: React.FC<CashPaymentDialogProps> = ({ isOpen, onClose, onConfirm, totalAmount, onCancel }) => {
  const [receivedAmount, setReceivedAmount] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleReceivedAmountChange = (value: string) => {
    setReceivedAmount(value);
    setError("");
  };

  const handleConfirm = () => {
    const received = parseFloat(receivedAmount);

    if (isNaN(received) || received <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    if (received < totalAmount) {
      setError("Số tiền nhận không đủ để thanh toán");
      return;
    }

    const changeAmount = received - totalAmount;
    onConfirm(received, changeAmount);

    // Reset form
    setReceivedAmount("");
    setError("");
  };

  const handleCancel = () => {
    setReceivedAmount("");
    setError("");
    onCancel();
  };

  const changeAmount = parseFloat(receivedAmount) - totalAmount;
  const isValidAmount = !isNaN(parseFloat(receivedAmount)) && parseFloat(receivedAmount) >= totalAmount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-red-600">Xác nhận thanh toán tiền mặt</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tổng tiền cần thanh toán */}
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tổng tiền cần thanh toán:</span>
              <span className="text-lg font-bold text-red-600">{totalAmount.toLocaleString("vi-VN")} VNĐ</span>
            </div>
          </div>

          {/* Số tiền nhận từ khách */}
          <div className="space-y-2">
            <Label htmlFor="received-amount">Số tiền nhận từ khách</Label>
            <Input
              id="received-amount"
              type="number"
              placeholder="Nhập số tiền..."
              value={receivedAmount}
              onChange={(e) => handleReceivedAmountChange(e.target.value)}
              className="text-lg"
              min={totalAmount}
              step="1000"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          {/* Tiền thối */}
          {isValidAmount && (
            <div className="rounded-lg bg-green-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tiền thối:</span>
                <span className="text-lg font-bold text-green-600">{changeAmount.toLocaleString("vi-VN")} VNĐ</span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Hủy
            </Button>
            <Button onClick={handleConfirm} disabled={!isValidAmount} className="flex-1 bg-red-600 hover:bg-red-700">
              Xác nhận thanh toán
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CashPaymentDialog;
