import { Avatar, AvatarFallback } from "@/components/Shadcn/ui/avatar";
import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import type { Food } from "@/interfaces/foodAndCombo.interface";
import { cn } from "@/lib/utils";
import { AlertTriangle, Edit, Package, Trash, Utensils } from "lucide-react";

interface FoodCardProps {
  food: Food;
  onEdit?: (food: Food) => void;
  onDelete?: (id: number) => void;
  viewMode?: "grid" | "list";
}

const FoodCard: React.FC<FoodCardProps> = ({ food, onEdit, onDelete, viewMode = "grid" }) => {
  const isLowStock = food.quantity < 10 && food.quantity > 0;
  const isOutOfStock = food.quantity === 0 || food.status !== "available";

  // Helper functions
  const getCategoryDisplay = (category: string) => {
    const categoryMap = {
      food: { label: "🍽️ Thức ăn", className: "bg-blue-100 text-blue-800" },
      drink: { label: "🥤 Đồ uống", className: "bg-green-100 text-green-800" },
    };
    return categoryMap[category as keyof typeof categoryMap] || { label: category, className: "bg-gray-100 text-gray-800" };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getQuantityTextColor = () => {
    if (isOutOfStock) return "text-destructive";
    if (isLowStock) return "text-orange-600";
    return "text-green-600";
  };

  const getProgressBarColor = () => {
    if (isOutOfStock) return "bg-destructive";
    if (isLowStock) return "bg-orange-400";
    return "bg-green-500";
  };

  const categoryInfo = getCategoryDisplay(food.category);

  // Shared components
  const CategoryBadge = () => (
    <Badge variant="secondary" className={`text-xs ${categoryInfo.className}`}>
      {categoryInfo.label}
    </Badge>
  );

  // Unified Stock Badge for both views
  const StockBadge = () => {
    if (isOutOfStock) {
      return (
        <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
          Ngừng bán
        </Badge>
      );
    }

    if (isLowStock) {
      return (
        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Sắp hết
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
        Có sẵn
      </Badge>
    );
  };

  const StockProgress = () => (
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
  );

  const ActionButtons = ({ isFullWidth = false }: { isFullWidth?: boolean }) => (
    <>
      {onEdit && (
        <Button size="sm" variant="outline" onClick={() => onEdit(food)} className={isFullWidth ? "flex-1" : "h-8 w-8 p-0"}>
          <Edit className={isFullWidth ? "h-3 w-3 mr-1" : "h-4 w-4"} />
          {isFullWidth && "Chỉnh sửa"}
        </Button>
      )}
      {onDelete && (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(food.id)}
          className={isFullWidth ? "flex-1" : "h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-200"}
        >
          <Trash className={isFullWidth ? "h-3 w-3 mr-1" : "h-4 w-4"} />
          {isFullWidth && "Xóa"}
        </Button>
      )}
    </>
  );

  // Image Component for Grid View (5:4 aspect ratio)
  const GridImageComponent = () => (
    <div className="flex-shrink-0">
      {food.img ? (
        <img
          src={food.img}
          alt={food.name}
          className="w-full h-32 object-cover rounded-lg border"
          style={{ aspectRatio: "5/4" }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-food.jpg";
          }}
        />
      ) : (
        <div
          className="w-full h-32 rounded-lg bg-gray-50 border border-gray-200 flex flex-col items-center justify-center"
          style={{ aspectRatio: "5/4" }}
        >
          <Avatar className="h-12 w-12 mb-2">
            <AvatarFallback className="bg-gray-100 text-gray-400">
              <Utensils className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-400 font-medium">No image</span>
        </div>
      )}
    </div>
  );

  // Image Component for List View (5:4 aspect ratio)
  const ListImageComponent = () => (
    <div className="w-16 rounded-lg overflow-hidden flex-shrink-0" style={{ aspectRatio: "5/4" }}>
      {food.img ? (
        <img
          src={food.img}
          alt={food.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-food.jpg";
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-50 border border-gray-200 flex flex-col items-center justify-center">
          <Avatar className="h-6 w-6 mb-1">
            <AvatarFallback className="bg-gray-100 text-gray-400">
              <Utensils className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-gray-400 font-medium leading-none">No image</span>
        </div>
      )}
    </div>
  );

  // Thêm hàm hiển thị comboId
  const getComboIdDisplay = (comboId: number) => {
    return comboId === 0 ? "Không" : `#${comboId}`;
  };

  // Grid View
  if (viewMode === "grid") {
    const comboIdValue = getComboIdDisplay(food.comboId);

    return (
      <Card
        className={cn(
          "w-full max-w-md transition-all duration-200 hover:shadow-lg",
          isOutOfStock && "opacity-75 border-destructive/30",
          isLowStock && !isOutOfStock && "border-orange-900 bg-orange-50/30",
        )}
      >
        <CardHeader className="">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-xl leading-tight flex-1 min-w-0 break-words">{food.name}</CardTitle>
            <StockBadge />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Hình ảnh và thông tin chính - 2 cột */}
          <div className="grid grid-cols-2 gap-4">
            {/* Cột 1: Hình ảnh với tỷ lệ 5:4 */}
            <GridImageComponent />

            {/* Cột 2: Thông tin */}
            <div className="space-y-3">
              {/* ID - Thêm vào đây */}
              <div>
                <span className="text-sm text-muted-foreground block">ID: #{food.id}</span>
              </div>

              <div>
                <span className="text-xl font-bold text-primary block">{food.price.toLocaleString("vi-VN")}₫</span>
              </div>

              {/* Category badge */}
              <div className="flex gap-1 flex-wrap">
                <CategoryBadge />
              </div>

              {/* Tồn kho với progress bar */}
              <StockProgress />
            </div>
          </div>

          {/* Thông tin chi tiết dạng grid 3 cột */}
          <div className="grid grid-cols-3 gap-2 text-xs p-3 bg-muted/30 rounded-lg">
            <div className="text-center">
              <span className="text-muted-foreground block">Combo ID</span>
              <span className="font-medium truncate block">{comboIdValue}</span>
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
              <ActionButtons isFullWidth={true} />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // List View: thêm comboId
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          {/* Image với tỷ lệ 5:4 */}
          <ListImageComponent />

          {/* Content Grid */}
          <div className="flex-1 grid grid-cols-12 gap-4 items-center">
            {/* Name and Category */}
            <div className="col-span-3">
              <h3 className="font-semibold text-sm line-clamp-1">{food.name}</h3>
              <div className="text-xs text-muted-foreground">ID: #{food.id}</div>
              <div className="flex gap-1 mt-1">
                <CategoryBadge />
              </div>
            </div>

            {/* Combo ID */}
            <div className="col-span-1 text-sm">
              <div className="text-muted-foreground text-xs">Combo ID</div>
              <div className="font-medium">{getComboIdDisplay(food.comboId)}</div>
            </div>

            {/* Size */}
            <div className="col-span-1 text-sm">
              <div className="text-muted-foreground text-xs">Kích thước</div>
              <div className="font-medium">{food.size}</div>
            </div>

            {/* Flavor */}
            <div className="col-span-1 text-sm">
              <div className="text-muted-foreground text-xs">Hương vị</div>
              <div className="font-medium line-clamp-1">{food.flavor}</div>
            </div>

            {/* Price */}
            <div className="col-span-2 text-sm">
              <div className="text-muted-foreground text-xs">Giá</div>
              <div className="font-bold text-primary">{formatPrice(food.price)}</div>
            </div>

            {/* Stock with progress */}
            <div className="col-span-2 text-sm">
              <div className="text-muted-foreground text-xs">Tồn kho</div>
              <div className="flex items-center gap-2">
                <span className={cn("font-medium", getQuantityTextColor())}>{food.quantity}</span>
                <div className="flex-1 bg-muted rounded-full h-1">
                  <div
                    className={cn("h-1 rounded-full transition-all", getProgressBarColor())}
                    style={{
                      width: `${Math.min((food.quantity / 50) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Stock Badge */}
            <div className="col-span-1">
              <StockBadge />
            </div>

            {/* Actions */}
            <div className="col-span-1 flex gap-1 justify-end">
              <ActionButtons isFullWidth={false} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodCard;
