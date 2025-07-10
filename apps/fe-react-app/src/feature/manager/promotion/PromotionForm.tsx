import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { DateTimePicker } from "@/components/Shadcn/ui/date-time-picker";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Textarea } from "@/components/Shadcn/ui/textarea";
import ImageUpload from "@/components/shared/ImageUpload";
import type { Promotion } from "@/interfaces/promotion.interface";
import { promotionStatusOptions, promotionTypeOptions } from "@/services/promotionService";
import { promotionValidationSchema } from "@/utils/validation.utils";
import { Icon } from "@iconify/react";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { ImageIcon } from "lucide-react";
import React, { useState } from "react";

interface PromotionFormProps {
  selectedPromotion?: Promotion;
  onSubmit: (values: Omit<Promotion, "id">, helpers: FormikHelpers<Omit<Promotion, "id">>) => void;
  onCancel: () => void;
}

interface FormFieldProps {
  name: string;
  label: string;
  icon: string;
  as?: typeof Input | typeof Textarea;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
  [key: string]: unknown;
}

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  icon: string;
  options: Option[];
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setFieldValue: (field: string, value: unknown) => void;
  value: string;
}

const initialValues: Omit<Promotion, "id"> = {
  image: "",
  title: "",
  type: "",
  minPurchase: 0,
  discountValue: 0,
  startTime: "",
  endTime: "",
  description: "",
  status: "inactive",
};

// Helper function to format date for form
const formatDateForForm = (date: string): string => {
  return new Date(date).toISOString().slice(0, 16);
};

// Component to render form field with error handling
const FormField = ({ name, label, icon, as: Component = Input, errors, touched, ...props }: FormFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="flex items-center gap-1">
      <Icon icon={icon} className="h-4 w-4" />
      {label} <span className="text-destructive">*</span>
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

// Component to render select field
const SelectField = ({ name, label, icon, options, errors, touched, setFieldValue, value }: SelectFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="flex items-center gap-1">
      <Icon icon={icon} className="h-4 w-4" />
      {label} <span className="text-destructive">*</span>
    </Label>
    <Select value={value} onValueChange={(val) => setFieldValue(name, val)}>
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
    <ErrorMessage name={name} component="div" className="text-destructive mt-1 text-sm" />
  </div>
);

export const PromotionForm: React.FC<PromotionFormProps> = ({ selectedPromotion, onSubmit, onCancel }) => {
  // Khởi tạo imagePreview là null để có thể phân biệt giữa chưa thay đổi (null) và đã xóa ("")
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // For datetime fields
  const [startDate, setStartDate] = useState<Date | undefined>(selectedPromotion?.startTime ? new Date(selectedPromotion.startTime) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(selectedPromotion?.endTime ? new Date(selectedPromotion.endTime) : undefined);

  const formInitialValues = selectedPromotion
    ? { ...selectedPromotion, startTime: formatDateForForm(selectedPromotion.startTime), endTime: formatDateForForm(selectedPromotion.endTime) }
    : initialValues;

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={promotionValidationSchema}
      onSubmit={(values, helpers) => {
        // Update the date values from our datetime pickers
        const finalValues = {
          ...values,
          startTime: startDate ? startDate.toISOString() : "",
          endTime: endDate ? endDate.toISOString() : "",
        };
        onSubmit(finalValues, helpers);
      }}
    >
      {({ setFieldValue, isSubmitting, values, errors, touched }) => {
        // Determine button text
        let buttonText = "Tạo mới";
        if (isSubmitting) {
          buttonText = "Đang lưu...";
        } else if (selectedPromotion) {
          buttonText = "Cập nhật";
        }

        return (
          <Form className="space-y-6">
            <div className="grid grid-cols-5 gap-8">
              {/* Left column - Image (2/5 width) */}
              <div className="col-span-5 md:col-span-2">
                <Card className="hover:border-primary border-border h-full border-2 border-dashed transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ImageIcon className="h-5 w-5" />
                      Hình ảnh
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex h-full flex-col space-y-4">
                    <ImageUpload
                      currentImage={imagePreview ?? values.image}
                      onImageChange={(imageUrl) => {
                        setImagePreview(imageUrl);
                        setFieldValue("image", imageUrl);
                      }}
                      onImageClear={() => {
                        setImagePreview("");
                        setFieldValue("image", "");
                      }}
                      label=""
                      aspectRatio="16:9"
                      error={errors.image && touched.image ? String(errors.image) : undefined}
                      previewSize="auto"
                      preserveAspectRatio={true}
                      layout="vertical"
                    />
                    {errors.image && touched.image && <div className="text-destructive mt-1 text-sm">{String(errors.image)}</div>}
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Form fields (3/5 width) */}
              <div className="col-span-5 md:col-span-3">
                <Card>
                  <CardContent className="space-y-6">
                    {/* Basic Info Section */}
                    <div className="space-y-4">
                      <FormField
                        name="title"
                        label="Tiêu đề"
                        icon="tabler:tag"
                        placeholder="Nhập tiêu đề khuyến mãi"
                        errors={errors}
                        touched={touched}
                      />

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <SelectField
                          name="type"
                          label="Loại khuyến mãi"
                          icon="tabler:discount-2"
                          options={promotionTypeOptions}
                          errors={errors}
                          touched={touched}
                          setFieldValue={setFieldValue}
                          value={values.type}
                        />

                        <SelectField
                          name="status"
                          label="Trạng thái"
                          icon="tabler:activity"
                          options={promotionStatusOptions}
                          errors={errors}
                          touched={touched}
                          setFieldValue={setFieldValue}
                          value={values.status}
                        />
                      </div>
                    </div>

                    {/* Discount Section */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="relative">
                        <FormField
                          name="minPurchase"
                          label="Đơn tối thiểu"
                          icon="tabler:shopping-cart"
                          type="number"
                          min="0"
                          step="1000"
                          errors={errors}
                          touched={touched}
                        />
                        <div className="text-muted-foreground absolute right-7 top-7">VNĐ</div>
                      </div>

                      <div className="relative">
                        <FormField
                          name="discountValue"
                          label="Giá trị giảm giá"
                          icon="tabler:discount-check"
                          type="number"
                          min="0"
                          step={values.type === "PERCENTAGE" ? "1" : "1000"}
                          max={values.type === "PERCENTAGE" ? "100" : undefined}
                          errors={errors}
                          touched={touched}
                        />
                        <div className="text-muted-foreground absolute right-7 top-7">{values.type === "PERCENTAGE" ? "%" : "VNĐ"}</div>
                      </div>
                    </div>

                    {/* Date Time Section */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <div className="mb-2 flex items-center gap-1">
                          <Icon icon="tabler:calendar-plus" className="h-4 w-4" />
                          <Label>
                            Thời gian bắt đầu <span className="text-destructive">*</span>
                          </Label>
                        </div>
                        <DateTimePicker
                          date={startDate}
                          setDate={(date) => {
                            setStartDate(date);
                            if (date) {
                              setFieldValue("startTime", date.toISOString());
                            }
                          }}
                          error={!!errors.startTime && touched.startTime}
                        />
                        {errors.startTime && touched.startTime && <div className="text-destructive mt-1 text-sm">{String(errors.startTime)}</div>}
                      </div>

                      <div>
                        <div className="mb-2 flex items-center gap-1">
                          <Icon icon="tabler:calendar-minus" className="h-4 w-4" />
                          <Label>
                            Thời gian kết thúc <span className="text-destructive">*</span>
                          </Label>
                        </div>
                        <DateTimePicker
                          date={endDate}
                          setDate={(date) => {
                            setEndDate(date);
                            if (date) {
                              setFieldValue("endTime", date.toISOString());
                            }
                          }}
                          error={!!errors.endTime && touched.endTime}
                        />
                        {errors.endTime && touched.endTime && <div className="text-destructive mt-1 text-sm">{String(errors.endTime)}</div>}
                      </div>
                    </div>

                    {/* Description */}
                    <FormField
                      name="description"
                      label="Mô tả"
                      icon="tabler:file-description"
                      as={Textarea}
                      rows={3}
                      placeholder="Nhập mô tả chi tiết về khuyến mãi"
                      errors={errors}
                      touched={touched}
                    />

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" onClick={onCancel} variant="outline">
                        Hủy
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {buttonText}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
