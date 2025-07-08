import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import PromotionSelection from "@/feature/booking/components/PromotionSelection/PromotionSelection";
import type { Combo } from "@/interfaces/combo.interface";
import type { Promotion } from "@/interfaces/promotion.interface";
import type { Snack } from "@/interfaces/snacks.interface";
import { ShoppingCart, Tag } from "lucide-react";
import React from "react";
import ComboSelection from "../../../booking/components/ComboSelection/ComboSelection";
import SnackList from "../../../booking/components/SnackList/SnackList";

interface SnackSelectionProps {
  combos: Combo[];
  snacks: Snack[];
  promotions: Promotion[];
  selectedCombos: Array<{ combo: Combo; quantity: number }>;
  selectedSnacks: Record<number, number>;
  selectedPromotion: Promotion | null;
  combosLoading: boolean;
  promotionsLoading: boolean;
  orderAmount: number;
  onComboSelect: (combo: Combo, quantity: number) => void;
  onSnackQuantityChange: (snackId: number, quantity: number) => void;
  onPromotionSelect: (promotion: Promotion | null) => void;
  onBack: () => void;
  onNext: () => void;
}

const SnackSelection: React.FC<SnackSelectionProps> = ({
  combos,
  snacks,
  promotions,
  selectedCombos,
  selectedSnacks,
  selectedPromotion,
  combosLoading,
  promotionsLoading,
  orderAmount,
  onComboSelect,
  onSnackQuantityChange,
  onPromotionSelect,
  onBack,
  onNext,
}) => {
  return (
    <div className="space-y-6">
      {/* Snacks & Combos Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Chọn Bắp Nước & Combo
          </CardTitle>
          <p className="text-sm text-gray-600">Chọn thêm bắp nước, nước uống và combo cho khách hàng (tùy chọn)</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Shared Combo Selection Component */}
          <ComboSelection combos={combos} selectedCombos={selectedCombos} onComboSelect={onComboSelect} loading={combosLoading} />

          {/* Shared Snack List Component */}
          <SnackList snacks={snacks} selectedSnacks={selectedSnacks} onQuantityChange={onSnackQuantityChange} />
        </CardContent>
      </Card>

      {/* Promotion Selection Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Chọn Khuyến Mãi
          </CardTitle>
          <p className="text-sm text-gray-600">Áp dụng khuyến mãi cho đơn hàng (tùy chọn)</p>
        </CardHeader>
        <CardContent>
          <PromotionSelection
            promotions={promotions}
            selectedPromotion={selectedPromotion}
            onPromotionSelect={onPromotionSelect}
            orderAmount={orderAmount}
            loading={promotionsLoading}
            disabled={false}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Quay lại
        </Button>
        <Button onClick={onNext}>Tiếp tục</Button>
      </div>
    </div>
  );
};

export default SnackSelection;
