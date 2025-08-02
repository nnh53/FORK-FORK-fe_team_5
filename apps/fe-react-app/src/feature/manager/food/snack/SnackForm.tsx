import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Textarea } from "@/components/Shadcn/ui/textarea";
import ImageUpload from "@/components/shared/ImageUpload";
import { useMediaQuery } from "@/hooks/use-media-query"; // Import hook
import type { Snack } from "@/interfaces/snacks.interface";
import { snackCategoryOptions, snackSizeOptions, snackStatusOptions } from "@/services/snackService";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ImageIcon } from "lucide-react";
import React, { useState } from "react";
import * as Yup from "yup";

interface SnackFormProps {
  snack?: Snack;
  onSubmit: (data: Omit<Snack, "id">) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Component hiển thị trường form với xử lý lỗi
interface FormFieldProps {
  name: string;
  label: string;
  as?: typeof Input | typeof Textarea;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
  required?: boolean;
  [key: string]: unknown;
}

// Component hiển thị trường select
interface SelectFieldProps {
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setFieldValue: (field: string, value: unknown) => void;
  value: string;
  required?: boolean;
}

// Schema validation với Yup thay vì Zod
const snackValidationSchema = Yup.object({
  img: Yup.string().required("Hình ảnh là bắt buộc"),
  name: Yup.string().required("Tên đồ ăn là bắt buộc"),
  category: Yup.string().oneOf(["DRINK", "FOOD"], "Danh mục không hợp lệ").required("Danh mục là bắt buộc"),
  size: Yup.string().oneOf(["SMALL", "MEDIUM", "LARGE"], "Kích thước không hợp lệ").required("Kích thước là bắt buộc"),
  flavor: Yup.string().required("Hương vị là bắt buộc"),
  description: Yup.string().required("Mô tả là bắt buộc"),
  price: Yup.number().min(1000, "Giá phải ít nhất 1,000 VNĐ").required("Giá là bắt buộc"),
  status: Yup.string().oneOf(["AVAILABLE", "UNAVAILABLE"], "Trạng thái không hợp lệ").required("Trạng thái là bắt buộc"),
});

// Component để hiển thị trường form cơ bản
const FormField = ({ name, label, as: Component = Input, errors, touched, required = false, ...props }: FormFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="flex items-center gap-1">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <Field
      as={Component}
      id={name}
      name={name}
      className={`${errors?.[name] && touched?.[name] ? "border-destructive focus-visible:ring-destructive" : ""}`}
      {...props}
    />
    <ErrorMessage name={name} component="div" className="text-destructive text-sm" />
  </div>
);

// Component để hiển thị trường select
const SelectField = ({ name, label, options, errors, touched, setFieldValue, value, required = false }: SelectFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="flex items-center gap-1">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <Select value={value || ""} onValueChange={(val) => setFieldValue(name, val)}>
      <SelectTrigger className={`${errors[name] && touched[name] ? "border-destructive focus-visible:ring-destructive" : ""} h-11`}>
        <SelectValue placeholder={`Chọn ${label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <ErrorMessage name={name} component="div" className="text-destructive text-sm" />
  </div>
);

const SnackForm: React.FC<SnackFormProps> = ({ snack, onSubmit, onCancel }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Giá trị ban đầu cho form
  const initialValues: Omit<Snack, "id"> = snack
    ? {
        img: snack.img || "",
        name: snack.name || "",
        category: snack.category as "DRINK" | "FOOD",
        size: snack.size as "SMALL" | "MEDIUM" | "LARGE",
        flavor: snack.flavor || "",
        description: snack.description || "",
        price: snack.price || 0,
        status: snack.status as "AVAILABLE" | "UNAVAILABLE",
      }
    : {
        img: "",
        name: "",
        category: "FOOD",
        size: "MEDIUM",
        flavor: "",
        description: "",
        price: 0,
        status: "AVAILABLE",
      };

  return (
    <div className="w-full">
      <Formik initialValues={initialValues} validationSchema={snackValidationSchema} onSubmit={onSubmit}>
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
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
                    <div>
                      <ImageUpload
                        currentImage={imagePreview !== null ? imagePreview : values.img || ""}
                        onImageChange={(url) => {
                          setImagePreview(url);
                          setFieldValue("img", url);
                        }}
                        onImageClear={() => {
                          setImagePreview("");
                          setFieldValue("img", "");
                        }}
                        label=""
                        aspectRatio="16:9"
                        error={errors.img && touched.img ? String(errors.img) : undefined}
                        previewSize="auto"
                        preserveAspectRatio={true}
                        layout="vertical"
                      />
                      {errors.img && touched.img && <div className="text-destructive text-sm">{String(errors.img)}</div>}
                    </div>
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
                      <FormField name="name" label="Tên đồ ăn" placeholder="VD: Pizza Hải Sản Deluxe" errors={errors} touched={touched} required />
                      <FormField
                        name="flavor"
                        label="Hương vị"
                        placeholder="VD: Vị cay, Vị ngọt, Vị đắng..."
                        errors={errors}
                        touched={touched}
                        required
                      />
                    </div>

                    {/* Mô tả */}
                    <FormField
                      name="description"
                      label="Mô tả"
                      as={Textarea}
                      rows={3}
                      placeholder="Mô tả sản phẩm..."
                      className="resize-none"
                      errors={errors}
                      touched={touched}
                      required
                    />

                    {/* Danh mục, Kích thước, Trạng thái */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <SelectField
                        name="category"
                        label="Danh mục"
                        options={snackCategoryOptions}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                        value={values.category || ""}
                        required
                      />

                      <SelectField
                        name="size"
                        label="Kích thước"
                        options={snackSizeOptions}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                        value={values.size || ""}
                        required
                      />
                    </div>

                    {/* Giá bán, Trạng thái */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="relative">
                        <FormField
                          name="price"
                          label="Giá bán (VNĐ)"
                          type="number"
                          placeholder="50000"
                          min="1000"
                          step="1000"
                          className="h-11 pr-12"
                          errors={errors}
                          touched={touched}
                          required
                        />
                        <span className="text-muted-foreground absolute top-9 right-4 -translate-y-1/2 transform font-medium">₫</span>
                      </div>

                      <SelectField
                        name="status"
                        label="Trạng thái"
                        options={snackStatusOptions}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                        value={values.status || ""}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end space-x-4 border-t pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="px-8 py-2">
                Hủy bỏ
              </Button>
              <Button type="submit" className="px-8 py-2" disabled={isSubmitting}>
                {snack ? "Cập nhật" : "Thêm"} đồ ăn
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SnackForm;
