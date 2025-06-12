import React from "react";
import ComboItem, { type Combo } from "../ComboItem/ComboItem.tsx";

interface ComboListProps {
  combos: Combo[];
  selectedCombos: Record<string, number>;
  onQuantityChange: (comboId: string, newQuantity: number) => void;
}

const ComboList: React.FC<ComboListProps> = ({ combos, selectedCombos, onQuantityChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold border-l-4 border-red-600 pl-3">COMBO ƯU ĐÃI</h3>
      <div className="max-h-96 overflow-y-auto pr-2">
        {combos.map((combo) => (
          <ComboItem
            key={combo.id}
            combo={combo}
            quantity={selectedCombos[combo.id] || 0}
            onQuantityChange={(newQuantity) => onQuantityChange(combo.id, newQuantity)}
          />
        ))}
      </div>
    </div>
  );
};

export default ComboList;
