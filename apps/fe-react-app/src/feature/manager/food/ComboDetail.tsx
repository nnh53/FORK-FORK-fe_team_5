import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent } from "@/components/Shadcn/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/Shadcn/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/Shadcn/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { type Combo, type ComboSnack } from "@/interfaces/combo.interface";
import { type Snack } from "@/interfaces/snacks.interface";
import { getComboStatusLabel, type ComboStatus } from "@/services/comboService";
import { formatVND } from "@/utils/currency.utils";
import { Icon } from "@iconify/react";
import { Edit, ShoppingBag, Utensils, X } from "lucide-react";
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

// Extracted SnackGrid component to reduce complexity
const SnackGrid = ({ snacks }: { snacks: ComboSnack[] }) => {
  return (
    <Carousel className="w-full py-4">
      <CarouselContent>
        {snacks?.map((comboSnack) => {
          // Chỉ sử dụng fallback nếu thực sự không có dữ liệu snack
          const snackData = comboSnack.snack && Object.keys(comboSnack.snack).length > 0 ? comboSnack.snack : createFallbackSnack();
          return (
            <CarouselItem key={comboSnack.id} className="basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <SnackCard snack={snackData} viewMode="grid" />
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
};

const ComboDetail: React.FC<ComboDetailProps> = ({ combo, open, onClose, onDeleteSnack, onAddSnack, onUpdateSnack }) => {
  const [editMode, setEditMode] = useState(false);
  const [displayCombo, setDisplayCombo] = useState<Combo>(combo);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Update the displayed combo when the prop changes
  useEffect(() => {
    console.log("Combo props changed in ComboDetail, updating displayCombo", combo);
    // Đảm bảo luôn sử dụng dữ liệu combo mới nhất từ props và force re-render
    setDisplayCombo({ ...combo });
  }, [combo, combo.snacks]); // Thêm combo.snacks vào dependency để cập nhật khi snacks thay đổi

  const statusLabel = getComboStatusLabel(displayCombo.status as ComboStatus);

  const handleEditSnacks = () => {
    setEditMode(true);
  };

  // Extracted handler functions to reduce nesting
  const handleAddSnack = (newComboSnack: Partial<ComboSnack>) => {
    if (onAddSnack) {
      onAddSnack(newComboSnack);

      // Update local state optimistically with a temporary ID
      const tempId = Date.now(); // Temporary ID until the server responds
      const newSnack = {
        ...newComboSnack,
        id: newComboSnack.id ?? tempId, // Use real ID if available or temp ID
      } as ComboSnack;

      setDisplayCombo((prev) => ({
        ...prev,
        snacks: [...prev.snacks, newSnack],
      }));
    }
  };

  const handleUpdateSnack = (updatedComboSnack: ComboSnack) => {
    if (onUpdateSnack) {
      onUpdateSnack(updatedComboSnack);

      // Update the local state to reflect the update
      setDisplayCombo((prev) => ({
        ...prev,
        snacks: prev.snacks.map((snack) => (snack.id === updatedComboSnack.id ? updatedComboSnack : snack)),
      }));
    }
  };

  const handleDeleteSnack = (comboSnackId: number) => {
    if (onDeleteSnack) {
      // Call the parent component's delete handler to trigger the API call
      onDeleteSnack(comboSnackId);

      // Update the local state to reflect the deletion immediately for UI feedback
      setDisplayCombo((prev) => ({
        ...prev,
        snacks: prev.snacks.filter((snack) => snack.id !== comboSnackId),
      }));
    }
  };

  const renderContent = () => (
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
              <div className="text-primary font-medium">Giá combo: {formatVND((displayCombo.price || 0) - (displayCombo.discount || 0))}</div>
              {onAddSnack && onUpdateSnack && (
                <Button variant="outline" size="sm" onClick={handleEditSnacks}>
                  <Edit className="mr-1 h-4 w-4" />
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-hidden" style={{ maxHeight: isMobile ? "70vh" : "60vh" }}>
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
              <SnackGrid snacks={displayCombo.snacks} />
            )}
          </div>
        </>
      ) : (
        <ComboDetailForm
          combo={displayCombo}
          onCancel={() => setEditMode(false)}
          onAddSnack={handleAddSnack}
          onUpdateSnack={handleUpdateSnack}
          onDeleteSnack={handleDeleteSnack}
        />
      )}
    </div>
  );

  const renderHeader = () => (
    <>
      <div className="flex items-center gap-2 text-2xl font-bold">
        <ShoppingBag className="h-5 w-5" />
        Chi tiết combo
        <span className="ml-2 text-base font-normal text-gray-500">
          ({displayCombo.name}) - {statusLabel}
        </span>
      </div>
      <div className="mb-4">
        <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-green-50 p-4 shadow-sm">
          <h3 className="mb-2 flex items-center gap-1">
            <Icon icon="lucide:info" className="h-4 w-4" />
            Mô tả combo:
          </h3>
          <p className="text-sm leading-relaxed text-green-600 italic">{displayCombo.description || "Không có mô tả cho combo này."}</p>
        </div>
      </div>
    </>
  );

  // Sử dụng Drawer cho mobile và Dialog cho desktop
  return isMobile ? (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-semibold">Chi tiết combo</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          {renderHeader()}
        </DrawerHeader>
        {renderContent()}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-full flex-col sm:max-w-[1000px] md:max-w-[90vw] lg:max-w-[1070px]">
        <DialogHeader>
          <DialogTitle>{renderHeader()}</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ComboDetail;
