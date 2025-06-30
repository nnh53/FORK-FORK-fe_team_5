import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import type { Snack } from "@/interfaces/snacks.interface";
import { cn } from "@/utils/utils";
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
    if (snack.status === "UNAVAILABLE") {
      return (
        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-800">
          Ngừng bán
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
        Có sẵn
      </Badge>
    );
  };

  // Badge danh mục (Food/Drink)
  const CategoryBadge = () => {
    if (snack.category === "FOOD")
      return (
        <Badge variant="secondary" className="text-xs bg-blue-200 text-blue-800">
          FOOD
        </Badge>
      );
    if (snack.category === "DRINK")
      return (
        <Badge variant="secondary" className="text-xs bg-yellow-400 text-green-800">
          DRINK
        </Badge>
      );
    return null;
  };

  // Badge kích cỡ
  const SizeBadge = () => {
    switch (snack.size) {
      case "SMALL":
        return (
          <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-800">
            NHỎ
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
            VỪA
          </Badge>
        );
      case "LARGE":
        return (
          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
            LỚN
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const ActionButtons = ({ isFullWidth = false }: { isFullWidth?: boolean }) => (
    <>
      {onEdit && (
        <Button size="sm" variant="outline" onClick={() => onEdit(snack)} className={isFullWidth ? "flex-1" : "h-8 w-8 p-0"}>
          <Edit className={isFullWidth ? "h-3 w-3 mr-1" : "h-4 w-4"} />
          {isFullWidth && "Chỉnh sửa"}
        </Button>
      )}
      {onDelete && (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(snack.id)}
          className={isFullWidth ? "flex-1" : "h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-200"}
        >
          <Trash className={isFullWidth ? "h-3 w-3 mr-1" : "h-4 w-4"} />
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
          className="w-full h-32 object-cover rounded-lg border border-gray-200"
          style={{ aspectRatio: "5 / 4" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-food.jpg";
          }}
        />
      ) : (
        <div className="w-full h-32 flex flex-col items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
          <Utensils className="h-8 w-8 text-gray-400" />
          <span className="text-sm text-gray-500 mt-2">Không có hình ảnh</span>
        </div>
      )}
    </div>
  );

  // List View Image
  const ListImageComponent = () => (
    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
      {snack.img ? (
        <img
          src={snack.img}
          alt={snack.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-food.jpg";
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 border border-gray-200">
          <Utensils className="h-6 w-6 text-gray-400" />
        </div>
      )}
    </div>
  );

  // Grid View
  if (viewMode === "grid") {
    return (
      <Card className={cn("w-full max-w-md transition-all duration-200 hover:shadow-lg p-4")}>
        <CardHeader className="p-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold line-clamp-2">{snack.name}</CardTitle>
            <div className="flex gap-2 items-center">
              <CategoryBadge />
              <StatusBadge />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 space-y-2">
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
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-semibold ">Hương vị:</p>
                <p className="text-sm text-blue-600">{snack.flavor || "Không có"}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-start gap-2">
              <Utensils className="h-4 w-4 text-green-600 mt-1" />
              <p className="text-sm font-semibold text-green-700">Mô tả:</p>
              <p className="text-sm italic text-green-600 leading-relaxed">{snack.description}</p>
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
      <CardContent className="p-4 flex items-center gap-4">
        <ListImageComponent />
        <div className="flex-1 grid grid-cols-12 gap-2 items-center text-sm">
          <div className="col-span-3 flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <CategoryBadge />
              <StatusBadge />
            </div>
            <h3 className="font-semibold line-clamp-1">{snack.name}</h3>
            <p className="text-xs text-gray-500">ID: #{snack.id}</p>
          </div>
          <div className="col-span-2 line-clamp-1 flex items-center gap-1">
            <Utensils className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-blue-700">Hương vị:</span>
            <span className="italic text-blue-600">{snack.flavor || "Không có"}</span>
          </div>
          <div className="col-span-2 line-clamp-1 flex items-center gap-1">
            <Utensils className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-700">Mô tả:</span>
            <span className="italic text-green-600">{snack.description}</span>
          </div>
          <div className="col-span-1">
            <SizeBadge />
          </div>
          <div className="col-span-1 font-bold text-green-600">{formatPrice(snack.price)}</div>
          <div className="col-span-3 flex justify-end gap-1">
            <ActionButtons isFullWidth={false} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SnackCard;
