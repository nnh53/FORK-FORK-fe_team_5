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
      <Badge variant="secondary" className={`text-xs ${isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
        {statusLabel}
      </Badge>
    );
  };

  const totalPrice = calculateComboPrice(combo);

  const ActionButtons = ({ isFullWidth = false }: { isFullWidth?: boolean }) => (
    <>
      {onViewDetails && (
        <Button size="sm" variant="outline" onClick={() => onViewDetails(combo)} className={isFullWidth ? "flex-1" : "h-8 w-8 p-0"}>
          <Eye className={isFullWidth ? "mr-1 h-3 w-3" : "h-4 w-4"} />
          {isFullWidth && "Chi tiết"}
        </Button>
      )}
      {onEdit && (
        <Button size="sm" variant="outline" onClick={() => onEdit(combo)} className={isFullWidth ? "flex-1" : "h-8 w-8 p-0"}>
          <Edit className={isFullWidth ? "mr-1 h-3 w-3" : "h-4 w-4"} />
          {isFullWidth && "Chỉnh sửa"}
        </Button>
      )}
      {onDelete && (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(combo.id)}
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
      {combo.img ? (
        <img
          src={combo.img}
          alt={combo.name}
          className="h-32 w-full rounded-lg border border-gray-200 object-cover"
          style={{ aspectRatio: "5 / 4" }}
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
      {combo.img ? (
        <img src={combo.img} alt={combo.name} className="h-full w-full object-cover" />
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
        <CardHeader className="p-0 pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">{combo.name}</CardTitle>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs font-medium">
                  ID: #{combo.id}
                </Badge>
                <StatusBadge />
                <Badge variant="outline" className="text-xs font-medium">
                  {combo.snacks?.length || 0} món
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-primary text-lg font-bold">{formatPrice(totalPrice)}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-0">
          <GridImageComponent />

          {combo.description && <div className="line-clamp-2 text-sm text-gray-600">{combo.description}</div>}

          <div className="flex justify-end gap-2 pt-2">
            <ActionButtons />
          </div>
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
          <div className="col-span-4">
            <div className="font-medium">{combo.name}</div>
            <div className="mt-1 flex gap-1">
              <StatusBadge />
            </div>
          </div>
          <div className="col-span-2 text-gray-600">{combo.snacks?.length || 0} món</div>
          <div className="col-span-3 line-clamp-1 text-gray-600">{combo.description || "Không có mô tả"}</div>
          <div className="text-primary col-span-2 font-semibold">{formatPrice(totalPrice)}</div>
          <div className="col-span-1 flex justify-end gap-1">
            <ActionButtons />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComboCard;
