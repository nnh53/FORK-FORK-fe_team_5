import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import type { Combo } from "@/interfaces/combo.interface";
import type { Snack } from "@/interfaces/snacks.interface";
import { ShoppingCart } from "lucide-react";
import React from "react";
import ComboSelection from "../../../booking/components/ComboSelection/ComboSelection";
import SnackList from "../../../booking/components/SnackList/SnackList";

interface SnackSelectionProps {
  combos: Combo[];
  snacks: Snack[];
  selectedCombos: Array<{ combo: Combo; quantity: number }>;
  selectedSnacks: Record<number, number>;
  combosLoading: boolean;
  onComboSelect: (combo: Combo, quantity: number) => void;
  onSnackQuantityChange: (snackId: number, quantity: number) => void;
  onBack: () => void;
  onNext: () => void;
}

const SnackSelection: React.FC<SnackSelectionProps> = ({
  combos,
  snacks,
  selectedCombos,
  selectedSnacks,
  combosLoading,
  onComboSelect,
  onSnackQuantityChange,
  onBack,
  onNext,
}) => {
  return (
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

        {/* Navigation */}
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="outline" onClick={onBack}>
            Quay lại
          </Button>
          <Button onClick={onNext}>Tiếp tục</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SnackSelection;
