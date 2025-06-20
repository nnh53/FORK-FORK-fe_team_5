import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Food } from "@/interfaces/foodAndCombo.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Upload, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FoodFormProps {
  food?: Food;
  onSubmit: (data: Omit<Food, "id">) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  comboId: z.number().min(1, "Combo ID is required"),
  img: z.string().min(1, "Image URL is required"),
  name: z.string().min(1, "Food name is required"),
  category: z.enum(["drink", "food", "combo"], { required_error: "Category is required" }),
  size: z.enum(["S", "M", "L", "XL"], { required_error: "Size is required" }),
  flavor: z.string().min(1, "Flavor is required"),
  price: z.number().min(1000, "Price must be at least 1,000 VND"),
  quantity: z.number().min(0, "Quantity must be at least 0"),
  status: z.enum(["sold", "available"], { required_error: "Status is required" }),
});

const FoodForm: React.FC<FoodFormProps> = ({ food, onSubmit, onCancel }) => {
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comboId: 0,
      img: "",
      name: "",
      category: undefined, // Không có giá trị mặc định
      size: undefined, // Không có giá trị mặc định
      flavor: "",
      price: 0,
      quantity: 0,
      status: "available" as const,
    },
  });

  useEffect(() => {
    if (food) {
      // Sử dụng setTimeout để đảm bảo form được reset sau khi render
      setTimeout(() => {
        form.reset({
          comboId: food.comboId,
          img: food.img,
          name: food.name,
          category: food.category,
          size: food.size,
          flavor: food.flavor,
          price: food.price,
          quantity: food.quantity,
          status: food.status,
        });
      }, 0);
    } else {
      // Reset về giá trị mặc định khi tạo mới
      form.reset({
        comboId: 0,
        img: "",
        name: "",
        category: undefined,
        size: undefined,
        flavor: "",
        price: 0,
        quantity: 0,
        status: "available" as const,
      });
    }
  }, [food, form]);

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
          <div className="grid grid-cols-5 gap-8">
            {/* Cột trái - Upload & Preview ảnh (2/5 width) */}
            <div className="col-span-2">
              <Card className="border-2 border-dashed border-gray-300 hover:border-primary transition-colors h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Hình ảnh
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 h-full flex flex-col">
                  {/* Combined Upload/Preview Area */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg transition-all duration-200 overflow-hidden flex-1 ${
                      dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
                    }`}
                    style={{ minHeight: "200px" }}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {currentImage ? (
                      // Preview Mode
                      <div className="relative w-full h-full group">
                        <img
                          src={currentImage}
                          alt="Food preview"
                          className="w-full h-full object-cover"
                          onError={() => {
                            form.setError("img", { message: "Invalid image URL" });
                          }}
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <div className="text-white text-center space-y-2">
                            <Upload className="mx-auto h-5 w-5" />
                            <p className="text-xs font-medium">Kéo thả để thay đổi</p>
                            <p className="text-xs">hoặc click chọn file</p>
                          </div>
                        </div>
                        {/* Delete button */}
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0"
                          onClick={clearImage}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {/* Hidden file input */}
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                    ) : (
                      // Upload Mode
                      <div className="w-full h-full flex items-center justify-center p-4">
                        <div className="text-center">
                          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
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

                  {/* URL Input */}
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

            {/* Cột phải - Form thông tin (3/5 width) */}
            <div className="col-span-3">
              <Card className="h-full">
                <CardContent className="space-y-4">
                  {/* Row 1: Tên đồ ăn */}
                  <div className="gap-4">
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
                  </div>

                  {/* Row 2: Trạng thái và Combo ID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              <SelectItem value="available">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  Có sẵn
                                </div>
                              </SelectItem>
                              <SelectItem value="sold">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  Hết hàng
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="comboId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Combo ID*</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="VD: 1001"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 3: Danh mục và Kích thước */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              <SelectItem value="food">🍽️ Thức ăn</SelectItem>
                              <SelectItem value="drink">🥤 Đồ uống</SelectItem>
                              <SelectItem value="combo">🍕 Combo</SelectItem>
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
                          <FormLabel>Kích thước*</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""} defaultValue="">
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Chọn kích thước" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="S">S - Nhỏ</SelectItem>
                              <SelectItem value="M">M - Vừa</SelectItem>
                              <SelectItem value="L">L - Lớn</SelectItem>
                              <SelectItem value="XL">XL - Siêu lớn</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 4: Hương vị */}
                  <div className="">
                    <FormField
                      control={form.control}
                      name="flavor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hương vị*</FormLabel>
                          <FormControl>
                            <Input placeholder="VD: Cay nhẹ, Ngọt thanh..." {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 5: Giá bán và Số lượng tồn kho */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">₫</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số lượng tồn kho*</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="100"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button variant="outline" onClick={onCancel} className="px-8 py-2">
              Hủy bỏ
            </Button>
            <Button type="submit" className="px-8 py-2">
              {food ? "Cập nhật" : "Thêm"} đồ ăn
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FoodForm;
