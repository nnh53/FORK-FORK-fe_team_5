import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Shadcn/ui/tooltip";
import type { Combo } from "@/interfaces/combo.interface";
import { calculateComboPriceWithQuantity, formatPrice, getComboStatusLabel, type ComboStatus } from "@/services/comboService";
import { cn } from "@/utils/utils";
import { Edit, Eye, Utensils } from "lucide-react";

interface ComboCardProps {
  combo: Combo;
  onEdit?: (combo: Combo) => void;
  onDelete?: (id: number) => void;
  onViewDetails?: (combo: Combo) => void;
  viewMode?: "grid" | "list";
}

const ComboCard: React.FC<ComboCardProps> = ({ combo, onEdit, onDelete, onViewDetails, viewMode = "grid" }) => {
  const getDisplayPrice = (isList = false) => {
    if (!combo.price && combo.price !== 0) {
      return <div className={`whitespace-nowrap text-green-600 ${isList ? "text-base" : "text-lg"} font-bold`}>Chưa cập nhật</div>;
    }

    // Format price with consistent spacing
    const formatPriceConsistent = (price: number) => {
      const formatted = formatPrice(price);
      return formatted; // Remove the space and VND suffix
    };

    // Khi có giảm giá và có snacks, hiển thị cả giá gốc (tổng giá snack) và giá sau giảm (từ database)
    if (combo.discount && combo.discount > 0 && combo.snacks && combo.snacks.length > 0) {
      // Tính lại giá gốc bằng tổng giá snack thay vì cộng giảm giá
      const originalPrice = calculateComboPriceWithQuantity(combo.snacks);
      const finalPrice = combo.price || 0; // Giá trong database đã trừ giảm giá

      // Chỉ hiển thị giá gốc nếu nó lớn hơn giá sau giảm giá
      if (originalPrice > finalPrice) {
        // Hiển thị giá với nowrap để tránh VND xuống dòng
        const formattedFinalPrice = formatPriceConsistent(finalPrice);
        const formattedOriginalPrice = formatPriceConsistent(originalPrice);

        return (
          <div className={`flex flex-col ${isList ? "items-start" : "items-end"}`}>
            <div className={`whitespace-nowrap text-green-600 ${isList ? "text-base" : "text-lg"} font-bold`}>{formattedFinalPrice}</div>
            <div className="text-xs whitespace-nowrap text-gray-500 line-through">{formattedOriginalPrice}</div>
          </div>
        );
      }
    }

    // Khi không có giảm giá hoặc không có snack, hiển thị giá trực tiếp từ database
    const formattedPrice = formatPriceConsistent(combo.price || 0);
    return <div className={`whitespace-nowrap text-green-600 ${isList ? "text-base" : "text-lg"} font-bold`}>{formattedPrice}</div>;
  };
  // Badge trạng thái
  const StatusBadge = () => {
    const statusLabel = getComboStatusLabel(combo.status as ComboStatus);
    const isAvailable = combo.status === "AVAILABLE";

    return (
      <Badge variant="secondary" className={`text-xs ${isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
        {statusLabel}
      </Badge>
    );
  };

  const ActionButtons = ({ isFullWidth = false }: { isFullWidth?: boolean }) => {
    // Define common button classes for consistent sizing with fixed heights
    const iconBtnClass = "h-8 w-8 p-0 flex items-center justify-center";

    // Use renderButton helper to simplify button rendering
    const renderButton = (key: string, icon: React.ReactNode, tooltip: string, onClick: () => void, isDelete: boolean) => {
      let buttonClass = iconBtnClass;

      if (isDelete) {
        buttonClass = `${iconBtnClass} text-red-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600`;
      }

      return (
        <Tooltip key={key}>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline" onClick={onClick} className={buttonClass}>
              {icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      );
    };

    return (
      <div className={`flex ${isFullWidth ? "w-full justify-end" : "justify-end"} min-h-[32px] gap-1`}>
        {onViewDetails && renderButton("view", <Eye className="h-4 w-4" />, "Chi tiết thực phẩm trong combo", () => onViewDetails(combo), false)}

        {onEdit && renderButton("edit", <Edit className="h-4 w-4" />, "Chỉnh sửa", () => onEdit(combo), false)}
      </div>
    );
  };

  const GridImageComponent = () => (
    <div className="flex-shrink-0">
      {combo.img ? (
        <img
          src={combo.img}
          alt={combo.name}
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
  );

  const ListImageComponent = () => (
    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
      {combo.img ? (
        <img
          src={combo.img}
          alt={combo.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            const imgElement = e.target as HTMLImageElement;
            imgElement.src = "/placeholder-food.jpg";
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
  );

  if (viewMode === "grid") {
    return (
      <Card className={cn("flex h-[450px] w-full max-w-md flex-col p-4 transition-all duration-200 hover:shadow-lg")}>
        <CardHeader className="flex-shrink-0 p-0 pb-2">
          <div className="flex flex-col">
            <div className="flex items-center justify-end gap-1">
              <Badge variant="secondary" className="bg-yellow-100 text-xs font-medium text-gray-700">
                ID: #{combo.id || "N/A"}
              </Badge>
              <StatusBadge />
              <Badge variant="outline" className="text-xs font-medium">
                {combo.snacks?.length || 0} món
              </Badge>
            </div>
            <div className="mt-1 flex items-start justify-between">
              <div className="max-w-[65%] space-y-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CardTitle className="line-clamp-1 cursor-default text-xl font-bold">{combo.name}</CardTitle>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{combo.name}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="pl-2 text-right">{getDisplayPrice(false)}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-grow flex-col p-0 pt-1">
          {/* Main content wrapper with flex-grow to push the buttons to the bottom */}
          <div className="flex flex-grow flex-col gap-2">
            {/* Fixed size image section */}
            <div className="flex-shrink-0">
              <GridImageComponent />
            </div>

            {/* Dynamic content that will expand to fill available space */}
            <div className="flex flex-grow flex-col">
              {combo.description && (
                <div className="mb-2 rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-green-50 p-2 shadow-sm">
                  <div className="mb-0.5 flex items-center gap-1">
                    <Utensils className="h-3 w-3" />
                    <p className="text-xs font-semibold">Mô tả:</p>
                  </div>
                  <p className="line-clamp-2 text-xs leading-snug text-green-600 italic">{combo.description}</p>
                </div>
              )}

              {/* Snack Preview */}
              {combo.snacks && combo.snacks.length > 0 && (
                <div className="flex-grow">
                  <p className="mb-0.5 text-xs font-medium text-gray-500">Bao gồm:</p>
                  <div className="flex flex-wrap gap-1">
                    {combo.snacks.slice(0, 3).map(
                      (comboSnack, index) =>
                        comboSnack.snack && (
                          <div key={index} className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs">
                            {comboSnack.snack.img ? (
                              <div className="h-4 w-4 flex-shrink-0 overflow-hidden rounded-full">
                                <img src={comboSnack.snack.img} alt={comboSnack.snack.name} className="h-full w-full object-cover" />
                              </div>
                            ) : (
                              <Utensils className="h-3 w-3 flex-shrink-0 text-blue-500" />
                            )}
                            <span className="max-w-[80px] truncate text-blue-700">{comboSnack.snack.name}</span>
                            <span className="flex-shrink-0 text-blue-500">x{comboSnack.quantity || 1}</span>
                          </div>
                        ),
                    )}
                    {combo.snacks.length > 3 && (
                      <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                        <span className="text-gray-700">+{combo.snacks.length - 3} món khác</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fixed height action button section */}
          <div className="mt-auto flex-shrink-0">
            <ActionButtons isFullWidth={true} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full transition-all duration-200 hover:bg-gray-50">
      <CardContent className="flex items-center gap-3 p-3">
        <ListImageComponent />
        <div className="grid flex-1 grid-cols-12 items-center gap-2 text-sm">
          <div className="col-span-6 flex flex-col gap-1 sm:col-span-6 md:col-span-4">
            <div className="mb-1 flex flex-row gap-2">
              <Badge variant="secondary" className="bg-yellow-100 text-xs font-medium text-gray-700">
                ID: #{combo.id || "N/A"}
              </Badge>
              <StatusBadge />
              <Badge variant="outline" className="text-xs font-medium">
                {combo.snacks?.length || 0} món
              </Badge>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className="line-clamp-1 max-w-[90%] cursor-default font-semibold">{combo.name}</h3>
              </TooltipTrigger>
              <TooltipContent>
                <p>{combo.name}</p>
              </TooltipContent>
            </Tooltip>
            <div className="text-left">{getDisplayPrice(true)}</div>
          </div>

          {/* Snack Preview for medium+ screens */}
          <div className="hidden sm:col-span-4 sm:block md:col-span-3">
            {combo.snacks && combo.snacks.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {combo.snacks.slice(0, 2).map(
                  (comboSnack, index) =>
                    comboSnack.snack && (
                      <div key={index} className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs">
                        {comboSnack.snack.img ? (
                          <div className="h-3 w-3 flex-shrink-0 overflow-hidden rounded-full">
                            <img src={comboSnack.snack.img} alt={comboSnack.snack.name} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <Utensils className="h-2 w-2 flex-shrink-0 text-blue-500" />
                        )}
                        <span className="max-w-[60px] truncate text-blue-700">{comboSnack.snack.name}</span>
                        <span className="flex-shrink-0 text-blue-500">x{comboSnack.quantity || 1}</span>
                      </div>
                    ),
                )}
                {combo.snacks.length > 2 && (
                  <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    <span className="text-gray-700">+{combo.snacks.length - 2} món khác</span>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-xs text-gray-500 italic">Không có món ăn</span>
            )}
          </div>

          <div className="line-clamp-1 hidden text-sm text-gray-600 italic lg:col-span-3 lg:block">{combo.description || "Không có mô tả"}</div>
          <div className="col-span-6 flex justify-end sm:col-span-2 md:col-span-5 lg:col-span-2">
            <ActionButtons />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComboCard;
