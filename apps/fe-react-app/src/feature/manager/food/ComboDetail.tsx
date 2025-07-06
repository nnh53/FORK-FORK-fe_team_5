import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { ScrollArea } from "@/components/Shadcn/ui/scroll-area";
import { type Combo, type ComboSnack } from "@/interfaces/combo.interface";
import { type Snack } from "@/interfaces/snacks.interface";
import { calculateComboPrice, formatPrice, getComboStatusLabel } from "@/services/comboService";
import { Icon } from "@iconify/react";
import { Edit, ShoppingBag, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import ComboDetailForm from "./ComboDetailForm";
import SnackCard from "./snack/SnackCard";

interface ComboDetailProps {
  combo: Combo;
  open: boolean;
  onClose: () => void;
  onEdit?: (combo: Combo) => void;
  onDeleteSnack?: (comboSnackId: number) => void;
  onAddSnack?: (comboSnack: Partial<ComboSnack>) => void;
  onUpdateSnack?: (comboSnack: ComboSnack) => void;
}

// Create a fallback snack object for missing data
const createFallbackSnack = (): Snack => ({
  id: 0,
  name: "Unknown Snack",
  description: "No description available",
  price: 0,
  img: "",
  category: "FOOD",
  size: "MEDIUM",
  flavor: "",
  status: "AVAILABLE",
});

// Extracted helper functions to reduce cognitive complexity
const getGridColsClass = (snackCount: number): string => {
  if (snackCount <= 2) return "grid-cols-1 md:grid-cols-2";
  return "grid-cols-1 md:grid-cols-3"; // For 3+ we'll always enable horizontal scroll
};

const needsHorizontalScrollCheck = (snackCount: number): boolean => {
  return snackCount >= 3; // Enable horizontal scroll for 3 or more snacks
};

// Extracted SnackGrid component to reduce complexity
const SnackGrid = ({ snacks, needsScroll }: { snacks: ComboSnack[]; needsScroll: boolean }) => {
  const snackCount = snacks?.length || 0;
  return (
    <div
      className={`${needsScroll ? "custom-scrollbar overflow-x-auto" : ""}`}
      style={{
        width: "100%",
        position: "relative",
        overflowY: "hidden", // Tránh scroll dọc khi scroll ngang
      }}
    >
      {needsScroll && (
        <div className="absolute right-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-1 shadow-md">
          <Icon icon="lucide:chevrons-right" className="h-5 w-5 animate-pulse text-gray-500" />
        </div>
      )}
      <div
        className={`grid gap-4 ${getGridColsClass(snackCount)}`}
        style={{
          minWidth: needsScroll ? "960px" : "auto", // Make it wider to ensure scrolling is needed
          width: needsScroll ? "fit-content" : "100%",
          gridAutoFlow: needsScroll ? "column" : "row",
          gridTemplateColumns: needsScroll ? `repeat(${snackCount}, minmax(300px, 1fr))` : "",
          paddingBottom: "12px",
          paddingRight: needsScroll ? "24px" : "0",
        }}
      >
        {snacks?.map((comboSnack) => {
          console.log("Rendering snack:", comboSnack.snack);
          // Chỉ sử dụng fallback nếu thực sự không có dữ liệu snack
          const snackData = comboSnack.snack && Object.keys(comboSnack.snack).length > 0 ? comboSnack.snack : createFallbackSnack();
          return <SnackCard key={comboSnack.id} snack={snackData} viewMode="grid" />;
        })}
      </div>
    </div>
  );
};

const ComboDetail: React.FC<ComboDetailProps> = ({ combo, open, onClose, onDeleteSnack, onAddSnack, onUpdateSnack }) => {
  const [editMode, setEditMode] = useState(false);
  const [displayCombo, setDisplayCombo] = useState<Combo>(combo);

  // Update the displayed combo when the prop changes
  useEffect(() => {
    // Chỉ cập nhật combo từ props, KHÔNG ghi đè thông tin snack
    setDisplayCombo(combo);
  }, [combo]);

  const totalPrice = calculateComboPrice(displayCombo);
  const statusLabel = getComboStatusLabel(displayCombo.status);

  const handleEditSnacks = () => {
    setEditMode(true);
  };

  // Check if we need horizontal scroll (4+ snacks)
  const snackCount = displayCombo.snacks?.length || 0;
  const needsHorizontalScroll = needsHorizontalScrollCheck(snackCount);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-full flex-col sm:max-w-[900px]">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .custom-scrollbar::-webkit-scrollbar {
            height: 12px;
            visibility: visible;
            display: block;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 6px;
            margin: 0 8px;
            box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #94a3b8;
            border-radius: 6px;
            border: 2px solid #f1f5f9;
            min-width: 60px;
            visibility: visible;
            display: block;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #64748b;
          }
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #94a3b8 #f1f5f9;
            padding-bottom: 12px;
            margin-bottom: 8px;
            overflow-y: hidden;
            overflow-x: auto !important;
          }
        `,
          }}
        />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <ShoppingBag className="h-5 w-5" />
            Chi tiết combo
            <span className="ml-2 text-base font-normal text-gray-500">
              ({displayCombo.name}) - {statusLabel}
            </span>
          </DialogTitle>
          <DialogTitle>
            <div className="mb-4">
              <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-green-50 p-4 shadow-sm">
                <h3 className="mb-2 flex items-center gap-1">
                  <Icon icon="lucide:info" className="h-4 w-4" />
                  Mô tả combo:
                </h3>
                <p className="text-sm italic leading-relaxed text-green-600">{displayCombo.description || "Không có mô tả cho combo này."}</p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 flex-col">
          {!editMode ? (
            <>
              {/* Description section */}

              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Utensils className="mr-2 h-4 w-4" />
                  <h3 className="text-lg font-semibold">Danh sách thực phẩm trong combo ({displayCombo.snacks?.length || 0})</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-primary font-medium">Tổng giá: {formatPrice(totalPrice)}</div>
                  {onAddSnack && onUpdateSnack && (
                    <Button variant="outline" size="sm" onClick={handleEditSnacks}>
                      <Edit className="mr-1 h-4 w-4" />
                      Chỉnh sửa
                    </Button>
                  )}
                </div>
              </div>

              <ScrollArea className="flex-1 pr-4" style={{ maxHeight: "60vh" }}>
                {!displayCombo.snacks?.length ? (
                  <Card>
                    <CardContent className="py-8">
                      <div className="text-muted-foreground text-center">
                        <Icon icon="lucide:popcorn" className="text-shadow-background mx-auto mb-0.5" />
                        <div className="mb-2 text-lg font-medium">Không có thực phẩm trong combo</div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <SnackGrid snacks={displayCombo.snacks} needsScroll={needsHorizontalScroll} />
                )}
              </ScrollArea>
            </>
          ) : (
            <ComboDetailForm
              combo={displayCombo}
              onCancel={() => setEditMode(false)}
              onAddSnack={(newComboSnack) => {
                if (onAddSnack) {
                  onAddSnack(newComboSnack);

                  // Update local state optimistically with a temporary ID
                  const tempId = Date.now(); // Temporary ID until the server responds
                  setDisplayCombo((prev) => ({
                    ...prev,
                    snacks: [
                      ...prev.snacks,
                      {
                        ...newComboSnack,
                        id: newComboSnack.id ?? tempId, // Use real ID if available or temp ID
                      } as ComboSnack,
                    ],
                  }));
                }
              }}
              onUpdateSnack={(updatedComboSnack) => {
                if (onUpdateSnack) {
                  onUpdateSnack(updatedComboSnack);

                  // Update the local state to reflect the update
                  setDisplayCombo((prev) => ({
                    ...prev,
                    snacks: prev.snacks.map((snack) => (snack.id === updatedComboSnack.id ? updatedComboSnack : snack)),
                  }));
                }
              }}
              onDeleteSnack={(comboSnackId) => {
                if (onDeleteSnack) {
                  // Call the parent component's delete handler to trigger the API call
                  onDeleteSnack(comboSnackId);

                  // Update the local state to reflect the deletion immediately for UI feedback
                  setDisplayCombo((prev) => ({
                    ...prev,
                    snacks: prev.snacks.filter((snack) => snack.id !== comboSnackId),
                  }));
                }
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComboDetail;
