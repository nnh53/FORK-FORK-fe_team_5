import type { Combo } from "@/interfaces/combo.interface";
import React from "react";

interface ComboItemProps {
  combo: Combo;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

const ComboItem: React.FC<ComboItemProps> = ({ combo, quantity, onQuantityChange }) => {
  // Calculate total price from snacks
  const totalPrice = combo.snacks.reduce((total, comboSnack) => {
    const price = comboSnack.snack.price ?? 0;
    const qty = comboSnack.quantity && comboSnack.quantity > 0 ? comboSnack.quantity : 1;
    return total + price * qty;
  }, 0);

  const isUnavailable = combo.status === "UNAVAILABLE";

  return (
    <div className={`flex items-center gap-4 border-b py-4 ${isUnavailable ? "opacity-60" : ""}`}>
      <img src={combo.img} alt={combo.name} className="h-20 w-20 object-contain" />
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <p className="font-bold">{combo.name}</p>
          {isUnavailable && <span className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">Hết</span>}
        </div>
        <p className="text-xs text-gray-500">{combo.description}</p>
        <p className={`text-sm font-semibold ${isUnavailable ? "text-gray-400" : "text-red-600"}`}>{totalPrice.toLocaleString("vi-VN")}đ</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onQuantityChange(quantity - 1)}
          disabled={quantity === 0 || isUnavailable}
          className="h-8 w-8 rounded-full bg-gray-200 text-lg font-bold disabled:opacity-50"
        >
          -
        </button>
        <span className="w-8 text-center font-bold">{quantity}</span>
        <button
          onClick={() => onQuantityChange(quantity + 1)}
          disabled={isUnavailable}
          className="h-8 w-8 rounded-full bg-gray-200 text-lg font-bold disabled:opacity-50"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ComboItem;
