import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Shadcn/ui/tooltip";
import type { Snack } from "@/interfaces/snacks.interface";
import {
  getSnackCategoryLabel,
  getSnackSizeLabel,
  getSnackStatusLabel,
  type SnackCategory,
  type SnackSize,
  type SnackStatus,
} from "@/services/snackService";
import { formatVND } from "@/utils/currency.utils";
import { cn } from "@/utils/utils";
import { Icon } from "@iconify/react";
import { Edit, Trash, Utensils } from "lucide-react";
interface SnackCardProps {
  snack: Snack;
  onEdit?: (snack: Snack) => void;
  onDelete?: (id: number) => void;
  viewMode?: "grid" | "list";
}

// Badge trạng thái
const StatusBadge = ({ snack }: { snack: Snack | null | undefined }) => {
  // Check if snack is null or undefined before accessing properties
  if (snack?.status === undefined) {
    return (
      <Badge variant="secondary" className="bg-gray-100 text-xs text-gray-800">
        N/A
      </Badge>
    );
  }

  const statusLabel = getSnackStatusLabel(snack.status as SnackStatus);
  const isAvailable = snack.status === "AVAILABLE";

  return (
    <Badge variant="secondary" className={`text-xs ${isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
      {statusLabel}
    </Badge>
  );
};

// Badge danh mục (Food/Drink)
const CategoryBadge = ({ snack }: { snack: Snack | null | undefined }) => {
  // Check if snack is null or undefined before accessing properties
  if (snack?.category === undefined) {
    return (
      <Badge variant="secondary" className="bg-gray-100 text-xs text-gray-800">
        N/A
      </Badge>
    );
  }

  const categoryLabel = getSnackCategoryLabel(snack.category as SnackCategory);
  const isFood = snack.category === "FOOD";

  return (
    <Badge variant="secondary" className={`flex items-center gap-1 text-xs ${isFood ? "bg-blue-200 text-blue-800" : "bg-yellow-400 text-green-800"}`}>
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
const SizeBadge = ({ snack }: { snack: Snack | null | undefined }) => {
  // Handle case when size is undefined
  if (snack?.size === undefined) {
    return (
      <Badge variant="secondary" className="bg-gray-200 text-xs text-gray-800">
        N/A
      </Badge>
    );
  }

  const sizeLabel = getSnackSizeLabel(snack.size as SnackSize);
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
      break;
  }

  return (
    <Badge variant="secondary" className={`text-xs ${bgClass}`}>
      {sizeLabel ? sizeLabel.toUpperCase() : "N/A"}
    </Badge>
  );
};

interface ActionButtonsProps {
  snack: Snack;
  onEdit?: (snack: Snack) => void;
  onDelete?: (id: number) => void;
  isFullWidth?: boolean;
}

const ActionButtons = ({ snack, onEdit, onDelete, isFullWidth = false }: ActionButtonsProps) => (
  <div className={`flex ${isFullWidth ? "w-full" : ""} h-8 gap-1`}>
    {onEdit && (
      <Button
        size="sm"
        variant="outline"
        onClick={() => onEdit(snack)}
        className={isFullWidth ? "flex h-8 flex-1 items-center justify-center" : "flex h-8 w-8 items-center justify-center p-0"}
      >
        <Edit className={isFullWidth ? "mr-1 h-3 w-3" : "h-4 w-4"} />
        {isFullWidth && "Chỉnh sửa"}
      </Button>
    )}
    {onDelete && (
      <Button
        size="sm"
        variant={isFullWidth ? "destructive" : "outline"}
        onClick={() => onDelete(snack.id ?? 0)}
        className={
          isFullWidth
            ? "flex h-8 flex-1 items-center justify-center"
            : "flex h-8 w-8 items-center justify-center p-0 text-red-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        }
      >
        <Trash className={isFullWidth ? "mr-1 h-3 w-3" : "h-4 w-4"} />
        {isFullWidth && "Xóa"}
      </Button>
    )}
  </div>
);

const SnackCard: React.FC<SnackCardProps> = ({ snack, onEdit, onDelete, viewMode = "grid" }) => {
  console.log("Rendering SnackCard with data:", snack);
  // Grid View
  if (viewMode === "grid") {
    return (
      <Card className={cn("flex h-[400px] w-full max-w-md flex-col p-4 transition-all duration-200 hover:shadow-lg")}>
        <CardHeader className="flex-shrink-0 p-0">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-end gap-2">
              <CategoryBadge snack={snack} />
              <StatusBadge snack={snack} />
            </div>
            {/* Thiết kế lại phần tiêu đề với giới hạn chiều rộng chặt chẽ hơn */}
            <div className="w-full overflow-hidden">
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle className="line-clamp-1 overflow-hidden text-xl font-bold">{snack?.name || "Unknown Snack"}</CardTitle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{snack?.name || "Unknown Snack"}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>

        {/* Main content with flex-grow to push buttons to bottom */}
        <CardContent className="flex flex-grow flex-col space-y-2 p-0">
          <div className="grid flex-shrink-0 grid-cols-2 gap-2">
            <div className="flex-shrink-0">
              {snack?.img ? (
                <img
                  src={snack.img}
                  alt={snack?.name || "Snack image"}
                  className="h-32 w-full rounded-lg border border-gray-200 object-cover"
                  style={{ aspectRatio: "5 / 4" }}
                  onError={(e) => {
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.src = "/placeholder-food.jpg";
                    // Fallback to a generic icon if the placeholder also fails
                    imgElement.onerror = () => {
                      const parent = imgElement.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="flex h-32 w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-gray-400">
                              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                              <path d="M7 2v20"></path>
                              <path d="M21 15V2"></path>
                              <path d="M18 15c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h3v-6h-3Z"></path>
                            </svg>
                            <span class="mt-2 text-sm text-gray-500">Không có hình ảnh</span>
                          </div>
                        `;
                      }
                    };
                  }}
                />
              ) : (
                <div className="flex h-32 w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
                  <Utensils className="h-8 w-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Không có hình ảnh</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">ID</span>
                <span className="font-medium">#{snack?.id || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Giá</span>
                <span className="text-lg font-bold text-green-600">{snack?.price ? formatVND(snack.price) : "N/A"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Kích cỡ</span>
                <SizeBadge snack={snack} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Hương vị</span>
                <span className="max-w-[120px] truncate text-sm text-blue-600" title={snack?.flavor || "Không có"}>
                  {snack?.flavor || "Không có"}
                </span>
              </div>
            </div>
          </div>

          {/* Flexible content area with overflow handling */}
          <div className="flex-grow overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-green-50 p-4 shadow-sm">
            <div className="mb-1 flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              <p className="text-sm font-semibold">Mô tả:</p>
            </div>
            <p className="line-clamp-2 overflow-hidden text-sm leading-relaxed text-green-600 italic">{snack?.description || "Không có mô tả"}</p>
          </div>

          {/* Fixed-position action buttons always at the bottom */}
          {(onEdit || onDelete) && (
            <div className="mt-auto flex flex-shrink-0 gap-1">
              <ActionButtons snack={snack} onEdit={onEdit} onDelete={onDelete} isFullWidth={true} />
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
        {/* List View Image Inline */}
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
          {snack?.img ? (
            <img
              src={snack.img}
              alt={snack?.name || "Snack image"}
              className="h-full w-full object-cover"
              onError={(e) => {
                const imgElement = e.target as HTMLImageElement;
                imgElement.src = "/placeholder-food.jpg";
                // Fallback to a generic icon if the placeholder also fails
                imgElement.onerror = () => {
                  const parent = imgElement.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="flex h-full w-full items-center justify-center border border-gray-200 bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-gray-400">
                          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                          <path d="M7 2v20"></path>
                          <path d="M21 15V2"></path>
                          <path d="M18 15c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h3v-6h-3Z"></path>
                        </svg>
                      </div>
                    `;
                  }
                };
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center border border-gray-200 bg-gray-100">
              <Utensils className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>

        {/* Grid layout with better text handling */}
        <div className="grid flex-1 grid-cols-12 items-center gap-2 text-sm">
          <div className="col-span-6 flex flex-col gap-1 overflow-hidden sm:col-span-4 md:col-span-3 lg:col-span-2">
            <div className="mb-1 flex flex-wrap gap-1">
              <CategoryBadge snack={snack} />
              <StatusBadge snack={snack} />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full overflow-hidden pr-2">
                  <h3 className="w-full truncate font-semibold" title={snack?.name || "Unknown Snack"}>
                    {snack?.name || "Unknown Snack"}
                  </h3>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[300px] break-words">{snack?.name || "Unknown Snack"}</p>
              </TooltipContent>
            </Tooltip>
            <p className="text-xs text-gray-500">ID: #{snack?.id ?? "N/A"}</p>
          </div>

          {/* Flavor with ellipsis for long text */}
          <div className="line-clamp-1 hidden items-center lg:col-span-2 lg:block">
            <span className="text-gray-500">Hương vị: </span>
            <span className="inline-block max-w-[80%] truncate text-blue-600 italic" title={snack?.flavor || "Không có"}>
              {snack?.flavor || "Không có"}
            </span>
          </div>

          {/* Description with ellipsis for long text */}
          <div className="hidden sm:col-span-5 sm:block md:col-span-5 lg:col-span-4">
            <p className="line-clamp-1 text-sm text-green-600 italic" title={snack?.description || "Không có mô tả"}>
              {snack?.description || "Không có mô tả"}
            </p>
          </div>

          <div className="hidden md:col-span-1 md:block lg:col-span-1">
            <SizeBadge snack={snack} />
          </div>

          {/* Price with consistent formatting */}
          <div className="col-span-3 text-left font-bold whitespace-nowrap text-green-600 sm:col-span-1 md:col-span-1 lg:col-span-1">
            {snack?.price ? formatVND(snack.price) : "N/A"}
          </div>

          {/* Action buttons with fixed height */}
          <div className="col-span-3 flex h-8 justify-end gap-1 sm:col-span-2 md:col-span-2 lg:col-span-2">
            <ActionButtons snack={snack} onEdit={onEdit} onDelete={onDelete} isFullWidth={false} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SnackCard;
