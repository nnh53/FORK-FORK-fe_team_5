import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Textarea } from "@/components/Shadcn/ui/textarea";
import { type Combo, type ComboForm as ComboFormType } from "@/interfaces/combo.interface";
import { comboStatusOptions } from "@/services/comboService";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Upload, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ComboFormProps {
  combo?: Combo;
  onSubmit: (data: ComboFormType) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  img: z.string().min(1, "Hình ảnh là bắt buộc"),
  name: z.string().min(1, "Tên combo là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  status: z.enum(["AVAILABLE", "UNAVAILABLE"], { required_error: "Trạng thái là bắt buộc" }),
});

const ComboForm: React.FC<ComboFormProps> = ({ combo, onSubmit, onCancel }) => {
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      img: "",
      name: "",
      description: "",
      status: "AVAILABLE",
    },
  });

  useEffect(() => {
    if (combo) {
      setTimeout(() => {
        form.reset({
          img: combo.img,
          name: combo.name,
          description: combo.description,
          status: combo.status,
        });
      }, 0);
    } else {
      form.reset({
        img: "",
        name: "",
        description: "",
        status: "AVAILABLE",
      });
    }
  }, [combo, form]);

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      snacks: combo?.snacks || [],
    });
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

    if (e.dataTransfer.files?.[0]) {
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Upload ảnh (2/5 width) */}
            <div className="md:col-span-2 h-full">
              <Card className="border-2 border-dashed border-gray-300 hover:border-primary transition-colors h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Hình ảnh
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 h-full flex flex-col">
                  <button
                    type="button"
                    className={`relative border-2 border-dashed rounded-lg transition-all duration-200 overflow-hidden flex-1 ${
                      dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
                    }`}
                    style={{ minHeight: "200px" }}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("file-input")?.click()}
                  >
                    {currentImage ? (
                      <div className="relative w-full h-full group">
                        <img
                          src={currentImage}
                          alt="Combo preview"
                          className="w-full h-full object-cover"
                          onError={() => {
                            form.setError("img", { message: "Invalid image URL" });
                          }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <div className="text-white text-center space-y-2">
                            <Upload className="mx-auto h-5 w-5" />
                            <p className="text-xs font-medium">Kéo thả để thay đổi</p>
                            <p className="text-xs">hoặc click chọn file</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={clearImage}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm font-medium">Kéo thả ảnh vào đây</p>
                          <p className="text-xs text-gray-500 mt-1">hoặc click để chọn file</p>
                          <p className="text-xs text-gray-400 mt-4">PNG, JPG hoặc GIF (tối đa 5MB)</p>
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} id="image-upload" />
                      </label>
                    )}
                  </button>
                  {form.formState.errors.img && <p className="text-sm font-medium text-destructive">{form.formState.errors.img.message}</p>}
                </CardContent>
              </Card>
            </div>

            {/* Form fields (3/5 width) */}
            <div className="md:col-span-3 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Thông tin combo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên combo</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên combo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Mô tả ngắn về combo này" className="resize-none min-h-32" {...field} />
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
                        <FormLabel>Trạng thái</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {comboStatusOptions.map((option) => (
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

                  <div className="pt-4 flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                      Hủy
                    </Button>
                    <Button type="submit">{combo ? "Cập nhật" : "Tạo combo"}</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ComboForm;
