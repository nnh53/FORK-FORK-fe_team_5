import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import type { Snack } from "@/interfaces/snacks.interface";
import { getSnackCategoryLabel, getSnackSizeLabel, getSnackStatusLabel } from "@/services/snackService";
import { cn } from "@/utils/utils";
import { Icon } from "@iconify/react";
import { Edit, Trash, Utensils } from "lucide-react";

interface SnackCardProps {
  snack: Snack;
  onEdit?: (snack: Snack) => void;
  onDelete?: (id: number) => void;
  viewMode?: "grid" | "list";
}

const SnackCard: React.FC<SnackCardProps> = ({ snack, onEdit, onDelete, viewMode = "grid" }) => {
  // Badge trạng thái
  const StatusBadge = () => {
    const statusLabel = getSnackStatusLabel(snack.status);
    const isAvailable = snack.status === "AVAILABLE";

    return (
      <Badge variant="secondary" className={`text-xs ${isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
        {statusLabel}
      </Badge>
    );
  };

  // Badge danh mục (Food/Drink)
  const CategoryBadge = () => {
    const categoryLabel = getSnackCategoryLabel(snack.category);
    const isFood = snack.category === "FOOD";

    return (
      <Badge
        variant="secondary"
        className={`flex items-center gap-1 text-xs ${isFood ? "bg-blue-200 text-blue-800" : "bg-yellow-400 text-green-800"}`}
      >
        {isFood ? (
          <Icon icon="lucide:popcorn" className="text-shadow-background h-4 w-4" />
        ) : (
          <Icon icon="ri:drinks-2-line" className="text-shadow-background h-4 w-4" />
        )}
        {categoryLabel}
      </Badge>
    );
  };

  // Badge kích cỡ
  const SizeBadge = () => {
    const sizeLabel = getSnackSizeLabel(snack.size);
    let bgClass;

    switch (snack.size) {
      case "SMALL":
        bgClass = "bg-gray-200 text-gray-800";
        break;
      case "MEDIUM":
        bgClass = "bg-yellow-100 text-yellow-800";
        break;
      case "LARGE":
        bgClass = "bg-purple-100 text-purple-800";
        break;
      default:
        bgClass = "bg-gray-200 text-gray-800"; // Gán giá trị mặc định
    }

    return (
      <Badge variant="secondary" className={`text-xs ${bgClass}`}>
        {sizeLabel.toUpperCase()}
      </Badge>
    );
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const ActionButtons = ({ isFullWidth = false }: { isFullWidth?: boolean }) => (
    <>
      {onEdit && (
        <Button size="sm" variant="outline" onClick={() => onEdit(snack)} className={isFullWidth ? "flex-1" : "h-8 w-8 p-0"}>
          <Edit className={isFullWidth ? "mr-1 h-3 w-3" : "h-4 w-4"} />
          {isFullWidth && "Chỉnh sửa"}
        </Button>
      )}
      {onDelete && (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(snack.id)}
          className={isFullWidth ? "flex-1" : "h-8 w-8 p-0 hover:border-red-200 hover:bg-red-50 hover:text-red-600"}
        >
          <Trash className={isFullWidth ? "mr-1 h-3 w-3" : "h-4 w-4"} />
          {isFullWidth && "Xóa"}
        </Button>
      )}
    </>
  );

  // Grid View Image
  const GridImageComponent = () => (
    <div className="flex-shrink-0">
      {snack.img ? (
        <img
          src={snack.img}
          alt={snack.name}
          className="h-32 w-full rounded-lg border border-gray-200 object-cover"
          style={{ aspectRatio: "5 / 4" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-food.jpg";
          }}
        />
      ) : (
        <div className="flex h-32 w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
          <Utensils className="h-8 w-8 text-gray-400" />
          <span className="mt-2 text-sm text-gray-500">Không có hình ảnh</span>
        </div>
      )}
    </div>
  );

  // List View Image
  const ListImageComponent = () => (
    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
      {snack.img ? (
        <img
          src={snack.img}
          alt={snack.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-food.jpg";
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center border border-gray-200 bg-gray-100">
          <Utensils className="h-6 w-6 text-gray-400" />
        </div>
      )}
    </div>
  );

  // Grid View
  if (viewMode === "grid") {
    return (
      <Card className={cn("w-full max-w-md p-4 transition-all duration-200 hover:shadow-lg")}>
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <CardTitle className="line-clamp-2 text-xl font-bold">{snack.name}</CardTitle>
            <div className="flex items-center gap-2">
              <CategoryBadge />
              <StatusBadge />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 p-0">
          <div className="grid grid-cols-2 gap-2">
            <GridImageComponent />
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">ID</span>
                <span className="font-medium">#{snack.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Giá</span>
                <span className="text-lg font-bold text-green-600">{formatPrice(snack.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Kích cỡ</span>
                <SizeBadge />
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Hương vị:</p>
                <p className="text-sm text-blue-600">{snack.flavor || "Không có"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-green-50 p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Utensils className="mt-1 h-4 w-4" />
              <p className="text-sm font-semibold">Mô tả:</p>
            </div>
            <div className="flex items-start gap-2">
              <p className="text-sm italic leading-relaxed text-green-600">{snack.description}</p>
            </div>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex justify-end gap-1">
              <ActionButtons isFullWidth={true} />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // List View
  return (
    <Card className="w-full transition-all duration-200 hover:bg-gray-50">
      <CardContent className="flex items-center gap-4 p-4">
        <ListImageComponent />
        <div className="grid flex-1 grid-cols-12 items-center gap-2 text-sm">
          <div className="col-span-3 flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <CategoryBadge />
              <StatusBadge />
            </div>
            <h3 className="line-clamp-1 font-semibold">{snack.name}</h3>
            <p className="text-xs text-gray-500">ID: #{snack.id}</p>
          </div>
          <div className="col-span-2 line-clamp-1 flex items-center gap-1">
            <Utensils className="h-4 w-4 text-blue-600" />
            <span>Hương vị:</span>
            <span className="italic text-blue-600">{snack.flavor || "Không có"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            <p className="text-sm font-semibold">Mô tả:</p>
          </div>
          <div className="col-span-2 flex items-start gap-2">
            <p className="text-sm italic leading-relaxed text-green-600">{snack.description}</p>
          </div>
          <div className="col-span-1">
            <SizeBadge />
          </div>
          <div className="col-span-1 font-bold text-green-600">{formatPrice(snack.price)}</div>
          <div className="col-span-2 flex justify-end gap-1">
            <ActionButtons isFullWidth={false} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SnackCard;
