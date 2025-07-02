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
}

export const PromotionDialog: React.FC<PromotionDialogProps> = ({ open, setOpen, selectedPromotion, setSelectedPromotion }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-2x1 min-w-[50%]"
        onCloseAutoFocus={() => {
          setSelectedPromotion(undefined);
        }}
      >
        <DialogHeader>
          <DialogTitle>{selectedPromotion ? "Edit Promotion" : "Add New Promotion"}</DialogTitle>
        </DialogHeader>
        <PromotionForm selectedPromotion={selectedPromotion} />
        <DialogFooter className="mt-4">
          <Button
            onClick={() => {
              setSelectedPromotion(undefined);
              setOpen(false);
            }}
            variant="outline"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
