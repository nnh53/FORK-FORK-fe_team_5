import type { Combo } from "@/interfaces/combo.interface";
import { Icon } from "@iconify/react";
import React from "react";

interface ComboSelectionProps {
  combos: Combo[];
  selectedCombos: Array<{ combo: Combo; quantity: number }>;
  onComboSelect: (combo: Combo, quantity: number) => void;
  loading?: boolean;
}

const ComboSelection: React.FC<ComboSelectionProps> = ({ combos, selectedCombos, onComboSelect, loading = false }) => {
  const getComboQuantity = (comboId: number) => {
    const selectedCombo = selectedCombos.find((sc) => sc.combo.id === comboId);
    return selectedCombo ? selectedCombo.quantity : 0;
  };

  const handleQuantityChange = (combo: Combo, delta: number) => {
    const currentQuantity = getComboQuantity(combo.id ?? 0);
    const newQuantity = Math.max(0, currentQuantity + delta);
    onComboSelect(combo, newQuantity);
  };

  const calculateComboPrice = (combo: Combo) => {
    // Calculate price from snacks
    if (!combo.snacks || combo.snacks.length === 0) return 0;

    return combo.snacks.reduce((total, comboSnack) => {
      const snackPrice = comboSnack.snack?.price || 0;
      const quantity = comboSnack.quantity || 1;
      return total + snackPrice * quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold">Combo Bắp Nước</h3>
        <div className="py-8 text-center text-gray-500">
          <p>Đang tải combo...</p>
        </div>
      </div>
    );
  }

  if (combos.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold">Combo Bắp Nước</h3>
        <div className="py-8 text-center text-gray-500">
          <p>Không có combo nào khả dụng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 text-lg font-semibold">Combo Bắp Nước</h3>
      <div className="space-y-4">
        {combos.map((combo) => {
          const quantity = getComboQuantity(combo.id ?? 0);
          const price = calculateComboPrice(combo);

          return (
            <div key={combo.id} className="rounded-lg border p-4">
              <div className="flex gap-4">
                {combo.img ? (
                  <img
                    src={combo.img}
                    alt={combo.name}
                    className="h-20 w-20 rounded-md object-cover"
                    onError={(e) => {
                      // Replace with icon on error
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const iconDiv = target.nextElementSibling as HTMLElement;
                      if (iconDiv) iconDiv.style.display = "flex";
                    }}
                  />
                ) : null}
                <div className="flex h-20 w-20 items-center justify-center rounded-md bg-gray-100" style={{ display: combo.img ? "none" : "flex" }}>
                  <Icon icon="mdi:food" className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold">{combo.name}</h4>
                  <p className="mb-2 text-sm text-gray-600">{combo.description}</p>
                  <p className="text-lg font-bold text-red-600">{price.toLocaleString("vi-VN")}đ</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(combo, -1)}
                    disabled={quantity === 0}
                    className="h-8 w-8 rounded-full border border-gray-300 hover:border-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(combo, 1)}
                    className="h-8 w-8 rounded-full border border-gray-300 hover:border-red-500 hover:bg-red-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComboSelection;
