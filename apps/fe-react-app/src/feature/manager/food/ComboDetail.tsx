import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { ScrollArea } from "@/components/Shadcn/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Shadcn/ui/tabs";
import { type Combo, type ComboSnack } from "@/interfaces/combo.interface";
import { calculateComboPrice, formatPrice, getComboStatusLabel } from "@/services/comboService";
import { Edit, Info, ShoppingBag, Utensils, X } from "lucide-react";
import { useState } from "react";
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

const ComboDetail: React.FC<ComboDetailProps> = ({ combo, open, onClose, onEdit, onDeleteSnack, onAddSnack, onUpdateSnack }) => {
  const [activeTab, setActiveTab] = useState<string>("details");
  const [editMode, setEditMode] = useState(false);

  const totalPrice = calculateComboPrice(combo);
  const statusLabel = getComboStatusLabel(combo.status);
  const isAvailable = combo.status === "AVAILABLE";

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(combo);
      onClose();
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setEditMode(false);
  };

  const handleEditSnacks = () => {
    setEditMode(true);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Chi tiết combo
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="details" className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              Thông tin
            </TabsTrigger>
            <TabsTrigger value="snacks" className="flex items-center gap-1">
              <Utensils className="h-4 w-4" />
              Thực phẩm ({combo.snacks?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="flex-1 mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{combo.name}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {statusLabel}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-gray-700">Giá combo:</div>
                <div className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</div>
              </div>

              {combo.img && (
                <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={combo.img}
                    alt={combo.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-combo.jpg";
                    }}
                  />
                </div>
              )}

              {combo.description && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Mô tả:</h4>
                  <p className="text-gray-600 whitespace-pre-line">{combo.description}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="snacks" className="flex-1 mt-4 flex flex-col">
            {!editMode ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Danh sách thực phẩm trong combo</h3>
                  {onAddSnack && onUpdateSnack && (
                    <Button variant="outline" size="sm" onClick={handleEditSnacks}>
                      <Edit className="h-4 w-4 mr-1" />
                      Chỉnh sửa
                    </Button>
                  )}
                </div>

                <ScrollArea className="flex-1 pr-4">
                  {combo.snacks?.length === 0 ? (
                    <Card>
                      <CardContent className="py-8">
                        <div className="text-center text-muted-foreground">
                          <div className="text-4xl mb-4">🍽️</div>
                          <div className="text-lg font-medium mb-2">Không có thực phẩm trong combo</div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {combo.snacks?.map((comboSnack) => (
                        <SnackCard
                          key={comboSnack.id}
                          snack={{
                            id: comboSnack.id,
                            name: comboSnack.snack?.name || "Unknown Snack",
                            category: comboSnack.snack?.category || "FOOD",
                            size: comboSnack.snack?.size || "MEDIUM",
                            flavor: comboSnack.snack?.flavor || "",
                            price: comboSnack.snack?.price || 0,
                            status: comboSnack.snack?.status || "AVAILABLE",
                            description: comboSnack.snack?.description || "",
                            img: comboSnack.snack?.img || "",
                          }}
                          viewMode="grid"
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </>
            ) : (
              <ComboDetailForm
                combo={combo}
                onCancel={() => setEditMode(false)}
                onAddSnack={onAddSnack}
                onUpdateSnack={onUpdateSnack}
                onDeleteSnack={onDeleteSnack}
              />
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          {onEdit && (
            <Button variant="outline" onClick={handleEditClick} className="mr-2">
              <Edit className="h-4 w-4 mr-1" />
              Chỉnh sửa combo
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-1" />
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComboDetail;
