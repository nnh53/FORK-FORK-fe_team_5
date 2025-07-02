import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import type { Combo } from "@/interfaces/combo.interface";
import { calculateComboPrice, formatPrice, getComboStatusLabel } from "@/services/comboService";
import { cn } from "@/utils/utils";
import { Edit, Eye, Trash, Utensils } from "lucide-react";

interface ComboCardProps {
  combo: Combo;
  onEdit?: (combo: Combo) => void;
  onDelete?: (id: number) => void;
  onViewDetails?: (combo: Combo) => void;
  viewMode?: "grid" | "list";
}

const ComboCard: React.FC<ComboCardProps> = ({ combo, onEdit, onDelete, onViewDetails, viewMode = "grid" }) => {
  // Badge trạng thái
  const StatusBadge = () => {
    const statusLabel = getComboStatusLabel(combo.status);
    const isAvailable = combo.status === "AVAILABLE";

    return (
      <Badge variant="secondary" className={`text-xs ${isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
        {statusLabel}
      </Badge>
    );
  };

  const totalPrice = calculateComboPrice(combo);

  const ActionButtons = ({ isFullWidth = false }: { isFullWidth?: boolean }) => (
    <>
      {onViewDetails && (
        <Button size="sm" variant="outline" onClick={() => onViewDetails(combo)} className={isFullWidth ? "flex-1" : "h-8 w-8 p-0"}>
          <Eye className={isFullWidth ? "h-3 w-3 mr-1" : "h-4 w-4"} />
          {isFullWidth && "Chi tiết"}
        </Button>
      )}
      {onEdit && (
        <Button size="sm" variant="outline" onClick={() => onEdit(combo)} className={isFullWidth ? "flex-1" : "h-8 w-8 p-0"}>
          <Edit className={isFullWidth ? "h-3 w-3 mr-1" : "h-4 w-4"} />
          {isFullWidth && "Chỉnh sửa"}
        </Button>
      )}
      {onDelete && (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(combo.id)}
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
      {combo.img ? (
        <img
          src={combo.img}
          alt={combo.name}
          className="w-full h-32 object-cover rounded-lg border border-gray-200"
          style={{ aspectRatio: "5 / 4" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-combo.jpg";
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
      {combo.img ? (
        <img
          src={combo.img}
          alt={combo.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-combo.jpg";
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
        <CardHeader className="p-0 pb-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">{combo.name}</CardTitle>
              <div className="flex gap-1 flex-wrap">
                <StatusBadge />
                <Badge variant="outline" className="text-xs font-medium">
                  {combo.snacks?.length || 0} món
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">{formatPrice(totalPrice)}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 space-y-3">
          <GridImageComponent />

          {combo.description && <div className="text-sm text-gray-600 line-clamp-2">{combo.description}</div>}

          <div className="flex gap-2 pt-2 justify-end">
            <ActionButtons />
          </div>
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
          <div className="col-span-4">
            <div className="font-medium">{combo.name}</div>
            <div className="flex gap-1 mt-1">
              <StatusBadge />
            </div>
          </div>
          <div className="col-span-2 text-gray-600">{combo.snacks?.length || 0} món</div>
          <div className="col-span-3 text-gray-600 line-clamp-1">{combo.description || "Không có mô tả"}</div>
          <div className="col-span-2 font-semibold text-primary">{formatPrice(totalPrice)}</div>
          <div className="col-span-1 flex justify-end gap-1">
            <ActionButtons />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComboCard;
