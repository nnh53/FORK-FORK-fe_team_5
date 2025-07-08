import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Separator } from "@/components/Shadcn/ui/separator";
import type { Promotion } from "@/interfaces/promotion.interface";
import { calculateDiscount, formatCurrency, formatPromotionDate, isPromotionActive } from "@/services/promotionService";
import { Gift, Tag } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface PromotionSelectionProps {
  promotions: Promotion[];
  selectedPromotion?: Promotion | null;
  onPromotionSelect: (promotion: Promotion | null) => void;
  orderAmount: number;
  loading?: boolean;
  disabled?: boolean;
}

const PromotionSelection: React.FC<PromotionSelectionProps> = ({
  promotions,
  selectedPromotion,
  onPromotionSelect,
  orderAmount,
  loading = false,
  disabled = false,
}) => {
  // Filter active promotions that are applicable for the current order
  const applicablePromotions = promotions.filter((promotion) => isPromotionActive(promotion) && orderAmount >= promotion.minPurchase);

  const handlePromotionSelect = (promotion: Promotion) => {
    if (disabled) {
      toast.warning("Vui lòng chọn ghế trước khi áp dụng khuyến mãi");
      return;
    }

    if (selectedPromotion?.id === promotion.id) {
      onPromotionSelect(null); // Deselect if already selected
      toast.info("Đã bỏ chọn khuyến mãi");
    } else {
      const discountAmount = calculateDiscount(promotion, orderAmount);
      onPromotionSelect(promotion);
      toast.success(`Đã áp dụng khuyến mãi "${promotion.title}" - Tiết kiệm ${formatCurrency(discountAmount)}`);
    }
  };

  const getDiscountAmount = (promotion: Promotion) => {
    return calculateDiscount(promotion, orderAmount);
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Khuyến mãi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-red-600"></div>
            <span className="ml-2">Đang tải khuyến mãi...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Khuyến mãi
          {applicablePromotions.length > 0 && <Badge variant="secondary">{applicablePromotions.length} áp dụng được</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {applicablePromotions.length === 0 ? (
          <div className="py-8 text-center">
            <Tag className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="mb-2 text-gray-500">Không có khuyến mãi áp dụng</p>
            <p className="text-sm text-gray-400">
              {orderAmount > 0 ? `Tổng đơn hàng hiện tại: ${formatCurrency(orderAmount)}` : "Vui lòng chọn ghế để xem khuyến mãi có thể áp dụng"}
            </p>
          </div>
        ) : (
          <div className="max-h-96 space-y-3 overflow-y-auto">
            {applicablePromotions.map((promotion) => {
              const discountAmount = getDiscountAmount(promotion);
              const isSelected = selectedPromotion?.id === promotion.id;

              // Determine container class based on state
              let containerClass = "border-gray-200 hover:border-red-300 hover:bg-gray-50";
              if (disabled) {
                containerClass = "opacity-50 cursor-not-allowed";
              } else if (isSelected) {
                containerClass = "border-red-500 bg-red-50";
              }

              return (
                <div
                  key={promotion.id}
                  className={`cursor-pointer rounded-lg border p-4 transition-all ${containerClass}`}
                  onClick={() => handlePromotionSelect(promotion)}
                >
                  <div className="flex items-start gap-3">
                    {/* Promotion Image/Icon */}
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600">
                      {promotion.image ? (
                        <img
                          src={promotion.image}
                          alt={promotion.title}
                          className="h-full w-full rounded-lg object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const nextElement = target.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.classList.remove("hidden");
                            }
                          }}
                        />
                      ) : null}
                      <Gift className={`h-8 w-8 text-white ${promotion.image ? "hidden" : ""}`} />
                    </div>

                    {/* Promotion Details */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="truncate font-medium text-gray-900">{promotion.title}</h3>
                        <Badge variant={promotion.type === "PERCENTAGE" ? "default" : "secondary"}>
                          {promotion.type === "PERCENTAGE" ? `${promotion.discountValue}%` : formatCurrency(promotion.discountValue)}
                        </Badge>
                      </div>

                      <p className="mb-3 text-sm text-gray-600">{promotion.description}</p>

                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <span>Áp dụng từ {formatCurrency(promotion.minPurchase)}</span>
                        </div>
                        <div className="text-sm font-medium text-green-600">Tiết kiệm: {formatCurrency(discountAmount)}</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-400">Hết hạn: {formatPromotionDate(promotion.endTime)}</div>
                        {isSelected && (
                          <Badge variant="default" className="text-xs">
                            Đã chọn
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Promotion Summary */}
        {selectedPromotion && (
          <>
            <Separator className="my-4" />
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Khuyến mãi đã chọn</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePromotionSelect(selectedPromotion)}
                  className="text-green-600 hover:text-green-800"
                >
                  Bỏ chọn
                </Button>
              </div>
              <p className="mt-1 text-sm text-green-700">
                {selectedPromotion.title} - Tiết kiệm {formatCurrency(getDiscountAmount(selectedPromotion))}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PromotionSelection;
