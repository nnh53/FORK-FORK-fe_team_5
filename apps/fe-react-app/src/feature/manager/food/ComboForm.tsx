import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Textarea } from "@/components/Shadcn/ui/textarea";
import ImageUpload from "@/components/shared/ImageUpload";
import { type Combo, type ComboForm as ComboFormType } from "@/interfaces/combo.interface";
import { comboStatusOptions } from "@/services/comboService";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";
import React, { useEffect } from "react";
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
          status: combo.status as "AVAILABLE" | "UNAVAILABLE" | undefined,
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

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
                          previewSize="auto"
                          preserveAspectRatio={true}
                          error={fieldState.error?.message}
                          layout="vertical"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Form fields (3/5 width) */}
            <div className="space-y-6 md:col-span-3">
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
                          <Textarea placeholder="Mô tả ngắn về combo này" className="min-h-32 resize-none" {...field} />
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
                        <Select onValueChange={field.onChange} value={field.value}>
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

                  <div className="flex justify-end gap-2 pt-4">
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
