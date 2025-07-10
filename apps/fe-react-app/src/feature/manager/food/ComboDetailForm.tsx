import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";

import { Badge } from "@/components/Shadcn/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/Shadcn/ui/dialog";
import { ScrollArea } from "@/components/Shadcn/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { type Combo, type ComboSnack } from "@/interfaces/combo.interface";
import { type Snack } from "@/interfaces/snacks.interface";
import { transformSnacksResponse, useSnacks } from "@/services/snackService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { ArrowLeft, Edit, ListPlus, MinusCircle, Plus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ComboDetailFormProps {
  combo: Combo;
  onCancel: () => void;
  onAddSnack?: (comboSnack: Partial<ComboSnack>) => void;
  onUpdateSnack?: (comboSnack: ComboSnack) => void;
  onDeleteSnack?: (comboSnackId: number) => void;
}

const comboSnackFormSchema = z.object({
  snackId: z.number({
    required_error: "Vui lòng chọn thực phẩm",
  }),
  quantity: z.number().min(1, "Số lượng tối thiểu là 1"),
  snackSizeId: z.number().nullable(),
  discountPercentage: z.number().min(0, "Giảm giá không được âm").max(100, "Giảm giá tối đa 100%").nullable(),
});

const ComboDetailForm: React.FC<ComboDetailFormProps> = ({ combo, onCancel, onAddSnack, onUpdateSnack, onDeleteSnack }) => {
  const [isAddingSnack, setIsAddingSnack] = useState(false);
  const [selectedComboSnack, setSelectedComboSnack] = useState<ComboSnack | null>(null);
  const [comboSnacks, setComboSnacks] = useState<ComboSnack[]>(combo.snacks || []);
  const [snackSearchTerm, setSnackSearchTerm] = useState("");

  // Keep local state in sync with props
  useEffect(() => {
    if (combo.snacks) {
      setComboSnacks(combo.snacks);
    }
  }, [combo]);

  const { data: snacksData } = useSnacks();

  // Transform the API response to Snack[] format
  let snacks: Snack[] = [];
  if (snacksData?.result) {
    if (Array.isArray(snacksData.result)) {
      snacks = transformSnacksResponse(snacksData.result);
    } else {
      snacks = transformSnacksResponse([snacksData.result]);
    }
  }

  const form = useForm<z.infer<typeof comboSnackFormSchema>>({
    resolver: zodResolver(comboSnackFormSchema),
    defaultValues: {
      snackId: 0,
      quantity: 1,
      snackSizeId: null,
      discountPercentage: 0,
    },
  });

  const handleAddNewSnack = () => {
    setIsAddingSnack(true);
    setSelectedComboSnack(null);
    form.reset({
      snackId: 0,
      quantity: 1,
      snackSizeId: null,
      discountPercentage: 0,
    });
  };

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

  const handleEditSnack = (comboSnack: ComboSnack) => {
    setIsAddingSnack(true);
    setSelectedComboSnack(comboSnack);
    form.reset({
      snackId: comboSnack.snack?.id || 0,
      quantity: comboSnack.quantity || 1,
      snackSizeId: comboSnack.snackSizeId,
      discountPercentage: comboSnack.discountPercentage,
    });
  };

  const handleDeleteSnack = (comboSnackId: number) => {
    if (onDeleteSnack) {
      try {
        // Call the API first to ensure it succeeds
        onDeleteSnack(comboSnackId);

        // Then update local state for immediate UI feedback
        setComboSnacks((prevSnacks) => prevSnacks.filter((s) => s.id !== comboSnackId));
        // Đã loại bỏ toast ở đây để tránh hiển thị 2 lần
      } catch (error) {
        console.error("Error deleting combo snack:", error);
        toast.error("Có lỗi khi xóa thực phẩm. Vui lòng thử lại sau.");
      }
    }
  };

  const handleCancelAddEdit = () => {
    setIsAddingSnack(false);
    setSelectedComboSnack(null);
  };

  const onSubmit = (values: z.infer<typeof comboSnackFormSchema>) => {
    if (selectedComboSnack && onUpdateSnack) {
      const updatedComboSnack: ComboSnack = {
        ...selectedComboSnack,
        quantity: values.quantity,
        snackSizeId: values.snackSizeId,
        discountPercentage: values.discountPercentage,
      };

      onUpdateSnack(updatedComboSnack);

      // Update local state to reflect changes immediately
      setComboSnacks((prevSnacks) => prevSnacks.map((snack) => (snack.id === updatedComboSnack.id ? updatedComboSnack : snack)));

      // Đã loại bỏ toast ở đây để tránh hiển thị 2 lần
    } else if (onAddSnack) {
      const selectedSnack = snacks.find((s) => s.id === values.snackId);
      if (!selectedSnack) {
        toast.error("Không tìm thấy thực phẩm");
        return;
      }

      const newComboSnack: Partial<ComboSnack> = {
        quantity: values.quantity,
        snackSizeId: values.snackSizeId,
        discountPercentage: values.discountPercentage,
        snack: selectedSnack,
        combo: combo,
      };

      onAddSnack(newComboSnack);

      // Add to local state with a temporary ID for immediate display
      const tempComboSnack: ComboSnack = {
        ...newComboSnack,
        id: -Date.now(), // Temporary negative ID until server responds
        combo: combo,
        snack: selectedSnack,
      } as ComboSnack;

      setComboSnacks((prevSnacks) => [...prevSnacks, tempComboSnack]);

      // Đã loại bỏ toast ở đây để tránh hiển thị 2 lần
    }

    setIsAddingSnack(false);
    setSelectedComboSnack(null);
    form.reset();
  };

  // Filter snacks not already in the combo (except the one being edited)
  const availableSnacks = snacks
    .filter((snack) => {
      // If we're editing a combo snack, always allow its snack to be selected
      if (selectedComboSnack && selectedComboSnack.snack?.id === snack.id) {
        return true;
      }

      // Don't show snacks already in the combo
      const isAlreadyInCombo = comboSnacks.some((comboSnack) => comboSnack.snack?.id === snack.id);

      return !isAlreadyInCombo;
    })
    .filter((snack) => {
      if (!snackSearchTerm) return true;
      const lowerSearchTerm = snackSearchTerm.toLowerCase();
      return (
        (snack.name?.toLowerCase() || "").includes(lowerSearchTerm) ||
        (snack.category?.toLowerCase() || "").includes(lowerSearchTerm) ||
        (snack.flavor?.toLowerCase() || "").includes(lowerSearchTerm) ||
        (snack.size?.toLowerCase() || "").includes(lowerSearchTerm)
      );
    });

  // Snack sizes (placeholder - replace with actual data if available)
  const snackSizes = [
    { id: 1, name: "Nhỏ" },
    { id: 2, name: "Vừa" },
    { id: 3, name: "Lớn" },
    { id: 4, name: "Rất lớn" },
  ];

  return (
    <div className="space-y-4">
      {/* Back button at the top of the form */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onCancel} className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Quay lại chi tiết combo
        </Button>
      </div>

      {isAddingSnack ? (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-lg">
                <ListPlus className="mr-2 h-5 w-5" />
                {selectedComboSnack ? "Cập nhật thực phẩm" : "Thêm thực phẩm mới"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="snackId"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel>Thực phẩm</FormLabel>
                        <div>
                          {selectedComboSnack ? (
                            <div className="border-input flex items-center gap-3 rounded-md border px-3 py-2">
                              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                                {selectedComboSnack.snack?.img ? (
                                  <img
                                    src={selectedComboSnack.snack.img}
                                    alt={selectedComboSnack.snack?.name}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                    <Icon icon="lucide:utensils" className="h-4 w-4 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{selectedComboSnack.snack?.name}</div>
                                <div className="text-sm text-gray-500">
                                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                    selectedComboSnack.snack?.price || 0,
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                {field.value ? (
                                  <Button variant="outline" className="w-full justify-start overflow-hidden p-0 text-left font-normal">
                                    {(() => {
                                      const selectedSnack = snacks.find((s) => s.id === field.value);
                                      if (!selectedSnack) return <span>Chọn thực phẩm</span>;
                                      return (
                                        <div className="border-input flex w-full items-center gap-3">
                                          <div className="h-10 w-10 flex-shrink-0 overflow-hidden">
                                            {selectedSnack.img ? (
                                              <img src={selectedSnack.img} alt={selectedSnack.name} className="h-full w-full object-cover" />
                                            ) : (
                                              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                <Icon icon="lucide:utensils" className="h-4 w-4 text-gray-400" />
                                              </div>
                                            )}
                                          </div>
                                          <div className="py-2">
                                            <div className="font-medium">{selectedSnack.name}</div>
                                            <div className="flex gap-2 text-xs">
                                              <span className="text-muted-foreground">
                                                {selectedSnack.category === "FOOD" ? "Thức ăn" : "Đồ uống"}
                                              </span>
                                              <span className="font-medium text-green-600">
                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                                  selectedSnack.price || 0,
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </Button>
                                ) : (
                                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    <span>Chọn thực phẩm</span>
                                  </Button>
                                )}
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Chọn thực phẩm</DialogTitle>
                                  <DialogDescription>Chọn một thực phẩm để thêm vào combo</DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <div className="mb-4 flex items-center gap-2">
                                    <div className="flex-1">
                                      <Input
                                        placeholder="Tìm kiếm thực phẩm..."
                                        value={snackSearchTerm}
                                        onChange={(e) => setSnackSearchTerm(e.target.value)}
                                      />
                                    </div>
                                    <select
                                      className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                                      onChange={(e) => {
                                        if (e.target.value === "ALL") setSnackSearchTerm("");
                                        else setSnackSearchTerm(e.target.value);
                                      }}
                                    >
                                      <option value="ALL">Tất cả</option>
                                      <option value="FOOD">Thức ăn</option>
                                      <option value="DRINK">Đồ uống</option>
                                    </select>
                                  </div>
                                  <ScrollArea className="h-[300px]">
                                    <div className="space-y-2">
                                      {availableSnacks.length === 0 ? (
                                        <div className="text-muted-foreground py-4 text-center">Không có thực phẩm khả dụng</div>
                                      ) : (
                                        availableSnacks.map((snack) => (
                                          <button
                                            key={snack.id}
                                            type="button"
                                            className={`hover:bg-muted flex w-full cursor-pointer items-center gap-3 rounded-md border p-2 text-left transition-colors ${
                                              field.value === snack.id ? "border-primary bg-primary/10" : "border-input"
                                            }`}
                                            onClick={() => {
                                              field.onChange(snack.id);
                                            }}
                                          >
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                              {snack?.img ? (
                                                <img
                                                  src={snack.img}
                                                  alt={snack.name}
                                                  className="h-full w-full object-cover"
                                                  onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = "none";
                                                    (e.target as HTMLImageElement).parentElement!.innerHTML = `
                                                      <div class="flex h-full w-full items-center justify-center bg-gray-100">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-gray-400">
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
                                                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                  <Icon icon="lucide:utensils" className="h-4 w-4 text-gray-400" />
                                                </div>
                                              )}
                                            </div>
                                            <div className="flex flex-1 flex-col">
                                              <div className="font-medium">{snack.name}</div>
                                              <div className="text-muted-foreground text-sm">
                                                {snack.category === "FOOD" ? "Thức ăn" : "Đồ uống"}
                                                {snack.flavor && ` • ${snack.flavor}`}
                                              </div>
                                              <div className="text-sm font-semibold text-green-600">
                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(snack.price || 0)}
                                              </div>
                                            </div>
                                            {field.value === snack.id && (
                                              <Badge variant="default" className="ml-auto">
                                                Đã chọn
                                              </Badge>
                                            )}
                                          </button>
                                        ))
                                      )}
                                    </div>
                                  </ScrollArea>
                                  <div className="mt-4 flex justify-end">
                                    <Button
                                      type="button"
                                      onClick={() => {
                                        // Đóng Dialog khi bấm xác nhận
                                        const closeDialogButton = document.querySelector('[data-state="open"] button[type="button"]') as HTMLElement;
                                        if (closeDialogButton) closeDialogButton.click();
                                      }}
                                      disabled={!field.value}
                                    >
                                      Xác nhận chọn
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số lượng</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="snackSizeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kích cỡ (nếu có)</FormLabel>
                        <FormControl>
                          <select
                            className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                            value={field.value?.toString() || "0"}
                            onChange={(e) => field.onChange(e.target.value === "0" ? null : parseInt(e.target.value))}
                          >
                            <option value="0">Không chọn kích cỡ</option>
                            {snackSizes.map((size) => (
                              <option key={size.id} value={size.id.toString()}>
                                {size.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giảm giá (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            placeholder="0"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={handleCancelAddEdit}>
                    <X className="mr-1 h-4 w-4" />
                    Hủy
                  </Button>
                  <Button type="submit">
                    <Save className="mr-1 h-4 w-4" />
                    {selectedComboSnack ? "Cập nhật" : "Thêm"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div>
          {comboSnacks.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-muted-foreground text-center">
                  <Icon icon="lucide:popcorn" className="text-shadow-background mx-auto mb-0.5" />
                  <div className="mb-2 text-lg font-medium">Chưa có thực phẩm trong combo</div>
                  <div className="mb-4 text-sm">Hãy thêm thực phẩm để hoàn thiện combo</div>
                  <div className="flex items-center justify-center gap-3">
                    <Button onClick={handleAddNewSnack}>
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
                {/* Add a footer with back button at the bottom of the card */}
                <Button onClick={handleAddNewSnack} size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Thêm thực phẩm
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên thực phẩm</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead>Kích cỡ</TableHead>
                      <TableHead>Giảm giá</TableHead>
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

                      let sizeDisplay = "Mặc định";

                      if (comboSnack.snackSizeId && snack?.size) {
                        sizeDisplay = snack.size;
                      }

                      return (
                        <TableRow key={comboSnack.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded">
                                {snack?.img ? (
                                  <img
                                    src={snack.img}
                                    alt={snack?.name}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = "none";
                                      (e.target as HTMLImageElement).parentElement!.innerHTML = `
                                        <div class="flex h-full w-full items-center justify-center bg-gray-100">
                                          <Icon icon="lucide:utensils" className="h-4 w-4 text-gray-400" />
                                        </div>
                                      `;
                                    }}
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                    <Icon icon="lucide:utensils" className="h-4 w-4 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div>{snack?.name}</div>
                                {snack?.category && (
                                  <Badge variant="outline" className="mt-1">
                                    {snack.category === "FOOD" ? "Thức ăn" : "Đồ uống"}
                                  </Badge>
                                )}
                                {Boolean(snack?.price) && (
                                  <div className="text-xs font-semibold text-green-600">
                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(snack.price || 0)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{comboSnack.quantity ?? 1}</TableCell>
                          <TableCell>{sizeDisplay}</TableCell>
                          <TableCell>{comboSnack.discountPercentage ?? 0}%</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditSnack(comboSnack)}>
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              {onDeleteSnack && (
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteSnack(comboSnack.id)}>
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
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ComboDetailForm;
