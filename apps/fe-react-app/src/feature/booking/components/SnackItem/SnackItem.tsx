import type { Snack } from "@/interfaces/snacks.interface";
import { Icon } from "@iconify/react";
import React from "react";

interface SnackItemProps {
  snack: Snack;
  quantity: number;
  onQuantityChange: (snackId: number, quantity: number) => void;
}

const SnackItem: React.FC<SnackItemProps> = ({ snack, quantity, onQuantityChange }) => {
  const handleIncrease = () => {
    if (snack.status === "AVAILABLE") {
      onQuantityChange(snack.id, quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      onQuantityChange(snack.id, quantity - 1);
    }
  };

  const isUnavailable = snack.status === "UNAVAILABLE";

  return (
    <div className={`rounded-lg border p-4 ${isUnavailable ? "bg-gray-50 opacity-60" : "transition-shadow hover:shadow-md"}`}>
      <div className="flex gap-4">
        <div className="relative">
          {snack.img ? (
            <img
              src={snack.img}
              alt={snack.name}
              className="h-20 w-20 rounded-md object-cover"
              onError={(e) => {
                // Hide image and show icon on error
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const iconDiv = target.nextElementSibling as HTMLElement;
                if (iconDiv) iconDiv.style.display = "flex";
              }}
            />
          ) : null}
          <div className="flex h-20 w-20 items-center justify-center rounded-md bg-gray-100" style={{ display: snack.img ? "none" : "flex" }}>
            <Icon icon="mdi:popcorn" className="h-8 w-8 text-gray-400" />
          </div>
          {isUnavailable && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black bg-opacity-50">
              <span className="text-xs font-bold text-white">HẾT</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h4 className="text-base font-semibold">{snack.name}</h4>
          <p className="mb-1 text-sm text-gray-600">{snack.description}</p>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <span className="rounded bg-gray-100 px-2 py-1 text-xs">{snack.size}</span>
            {snack.flavor && <span className="rounded bg-gray-100 px-2 py-1 text-xs">{snack.flavor}</span>}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-red-600">{snack.price.toLocaleString("vi-VN")}đ</p>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrease}
                disabled={quantity === 0 || isUnavailable}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:border-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={handleIncrease}
                disabled={isUnavailable}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:border-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnackItem;
