import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Food } from "@/interfaces/foodAndCombo.interface";
import { Edit, Trash } from "lucide-react";

interface FoodCardProps {
  food: Food;
  onEdit?: (food: Food) => void;
  onDelete?: (id: number) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ food, onEdit, onDelete }) => {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle className="text-lg">{food.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {food.img && (
          <img src={food.img} alt={food.name} className="w-full h-48 object-cover rounded-md" />
        )}

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">{food.price.toLocaleString("vi-VN")} VNĐ</span>
            <Badge variant={food.status === "available" ? "secondary" : "destructive"}>
              {food.status === "available" ? "Có sẵn" : "Hết hàng"}
            </Badge>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Danh mục:</span> {food.category}</p>
            <p><span className="font-medium">Size:</span> {food.size}</p>
            <p><span className="font-medium">Hương vị:</span> {food.flavor}</p>
            <p><span className="font-medium">Số lượng:</span> {food.quantity}</p>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-2">
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(food)}
                className="flex items-center gap-1"
              >
                <Edit className="h-3 w-3" />
                Sửa
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(food.id)}
                className="flex items-center gap-1"
              >
                <Trash className="h-3 w-3" />
                Xóa
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodCard;
