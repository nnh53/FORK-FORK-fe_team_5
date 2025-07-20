import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Textarea } from "@/components/Shadcn/ui/textarea";
import ImageUpload from "@/components/shared/ImageUpload";
import { useMediaQuery } from "@/hooks/use-media-query"; // Import hook
import type { Snack } from "@/interfaces/snacks.interface";
import { snackCategoryOptions, snackSizeOptions, snackStatusOptions } from "@/services/snackService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { ImageIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface SnackFormProps {
  snack?: Snack;
  onSubmit: (data: Omit<Snack, "id">) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const formSchema = z.object({
  img: z.string().min(1, "Image URL is required"),
  name: z.string().min(1, "Snack name is required"),
  category: z.enum(["DRINK", "FOOD"], { required_error: "Category is required" }),
  size: z.enum(["SMALL", "MEDIUM", "LARGE"], { required_error: "Size is required" }),
  flavor: z.string().min(1, "Flavor is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(1000, "Price must be at least 1,000 VND"),
  status: z.enum(["AVAILABLE", "UNAVAILABLE"], { required_error: "Status is required" }),
});

const SnackForm: React.FC<SnackFormProps> = ({ snack, onSubmit, onCancel }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      img: "",
      name: "",
      category: undefined,
      size: undefined,
      flavor: "",
      description: "",
      price: 0,
      status: "AVAILABLE",
    },
  });

  const isMobile = useMediaQuery("(max-width: 768px)"); // Kiểm tra màn hình dưới 768px

  useEffect(() => {
    if (snack) {
      setTimeout(() => {
        form.reset({
          img: snack.img,
          name: snack.name,
          category: snack.category as "DRINK" | "FOOD",
          size: snack.size as "SMALL" | "MEDIUM" | "LARGE",
          flavor: snack.flavor,
          description: snack.description,
          price: snack.price,
          status: snack.status as "AVAILABLE" | "UNAVAILABLE",
        });
      }, 0);
    } else {
      form.reset({
        img: "",
        name: "",
        category: undefined,
        size: undefined,
        flavor: "",
        description: "",
        price: 0,
        status: "AVAILABLE",
      });
    }
  }, [snack, form]);

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Khu vực upload hình và form */}
          <div className={isMobile ? "flex flex-col gap-8" : "grid grid-cols-5 gap-8"}>
            {/* Upload ảnh (2/5 width) */}
            <div className={isMobile ? "w-full" : "col-span-2"}>
              <Card className="hover:border-primary h-full border-2 border-dashed border-gray-300 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ImageIcon className="h-5 w-5" />
                    Hình ảnh
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex h-full flex-col space-y-4">
                  <FormField
                    control={form.control}
                    name="img"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <ImageUpload
                          currentImage={field.value}
                          onImageChange={(url) => form.setValue("img", url)}
                          onImageClear={() => form.setValue("img", "")}
                          label=""
                          aspectRatio="16:9"
                          error={fieldState.error?.message}
                          previewSize="auto"
                          preserveAspectRatio={true}
                          layout="vertical"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Form chính (3/5 width) */}
            <div className={isMobile ? "w-full" : "col-span-3 h-full"}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {snack ? "Nhập thông tin cần chỉnh sửa" : "Nhập thông tin đồ ăn mới"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tên đồ ăn */}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Tên đồ ăn <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="VD: Pizza Hải Sản Deluxe" {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="flavor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hương vị</FormLabel>
                          <FormControl>
                            <Input placeholder="VD: Vị cay, Vị ngọt, Vị đắng..." {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Mô tả - Thay thế flavor */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Mô tả <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea placeholder="Mô tả sản phẩm..." {...field} className="resize-none" rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Danh mục, Kích thước, Trạng thái */}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Danh mục <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""} defaultValue="">
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Chọn danh mục" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {snackCategoryOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.value === "FOOD" ? (
                                    <Icon icon="lucide:popcorn" className="text-shadow-background mx-auto mb-0.5" />
                                  ) : (
                                    <Icon icon="ri:drinks-2-line" className="text-shadow-background mx-auto mb-0.5" />
                                  )}
                                  {option.label}
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
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Kích thước <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""} defaultValue="">
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Chọn kích thước" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {snackSizeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Giá bán, Số lượng tồn kho */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Giá bán (VNĐ) <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="50000"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="h-11 pr-12"
                              />
                              <span className="text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 transform font-medium">₫</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trạng thái*</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {snackStatusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 ${option.value === "AVAILABLE" ? "bg-green-500" : "bg-gray-500"} rounded-full`}></div>
                                    {option.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end space-x-4 border-t pt-4">
            <Button variant="outline" onClick={onCancel} className="px-8 py-2">
              Hủy bỏ
            </Button>
            <Button type="submit" className="px-8 py-2">
              {snack ? "Cập nhật" : "Thêm"} đồ ăn
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SnackForm;
