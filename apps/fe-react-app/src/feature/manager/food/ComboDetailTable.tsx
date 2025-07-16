import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { ScrollArea } from "@/components/Shadcn/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { type ComboSnack } from "@/interfaces/combo.interface";
import { type Snack } from "@/interfaces/snacks.interface";
import { Icon } from "@iconify/react";
import { Edit, MinusCircle, Plus } from "lucide-react";

interface ComboDetailTableProps {
  comboSnacks: ComboSnack[];
  onAddNewSnack: () => void;
  onEditSnack: (comboSnack: ComboSnack) => void;
  onDeleteSnack?: (comboSnackId: number) => void;
}

// Tạo một đối tượng snack mặc định khi không có dữ liệu
const createDefaultSnack = (): Snack => ({
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

const ComboDetailTable: React.FC<ComboDetailTableProps> = ({ comboSnacks, onAddNewSnack, onEditSnack, onDeleteSnack }) => {
  const handleDeleteSnack = (comboSnackId: number) => {
    if (onDeleteSnack) {
      onDeleteSnack(comboSnackId);
    }
  };

  return (
    <>
      {comboSnacks.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-muted-foreground text-center">
              <Icon icon="lucide:popcorn" className="text-shadow-background mx-auto mb-0.5" />
              <div className="mb-2 text-lg font-medium">Chưa có thực phẩm trong combo</div>
              <div className="mb-4 text-sm">Hãy thêm thực phẩm để hoàn thiện combo</div>
              <div className="flex items-center justify-center gap-3">
                <Button onClick={onAddNewSnack}>
                  <Plus className="mr-1 h-4 w-4" />
                  Thêm thực phẩm
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Danh sách thực phẩm</CardTitle>
            <Button onClick={onAddNewSnack} size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Thêm thực phẩm
            </Button>
          </CardHeader>
          <ScrollArea className="h-[300px]">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên thực phẩm</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comboSnacks.map((comboSnack) => {
                    // Đảm bảo luôn có một đối tượng snack hợp lệ với đầy đủ thuộc tính
                    const snack = comboSnack.snack
                      ? {
                          ...createDefaultSnack(),
                          ...comboSnack.snack,
                        }
                      : createDefaultSnack();

                    return (
                      <TableRow key={comboSnack.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                              {snack?.img ? (
                                <img
                                  src={snack.img}
                                  alt={snack?.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    const imgElement = e.target as HTMLImageElement;
                                    imgElement.style.display = "none";
                                    imgElement.parentElement!.innerHTML = `
                                      <div class="flex h-full w-full items-center justify-center border border-gray-200 bg-gray-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-gray-400">
                                          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                                          <path d="M7 2v20"></path>
                                          <path d="M21 15V2"></path>
                                          <path d="M18 15c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h3v-6h-3Z"></path>
                                        </svg>
                                      </div>
                                    `;
                                  }}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center border border-gray-200 bg-gray-100">
                                  <Icon icon="lucide:utensils" className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold">{snack?.name}</div>
                              <div className="flex items-center gap-1">
                                {snack?.category && (
                                  <Badge
                                    variant="secondary"
                                    className={`flex items-center gap-1 text-xs ${snack.category === "FOOD" ? "bg-blue-200 text-blue-800" : "bg-yellow-400 text-green-800"}`}
                                  >
                                    {snack.category === "FOOD" ? (
                                      <Icon icon="lucide:popcorn" className="text-shadow-background h-4 w-4" />
                                    ) : (
                                      <Icon icon="ri:drinks-2-line" className="text-shadow-background h-4 w-4" />
                                    )}
                                    {snack.category === "FOOD" ? "Thức ăn" : "Đồ uống"}
                                  </Badge>
                                )}
                              </div>
                              {Boolean(snack?.price) && (
                                <div className="text-xs font-bold text-green-600">
                                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(snack.price || 0)}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{comboSnack.quantity}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => onEditSnack(comboSnack)}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            {onDeleteSnack && (
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteSnack(comboSnack.id ?? 0)}>
                                <MinusCircle className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </ScrollArea>
        </Card>
      )}
    </>
  );
};

export default ComboDetailTable;
