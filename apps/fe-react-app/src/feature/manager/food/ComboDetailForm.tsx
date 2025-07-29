import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/Shadcn/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import { ScrollArea } from "@/components/Shadcn/ui/scroll-area";
import { type Combo, type ComboSnack } from "@/interfaces/combo.interface";
import { type Snack } from "@/interfaces/snacks.interface";
import { transformSnacksResponse, useSnacks } from "@/services/snackService";
import { formatVND } from "@/utils/currency.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { ArrowLeft, ListPlus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ComboDetailTable from "./ComboDetailTable";

interface ComboDetailFormProps {
  combo: Combo;
  onCancel: () => void;
  onAddSnack?: (comboSnack: Partial<ComboSnack>) => void;
  onUpdateSnack?: (comboSnack: ComboSnack) => void;
  onDeleteSnack?: (comboSnackId: number) => void;
}

const comboSnackFormSchema = z.object({
  snackId: z.number({ required_error: "Vui lòng chọn thực phẩm" }),
  quantity: z.number().min(1, "Số lượng tối thiểu là 1"),
});

const SnackInfo: React.FC<{ snack: Snack }> = ({ snack }) => (
  <div className="flex items-center gap-4 rounded-md">
    <div className="h-15 w-15 flex-shrink-0 overflow-hidden rounded-lg">
      {snack?.img ? (
        <img
          src={snack.img}
          alt={snack?.name || "Snack image"}
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
    <div className="grid flex-1 grid-cols-12 gap-2 text-sm">
      <div className="col-span-8 flex flex-col gap-1">
        <div className="flex items-center gap-1">
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
        </div>
        <h3 className="line-clamp-1 font-semibold">{snack?.name || "Unknown Snack"}</h3>
        <p className="text-xs text-gray-500">ID: #{snack?.id}</p>
      </div>
      <div className="col-span-4 flex items-center justify-end">
        <span className="text-lg font-bold text-green-600">{formatVND(snack.price || 0)}</span>
      </div>
    </div>
  </div>
);

const ComboDetailForm: React.FC<ComboDetailFormProps> = ({ combo, onCancel, onAddSnack, onUpdateSnack, onDeleteSnack }) => {
  const [isAddingSnack, setIsAddingSnack] = useState(false);
  const [selectedComboSnack, setSelectedComboSnack] = useState<ComboSnack | null>(null);
  const [comboSnacks, setComboSnacks] = useState<ComboSnack[]>(combo.snacks || []);
  const [snackSearchTerm, setSnackSearchTerm] = useState("");

  const { data: snacksData } = useSnacks();
  let snacks: Snack[] = [];
  if (snacksData?.result) {
    snacks = Array.isArray(snacksData.result)
      ? transformSnacksResponse(snacksData.result)
      : transformSnacksResponse([snacksData.result]);
  }

  useEffect(() => {
    if (combo.snacks) setComboSnacks(combo.snacks);
  }, [combo.snacks]);

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const form = useForm<z.infer<typeof comboSnackFormSchema>>({
    resolver: zodResolver(comboSnackFormSchema),
    defaultValues: { snackId: 0, quantity: 1 },
  });

  const handleAddNewSnack = () => {
    setIsAddingSnack(true);
    setSelectedComboSnack(null);
    form.reset({ snackId: 0, quantity: 1 });
  };

  const handleEditSnack = (comboSnack: ComboSnack) => {
    setIsAddingSnack(true);
    setSelectedComboSnack(comboSnack);
    form.reset({
      snackId: comboSnack.snack?.id || 0,
      quantity: comboSnack.quantity || 1,
    });
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
      };
      onUpdateSnack(updatedComboSnack);
    } else if (onAddSnack) {
      const selectedSnack = snacks.find((s) => s.id === values.snackId);
      if (selectedSnack) {
        const newComboSnack: Partial<ComboSnack> = {
          quantity: values.quantity,
          snack: selectedSnack,
          combo,
        };
        onAddSnack(newComboSnack);
      }
    }
    setIsAddingSnack(false);
    setSelectedComboSnack(null);
    form.reset();
  };

  const availableSnacks = snacks
    .filter((snack) => {
      if (selectedComboSnack && selectedComboSnack.snack?.id === snack.id) return true;
      return !comboSnacks.some((cs) => cs.snack?.id === snack.id);
    })
    .filter((snack) => {
      if (!snackSearchTerm) return true;
      const lowerSearchTerm = snackSearchTerm.toLowerCase();
      return (
        snack.name?.toLowerCase().includes(lowerSearchTerm) ||
        snack.category?.toLowerCase().includes(lowerSearchTerm) ||
        snack.flavor?.toLowerCase().includes(lowerSearchTerm) ||
        snack.size?.toLowerCase().includes(lowerSearchTerm)
      );
    })
    .filter((snack) => {
      return selectedCategory === "ALL" || snack.category === selectedCategory;
    });

  // Đã loại bỏ biến snackSizes không còn sử dụng

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onCancel} className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Quay lại preview
        </Button>
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
                        <div>
                          {selectedComboSnack ? (
                            <SnackInfo snack={selectedComboSnack.snack!} />
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                {field.value ? (
                                  <Button variant="outline" className="h-full w-auto justify-start overflow-hidden text-left">
                                    <SnackInfo snack={snacks.find((s) => s.id === field.value)!} />
                                  </Button>
                                ) : (
                                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    Chọn thực phẩm
                                  </Button>
                                )}
                              </DialogTrigger>
                              <DialogContent className="sm:max-h-[825px]">
                                <DialogHeader>
                                  <DialogTitle>Chọn thực phẩm</DialogTitle>
                                  <DialogDescription>Chọn một thực phẩm để thêm vào combo</DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  {" "}
                                  <div className="mb-4 flex items-center gap-2">
                                    <div className="flex-1">
                                      <Input
                                        placeholder="Tìm kiếm thực phẩm..."
                                        value={snackSearchTerm}
                                        onChange={(e) => setSnackSearchTerm(e.target.value)}
                                      />
                                    </div>
                                    <select
                                      className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                      value={selectedCategory}
                                      onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                      }}
                                    >
                                      <option value="ALL">Tất cả</option>
                                      <option value="FOOD">Thức ăn</option>
                                      <option value="DRINK">Đồ uống</option>
                                    </select>
                                  </div>
                                  <ScrollArea className="h-[600px]">
                                    <div className="space-y-2">
                                      {availableSnacks.length === 0 ? (
                                        <div className="text-muted-foreground py-4 text-center">
                                          <Icon icon="lucide:search-x" className="mx-auto h-6 w-6 opacity-50" />
                                          <p className="mt-2">Không có thực phẩm khả dụng</p>
                                        </div>
                                      ) : (
                                        availableSnacks.map((snack) => (
                                          <Card
                                            key={snack.id}
                                            className={`w-full cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                                              field.value === snack.id ? "border-primary bg-primary/4 border-4" : ""
                                            }`}
                                            onClick={() => {
                                              field.onChange(snack.id);
                                            }}
                                          >
                                            <CardContent>
                                              <SnackInfo snack={snack} />
                                            </CardContent>
                                          </Card>
                                        ))
                                      )}
                                    </div>
                                  </ScrollArea>
                                  <div className="mt-4 flex justify-end gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => {
                                        // Reset field value
                                        field.onChange(0);
                                        // Đóng Dialog khi bấm hủy
                                        const closeDialogButton = document.querySelector('[data-state="open"] button[type="button"]') as HTMLElement;
                                        if (closeDialogButton) closeDialogButton.click();
                                      }}
                                    >
                                      Hủy
                                    </Button>
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
                {/* Các trường kích cỡ và giảm giá đã được ẩn theo yêu cầu */}
                <div className="flex justify-end gap-2 pt-4">
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
        <ComboDetailTable comboSnacks={comboSnacks} onAddNewSnack={handleAddNewSnack} onEditSnack={handleEditSnack} onDeleteSnack={onDeleteSnack} />
      )}
    </div>
  );
};

export default ComboDetailForm;
