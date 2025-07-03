import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Textarea } from "@/components/Shadcn/ui/textarea";
import type { Snack } from "@/interfaces/snacks.interface";
import { snackCategoryOptions, snackSizeOptions, snackStatusOptions } from "@/services/snackService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { ImageIcon, Upload, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface SnackFormProps {
  snack?: Snack;
  onSubmit: (data: Omit<Snack, "id">) => void;
  onCancel: () => void;
}

// Update formSchema to include flavor
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
  const [dragActive, setDragActive] = useState(false);

  // Update defaultValues and reset logic
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

  useEffect(() => {
    if (snack) {
      // Nếu có snack -> chỉnh sửa, đảm bảo các trường phù hợp với interface mới
      setTimeout(() => {
        form.reset({
          img: snack.img,
          name: snack.name,
          category: snack.category,
          size: snack.size,
          flavor: snack.flavor,
          description: snack.description,
          price: snack.price,
          status: snack.status,
        });
      }, 0);
    } else {
      // Thêm mới với giá trị mặc định
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      form.setValue("img", fileUrl);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fileUrl = URL.createObjectURL(file);
      form.setValue("img", fileUrl);
    }
  };

  const clearImage = () => {
    form.setValue("img", "");
  };

  const currentImage = form.watch("img");

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Khu vực upload hình và form */}
          <div className="grid grid-cols-5 gap-8">
            {/* Upload ảnh (2/5 width) */}
            <div className="col-span-2">
              <Card className="hover:border-primary h-full border-2 border-dashed border-gray-300 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ImageIcon className="h-5 w-5" />
                    Hình ảnh
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex h-full flex-col space-y-4">
                  <div
                    className={`relative flex-1 overflow-hidden rounded-lg border-2 border-dashed transition-all duration-200 ${
                      dragActive ? "border-primary bg-primary/5" : "hover:border-primary border-gray-300"
                    }`}
                    style={{ minHeight: "200px" }}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {currentImage ? (
                      <div className="group relative h-full w-full">
                        <img
                          src={currentImage}
                          alt="Snack preview"
                          className="h-full w-full object-cover"
                          onError={() => {
                            form.setError("img", { message: "Invalid image URL" });
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <div className="space-y-2 text-center text-white">
                            <Upload className="mx-auto h-5 w-5" />
                            <p className="text-xs font-medium">Kéo thả để thay đổi</p>
                            <p className="text-xs">hoặc click chọn file</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute right-2 top-2 h-6 w-6 p-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                          onClick={clearImage}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <input
                          type="file"
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-4">
                        <div className="text-center">
                          <Upload className="mx-auto mb-3 h-8 w-8 text-gray-400" />
                          <div className="space-y-1">
                            <label htmlFor="file-upload" className="cursor-pointer">
                              <span className="block text-sm font-medium text-gray-900">
                                Kéo thả ảnh vào đây hoặc <span className="text-primary underline">click để chọn file</span>
                              </span>
                            </label>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                          </div>
                          <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="img"
                    render={({ field }) => (
                      <FormItem className="mt-auto">
                        <FormLabel className="text-sm">Hoặc nhập URL hình ảnh</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Form chính (3/5 width) */}
            <div className="col-span-3 h-full">
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
                          <FormLabel>Tên đồ ăn*</FormLabel>
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
                        <FormLabel>Mô tả*</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Mô tả sản phẩm..." {...field} className="resize-none" rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Danh mục, Kích thước, Trạng thái */}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Cập nhật các giá trị enum của category */}
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Danh mục*</FormLabel>
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

                    {/* Cập nhật giá trị enum của kích thước */}
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kích thước*</FormLabel>
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

                    {/* Cập nhật giá trị enum của trạng thái */}
                  </div>

                  {/* Giá bán, Số lượng tồn kho */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giá bán (VNĐ)*</FormLabel>
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
