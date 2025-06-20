import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Food } from "@/interfaces/foodAndCombo.interface";
import { cn } from "@/lib/utils";
import { AlertTriangle, Edit, Package, Trash, Utensils } from "lucide-react";

interface FoodCardProps {
  food: Food;
  onEdit?: (food: Food) => void;
  onDelete?: (id: number) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ food, onEdit, onDelete }) => {
  const isLowStock = food.quantity < 10;
  const isOutOfStock = food.quantity === 0 || food.status !== "available";

  // Xác định trạng thái badge
  const getBadgeVariant = () => {
    if (isOutOfStock) return "destructive";
    if (isLowStock) return "outline";
    return "default";
  };

  const getBadgeText = () => {
    if (isOutOfStock) return "Ngừng bán";
    if (isLowStock)
      return (
        <>
          <AlertTriangle className="h-3 w-3" />
          Sắp hết
        </>
      );
    return "Còn hàng";
  };

  const getBadgeClass = () => {
    if (isOutOfStock) return "";
    if (isLowStock) return "text-red-600 border-red-600";
    return "bg-green-600 hover:bg-green-700";
  };

  // Tách nested ternary cho text color
  const getQuantityTextColor = () => {
    if (isOutOfStock) return "text-destructive";
    if (isLowStock) return "text-orange-600";
    return "text-green-600";
  };

  // Tách nested ternary cho progress bar color
  const getProgressBarColor = () => {
    if (isOutOfStock) return "bg-destructive";
    if (isLowStock) return "bg-orange-400";
    return "bg-green-500";
  };

  return (
    <Card
      className={cn(
        "w-full max-w-md transition-all duration-200 hover:shadow-lg",
        isOutOfStock && "opacity-75 border-destructive/30",
        isLowStock && !isOutOfStock && "border-orange-200 bg-orange-50/30",
      )}
    >
      <CardHeader className="">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl leading-tight flex-1 min-w-0 break-words">{food.name}</CardTitle>
          <div className="flex-shrink-0">
            <Badge variant={getBadgeVariant()} className={cn("text-xs whitespace-nowrap", getBadgeClass())}>
              {getBadgeText()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Hình ảnh và thông tin chính - 2 cột */}
        <div className="grid grid-cols-2 gap-4">
          {/* Cột 1: Hình ảnh */}
          <div className="flex-shrink-0">
            {food.img ? (
              <img src={food.img} alt={food.name} className="w-full h-32 object-cover rounded-lg border" />
            ) : (
              <div className="w-full h-32 rounded-lg bg-muted flex items-center justify-center border">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Utensils className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>

          {/* Cột 2: Thông tin */}
          <div className="space-y-3">
            <div>
              <span className="text-xl font-bold text-primary block">{food.price.toLocaleString("vi-VN")}₫</span>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p className="truncate">{food.category}</p>
              <p className="truncate">
                {food.size} • {food.flavor}
              </p>
            </div>

            {/* Tồn kho */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Tồn kho</span>
                <div className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  <span className={cn("font-semibold", getQuantityTextColor())}>{food.quantity}</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className={cn("h-1.5 rounded-full transition-all", getProgressBarColor())}
                  style={{
                    width: `${Math.min((food.quantity / 50) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin chi tiết dạng grid 3 cột */}
        <div className="grid grid-cols-3 gap-2 text-xs p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <span className="text-muted-foreground block">Danh mục</span>
            <span className="font-medium truncate block">{food.category}</span>
          </div>
          <div className="text-center">
            <span className="text-muted-foreground block">Kích cỡ</span>
            <span className="font-medium truncate block">{food.size}</span>
          </div>
          <div className="text-center">
            <span className="text-muted-foreground block">Hương vị</span>
            <span className="font-medium truncate block">{food.flavor}</span>
          </div>
        </div>

        {/* Buttons hành động */}
        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-2">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={() => onEdit(food)} className="flex-1">
                <Edit className="h-3 w-3 mr-1" />
                Chỉnh sửa
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="destructive" onClick={() => onDelete(food.id)} className="flex-1">
                <Trash className="h-3 w-3 mr-1" />
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
