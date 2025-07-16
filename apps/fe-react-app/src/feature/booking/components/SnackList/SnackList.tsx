import type { Snack } from "@/interfaces/snacks.interface";
import React from "react";
import SnackItem from "../SnackItem/SnackItem";

interface SnackListProps {
  snacks: Snack[];
  selectedSnacks: Record<number, number>;
  onQuantityChange: (snackId: number, quantity: number) => void;
}

const SnackList: React.FC<SnackListProps> = ({ snacks, selectedSnacks, onQuantityChange }) => {
  // Group snacks by category
  const snacksByCategory = snacks.reduce(
    (acc, snack) => {
      const categoryKey = snack.category ?? "UNKNOWN";
      if (!acc[categoryKey]) {
        acc[categoryKey] = [];
      }
      acc[categoryKey].push(snack);
      return acc;
    },
    {} as Record<string, Snack[]>,
  );

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case "FOOD":
        return "Đồ Ăn";
      case "DRINK":
        return "Nước Uống";
      default:
        return category;
    }
  };

  if (snacks.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Đồ Ăn & Thức Uống</h3>
        <div className="py-8 text-center text-gray-500">
          <p>Không có snacks nào khả dụng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Đồ Ăn & Thức Uống</h3>

      <div className="max-h-96 overflow-y-auto pr-2">
        {Object.entries(snacksByCategory).map(([category, categorySnacks]) => (
          <div key={category} className="mb-6 space-y-4">
            <h4 className="text-md border-b pb-2 font-medium text-gray-700">{getCategoryDisplayName(category)}</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {categorySnacks.map((snack) => (
                <SnackItem key={snack.id} snack={snack} quantity={selectedSnacks[snack.id ?? 0] || 0} onQuantityChange={onQuantityChange} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SnackList;
