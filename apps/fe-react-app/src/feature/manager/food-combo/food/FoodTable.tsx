// filepath: c:\Users\Hii\Desktop\OJT\fe_team_5\apps\fe-react-app\src\feature\manager\food-combo\food\FoodTable.tsx
import type { Food } from "@/interfaces/foodAndCombo.interface";
import React from "react";
import FoodCard from "./FoodCard";

interface FoodTableProps {
  foods: Food[];
  onEdit?: (food: Food) => void;
  onDelete?: (id: number) => void;
}

const FoodTable: React.FC<FoodTableProps> = ({ foods, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {foods.map((food) => (
        <FoodCard
          key={food.id}
          food={food}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default FoodTable;
