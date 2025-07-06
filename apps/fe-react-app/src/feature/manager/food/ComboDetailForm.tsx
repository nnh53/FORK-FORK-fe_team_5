import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { type Combo, type ComboSnack } from "@/interfaces/combo.interface";
import { type Snack } from "@/interfaces/snacks.interface";
import { transformSnacksResponse, useSnacks } from "@/services/snackService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { Edit, ListPlus, MinusCircle, Plus, Save, X } from "lucide-react";
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

  // Keep local state in sync with props
  useEffect(() => {
    if (combo.snacks) {
      setComboSnacks(combo.snacks);
    }
  }, [combo]);

  const { data: snacksData, isLoading } = useSnacks();

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
        toast.success("Đã xóa thực phẩm khỏi combo");
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

      toast.success("Đã cập nhật thực phẩm trong combo");
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

      toast.success("Đã thêm thực phẩm vào combo");
    }

    setIsAddingSnack(false);
    setSelectedComboSnack(null);
    form.reset();
  };

  // State for snack search
  const [snackSearchTerm, setSnackSearchTerm] = useState("");

  // Filter to only show snacks not already in the combo (except the one being edited)
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

  // Get snack sizes and validate selected snack
  const selectedSnackId = form.watch("snackId");
  const selectedSnack = snacks.find((s) => s.id === selectedSnackId);

  // Create mock sizes array based on the selected snack's size
  const snackSizes: { id: number; name: string }[] = selectedSnack?.size ? [{ id: 1, name: selectedSnack.size }] : [];

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quản lý thực phẩm trong combo</h3>
        {!isAddingSnack && (
          <Button size="sm" variant="outline" onClick={handleAddNewSnack}>
            <Plus className="mr-1 h-4 w-4" />
            Thêm thực phẩm
          </Button>
        )}
      </div>

      {isAddingSnack ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <ListPlus className="mr-2 h-5 w-5" />
              {selectedComboSnack ? "Cập nhật thực phẩm" : "Thêm thực phẩm mới"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="snackId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thực phẩm</FormLabel>
                        <Select
                          disabled={!!selectedComboSnack}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString() || "0"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn thực phẩm" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[500px] w-[500px]">
                            <div className="sticky top-0 z-10 border-b bg-white px-3 py-2">
                              <Input
                                placeholder="Tìm kiếm thực phẩm..."
                                value={snackSearchTerm}
                                onChange={(e) => setSnackSearchTerm(e.target.value)}
                                className="mb-1"
                              />
                            </div>
                            {availableSnacks.length === 0 ? (
                              <SelectItem value="0">Không có thực phẩm khả dụng</SelectItem>
                            ) : (
                              availableSnacks.map((snack) => (
                                <SelectItem key={snack.id} value={snack.id.toString()} className="py-4">
                                  <div className="flex items-center gap-4">
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
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-gray-400">
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
                                          <Icon icon="lucide:utensils" className="h-6 w-6 text-gray-400" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-1 flex-col">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <div className="text-base font-medium">{snack.name}</div>
                                        <span
                                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${snack.category === "FOOD" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}
                                        >
                                          {snack.category === "FOOD" ? "Thức ăn" : "Đồ uống"}
                                        </span>
                                      </div>
                                      <div className="mt-2 flex flex-wrap items-center gap-3">
                                        {snack.flavor && (
                                          <span className="text-xs text-gray-600">
                                            <span className="font-medium">Hương vị:</span> {snack.flavor}
                                          </span>
                                        )}
                                        {snack.size && <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-800">{snack.size}</span>}
                                        <span className="text-sm font-semibold text-green-600">
                                          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(snack.price)}
                                        </span>
                                      </div>
                                      {snack.description && (
                                        <div className="mt-1 text-xs italic text-gray-500">
                                          {snack.description.length > 100 ? snack.description.substring(0, 100) + "..." : snack.description}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
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
                        <Select
                          onValueChange={(value) => field.onChange(value === "0" ? null : parseInt(value))}
                          value={field.value ? field.value.toString() : "0"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn kích cỡ (không bắt buộc)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">Không chọn kích cỡ</SelectItem>
                            {snackSizes.map((size) => (
                              <SelectItem key={size.id} value={size.id.toString()}>
                                {size.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                  <Button onClick={handleAddNewSnack}>
                    <Plus className="mr-1 h-4 w-4" />
                    Thêm thực phẩm
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
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
                  const snack = {
                    ...createDefaultSnack(),
                    ...(comboSnack.snack || {}),
                  };

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
                          <div>
                            {snack?.name}
                            {snack?.category && (
                              <span className="ml-2 inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                {snack.category === "FOOD" ? "Thức ăn" : "Đồ uống"}
                              </span>
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
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-1 h-4 w-4" />
          Đóng chỉnh sửa
        </Button>
      </div>
    </div>
  );
};

export default ComboDetailForm;
