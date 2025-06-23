import type { Combo } from "@/interfaces/booking.interface";
import React from "react";

interface ComboItemProps {
  combo: Combo;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

const ComboItem: React.FC<ComboItemProps> = ({ combo, quantity, onQuantityChange }) => {
  return (
    <div className="flex items-center gap-4 border-b py-4">
      <img src={combo.imageUrl} alt={combo.name} className="w-20 h-20 object-contain" />
      <div className="flex-grow">
        <p className="font-bold">{combo.name}</p>
        <p className="text-xs text-gray-500">{combo.description}</p>
        <p className="text-sm font-semibold text-red-600">{combo.price.toLocaleString("vi-VN")}đ</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onQuantityChange(quantity - 1)}
          disabled={quantity === 0}
          className="w-8 h-8 rounded-full bg-gray-200 text-lg font-bold disabled:opacity-50"
        >
          -
        </button>
        <span className="w-8 text-center font-bold">{quantity}</span>
        <button onClick={() => onQuantityChange(quantity + 1)} className="w-8 h-8 rounded-full bg-gray-200 text-lg font-bold">
          +
        </button>
      </div>
    </div>
  );
};

export default ComboItem;
