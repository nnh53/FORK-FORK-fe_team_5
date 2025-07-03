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
import { useState } from "react";
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

  const handleEditSnack = (comboSnack: ComboSnack) => {
    setIsAddingSnack(true);
    setSelectedComboSnack(comboSnack);
    form.reset({
      snackId: comboSnack.snack.id,
      quantity: comboSnack.quantity,
      snackSizeId: comboSnack.snackSizeId,
      discountPercentage: comboSnack.discountPercentage,
    });
  };

  const handleDeleteSnack = (comboSnackId: number) => {
    if (onDeleteSnack) {
      onDeleteSnack(comboSnackId);
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
      toast.success("Đã cập nhật thực phẩm trong combo");
    } else if (onAddSnack) {
      const selectedSnack = Array.isArray(snacks) ? snacks.find((s) => s.id === values.snackId) : null;
      if (!selectedSnack) {
        toast.error("Không tìm thấy thực phẩm");
        return;
      }

      const newComboSnack: Partial<ComboSnack> = {
        quantity: values.quantity,
        snackSizeId: values.snackSizeId,
        discountPercentage: values.discountPercentage,
        snack: {
          id: selectedSnack.id || 0,
          category: selectedSnack.category || "FOOD",
          name: selectedSnack.name || "",
          size: selectedSnack.size || "MEDIUM",
          flavor: selectedSnack.flavor || "",
          price: selectedSnack.price || 0,
          description: selectedSnack.description || "",
          img: selectedSnack.img || "",
          status: selectedSnack.status || "AVAILABLE",
        },
        combo: combo,
      };

      onAddSnack(newComboSnack);
      toast.success("Đã thêm thực phẩm vào combo");
    }

    setIsAddingSnack(false);
    setSelectedComboSnack(null);
    form.reset();
  };
  const availableSnacks = Array.isArray(snacks)
    ? snacks.filter((snack) => {
        // Check if this snack is already in the combo
        const isAlreadyInCombo = combo.snacks.some((comboSnack) => comboSnack.snack.id === snack.id);

        // If it's already in combo, only show it if it's the selected one we're editing
        return !isAlreadyInCombo || (selectedComboSnack && selectedComboSnack.snack.id === snack.id);
      })
    : [];

  // Get snack sizes and validate selected snack
  const selectedSnackId = form.watch("snackId");
  const selectedSnack = snacks.find((s) => s.id === selectedSnackId);
  // Since the API doesn't provide sizes, we'll create a mock array
  const snackSizes: { id: number; name: string }[] = selectedSnack?.size ? [{ id: 1, name: selectedSnack.size }] : [];

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
                <FormField
                  control={form.control}
                  name="snackId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thực phẩm</FormLabel>
                      <Select
                        disabled={!!selectedComboSnack}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn thực phẩm" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableSnacks.map((snack) => (
                            <SelectItem key={snack.id ?? "unknown"} value={(snack.id ?? 0).toString()}>
                              {snack.name}
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
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="snackSizeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kích cỡ (nếu có)</FormLabel>
                      <Select onValueChange={(value) => field.onChange(value ? parseInt(value) : null)} value={field.value?.toString() ?? ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn kích cỡ (không bắt buộc)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Không chọn kích cỡ</SelectItem>
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
          {combo.snacks?.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-muted-foreground text-center">
                  <Icon icon="lucide:popcorn" className="text-shadow-background mx-auto mb-0.5" />{" "}
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
                {combo.snacks.map((comboSnack) => {
                  const snack = comboSnack.snack;
                  let sizeDisplay = "Mặc định";

                  if (comboSnack.snackSizeId) {
                    sizeDisplay = snack.size ?? "N/A";
                  }

                  return (
                    <TableRow key={snack.id}>
                      <TableCell className="font-medium">{snack.name}</TableCell>
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
          Đóng
        </Button>
      </div>
    </div>
  );
};

export default ComboDetailForm;
