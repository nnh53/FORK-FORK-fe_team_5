import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Textarea } from "@/components/Shadcn/ui/textarea";
import ImageUpload from "@/components/shared/ImageUpload";
import { useMediaQuery } from "@/hooks/use-media-query"; // Import hook
import { type Combo, type ComboForm as ComboFormType } from "@/interfaces/combo.interface";
import { comboStatusOptions } from "@/services/comboService";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ImageIcon } from "lucide-react";
import React, { useState } from "react";
import * as Yup from "yup";

interface ComboFormProps {
  combo?: Combo;
  onSubmit: (data: ComboFormType) => void;
  onCancel: () => void;
}

// Component hiển thị trường form với xử lý lỗi
interface FormFieldProps {
  name: string;
  label: string;
  as?: typeof Input | typeof Textarea;
  errors?: Record<string, unknown>; // More specific type for errors
  touched?: Record<string, unknown>; // More specific type for touched
  required?: boolean;
  [key: string]: unknown;
}

// Component hiển thị trường select
interface SelectFieldProps {
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  errors: Record<string, unknown>; // More specific type for errors
  touched: Record<string, unknown>; // More specific type for touched
  setFieldValue: (field: string, value: unknown) => void;
  value: string;
  required?: boolean;
}

// Schema validation với Yup thay vì Zod
const comboValidationSchema = Yup.object({
  img: Yup.string().required("Hình ảnh là bắt buộc"),
  name: Yup.string().required("Tên combo là bắt buộc"),
  description: Yup.string().required("Mô tả là bắt buộc"),
  status: Yup.string().oneOf(["AVAILABLE", "UNAVAILABLE"], "Trạng thái không hợp lệ").required("Trạng thái là bắt buộc"),
  price: Yup.number().min(0, "Giá không được âm").required("Giá là bắt buộc"),
  discount: Yup.number().min(0, "Giảm giá không được âm").required("Giảm giá là bắt buộc"),
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
      <SelectTrigger className={`${errors[name] && touched[name] ? "border-destructive focus-visible:ring-destructive" : ""}`}>
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

const ComboForm: React.FC<ComboFormProps> = ({ combo, onSubmit, onCancel }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Giá trị ban đầu cho form
  const initialValues: ComboFormType = combo
    ? {
        img: combo.img || "",
        name: combo.name || "",
        description: combo.description || "",
        status: combo.status as "AVAILABLE" | "UNAVAILABLE",
        price: combo.price || 0,
        discount: combo.discount || 0,
        snacks: combo.snacks || [],
      }
    : {
        img: "",
        name: "",
        description: "",
        status: "AVAILABLE",
        price: 0,
        discount: 0,
        snacks: [],
      };

  const handleSubmit = (values: ComboFormType) => {
    onSubmit(values);
  };

  return (
    <div className="w-full">
      <Formik initialValues={initialValues} validationSchema={comboValidationSchema} onSubmit={handleSubmit}>
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
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
                        currentImage={imagePreview ?? (values.img || "")}
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
                        previewSize="auto"
                        preserveAspectRatio={true}
                        error={errors.img && touched.img ? String(errors.img) : undefined}
                        layout="vertical"
                      />
                      {errors.img && touched.img && <div className="text-destructive text-sm">{String(errors.img)}</div>}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Form fields (3/5 width) */}
              <div className={isMobile ? "w-full space-y-6" : "space-y-6 md:col-span-3"}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Thông tin combo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField name="name" label="Tên combo" placeholder="Nhập tên combo" errors={errors} touched={touched} required />

                    <FormField
                      name="description"
                      label="Mô tả"
                      as={Textarea}
                      placeholder="Mô tả ngắn về combo này"
                      className="min-h-32 resize-none"
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">Giá tổng (VND)</Label>
                        <div className="flex items-center gap-2">
                          <Field as={Input} name="price" type="number" readOnly disabled className="bg-gray-50" />
                          <div className="text-muted-foreground text-sm">(Tự động tính dựa trên giá thực phẩm)</div>
                        </div>
                        <ErrorMessage name="price" component="div" className="text-destructive text-sm" />
                      </div>

                      <FormField name="discount" label="Giảm giá (VND)" type="number" placeholder="Nhập giảm giá" required />
                    </div>

                    <SelectField
                      name="status"
                      label="Trạng thái"
                      options={comboStatusOptions}
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                      value={values.status || ""}
                      required
                    />

                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={onCancel}>
                        Hủy
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {combo ? "Cập nhật" : "Tạo combo"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ComboForm;
