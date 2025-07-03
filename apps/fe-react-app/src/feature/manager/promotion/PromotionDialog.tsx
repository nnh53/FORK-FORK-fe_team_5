import { Button } from "@/components/Shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import type { Promotion } from "@/interfaces/promotion.interface";
import React from "react";
import { PromotionForm } from "./PromotionForm";

interface PromotionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedPromotion?: Promotion;
  setSelectedPromotion: (promotion?: Promotion) => void;
  onSuccess?: () => void;
}

export const PromotionDialog: React.FC<PromotionDialogProps> = ({ open, setOpen, selectedPromotion, setSelectedPromotion, onSuccess }) => {
  const handleSuccess = () => {
    // Clear selected promotion and close dialog
    setSelectedPromotion(undefined);
    setOpen(false);

    // Call the parent success handler if provided
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleClose = () => {
    setSelectedPromotion(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-2x1 max-h-[90vh] min-w-[50%] overflow-y-auto"
        onCloseAutoFocus={() => {
          setSelectedPromotion(undefined);
        }}
      >
        <DialogHeader>
          <DialogTitle>{selectedPromotion ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}</DialogTitle>
        </DialogHeader>
        <PromotionForm selectedPromotion={selectedPromotion} onSuccess={handleSuccess} />
        <DialogFooter className="mt-4">
          <Button onClick={handleClose} variant="outline">
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
