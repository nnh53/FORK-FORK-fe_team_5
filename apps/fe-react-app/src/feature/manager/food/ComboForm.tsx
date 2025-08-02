import { Alert, AlertDescription } from "@/components/Shadcn/ui/alert";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Textarea } from "@/components/Shadcn/ui/textarea";
import ImageUpload from "@/components/shared/ImageUpload";
import { useMediaQuery } from "@/hooks/use-media-query"; // Import hook
import { type Combo, type ComboForm as ComboFormType, type ComboSnack } from "@/interfaces/combo.interface";
import { calculateComboPriceWithQuantity, comboStatusOptions, formatPrice } from "@/services/comboService";
import { ErrorMessage, Field, Form, Formik, type FormikProps } from "formik";
import { AlertTriangle, Edit, ImageIcon, PlusCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import ComboDetail from "./ComboDetail";

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
  discount: Yup.number()
    .min(0, "Giảm giá không được âm")
    .required("Giảm giá là bắt buộc")
    .test("discount-validation", "Giảm giá không được lớn hơn giá combo", function (value) {
      // Skip validation if no snacks
      if (!this.parent.snacks || this.parent.snacks.length === 0) return true;

      // Calculate total price from snacks
      const basePrice = calculateComboPriceWithQuantity(this.parent.snacks);
      return value <= basePrice;
    }),
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
  const [showComboDetail, setShowComboDetail] = useState(false);
  const [tempCombo, setTempCombo] = useState<Combo | null>(null);
  const formikRef = useRef<FormikProps<ComboFormType>>(null);
  const initialFormRef = useRef<ComboFormType | null>(null);

  // Giá trị ban đầu cho form - wrapped in useMemo to avoid dependency issues
  const initialValues = React.useMemo<ComboFormType>(
    () =>
      combo
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
            status: "AVAILABLE" as "AVAILABLE" | "UNAVAILABLE",
            price: 0,
            discount: 0,
            snacks: [],
          },
    [combo],
  );

  // Lưu trữ giá trị ban đầu để so sánh sau này
  useEffect(() => {
    initialFormRef.current = JSON.parse(JSON.stringify(initialValues));
  }, [initialValues]);

  // Kiểm tra form có thay đổi thực sự hay không
  const checkForRealChanges = (currentValues: ComboFormType): boolean => {
    if (!initialFormRef.current) return false;

    // So sánh từng trường
    const initialForm = initialFormRef.current;

    // So sánh các trường cơ bản
    const basicFieldsChanged =
      currentValues.name !== initialForm.name ||
      currentValues.description !== initialForm.description ||
      currentValues.discount !== initialForm.discount ||
      currentValues.status !== initialForm.status ||
      currentValues.img !== initialForm.img;

    // So sánh mảng snacks
    if (currentValues.snacks.length !== initialForm.snacks.length) {
      return true; // Số lượng snack thay đổi
    }

    // Kiểm tra từng snack
    for (let i = 0; i < currentValues.snacks.length; i++) {
      const currentSnack = currentValues.snacks[i];
      const initialSnack = initialForm.snacks[i];

      if (
        currentSnack.id !== initialSnack.id ||
        currentSnack.quantity !== initialSnack.quantity ||
        currentSnack.snack?.id !== initialSnack.snack?.id
      ) {
        return true; // Snack có thay đổi
      }
    }

    return basicFieldsChanged;
  };

  const handleSubmit = (values: ComboFormType) => {
    // Tính lại giá tổng của snacks
    const basePrice = calculateComboPriceWithQuantity(values.snacks || []);
    const discount = values.discount || 0;

    // Kiểm tra nếu không có snack trong combo
    if (values.snacks.length === 0) {
      // Tự động đặt trạng thái là UNAVAILABLE nếu không có snack
      values.status = "UNAVAILABLE";
    }
    // Nếu có snack, giá trị discount lớn hơn basePrice -> submit nhưng tự điều chỉnh discount
    else if (discount > basePrice) {
      // Điều chỉnh discount = basePrice để đảm bảo giá combo không bị âm
      values.discount = basePrice;
    }

    onSubmit(values);
  };

  // Tạo combo tạm thời cho ComboDetail từ giá trị form hiện tại
  const createTemporaryCombo = (values: ComboFormType): Combo => {
    return {
      id: combo?.id ?? -Date.now(), // ID tạm thời nếu là combo mới
      ...values,
      status: values.status as "AVAILABLE" | "UNAVAILABLE",
    };
  };

  // Xử lý mở ComboDetail
  const handleOpenComboDetail = (values: ComboFormType) => {
    const tempComboData = createTemporaryCombo(values);
    setTempCombo(tempComboData);
    setShowComboDetail(true);
  };

  // Xử lý thêm snack vào combo tạm
  const handleAddSnack = (comboSnack: Partial<ComboSnack>) => {
    if (formikRef.current) {
      const currentSnacks = [...formikRef.current.values.snacks];
      const newSnack = {
        id: -Date.now(), // ID tạm thời
        snack: comboSnack.snack,
        quantity: comboSnack.quantity || 1,
      } as ComboSnack;

      formikRef.current.setFieldValue("snacks", [...currentSnacks, newSnack]);
      // Formik sẽ tự động cập nhật, không cần setHasChanges
    }
  };

  // Xử lý cập nhật snack trong combo tạm
  const handleUpdateSnack = (updatedComboSnack: ComboSnack) => {
    if (formikRef.current) {
      const currentSnacks = [...formikRef.current.values.snacks];
      const updatedSnacks = currentSnacks.map((snack) => (snack.id === updatedComboSnack.id ? updatedComboSnack : snack));
      formikRef.current.setFieldValue("snacks", updatedSnacks);
      // Formik sẽ tự động cập nhật, không cần setHasChanges
    }
  };

  // Xử lý xóa snack khỏi combo tạm
  const handleDeleteSnack = (comboSnackId: number) => {
    if (formikRef.current) {
      const currentSnacks = [...formikRef.current.values.snacks];
      const filteredSnacks = currentSnacks.filter((snack) => snack.id !== comboSnackId);
      formikRef.current.setFieldValue("snacks", filteredSnacks);
      // Formik sẽ tự động cập nhật, không cần setHasChanges
    }
  };

  // Xử lý khi ComboDetail thông báo có thay đổi
  const handleComboDetailChange = (updatedCombo: Combo) => {
    if (formikRef.current) {
      // Cập nhật giá trị snacks trong formik
      formikRef.current.setFieldValue("snacks", updatedCombo.snacks);

      // Cập nhật tempCombo để giữ trạng thái mới nhất
      setTempCombo(updatedCombo);

      // Formik sẽ tự động cập nhật, không cần setHasChanges
    }
  }; // Kiểm tra sự thay đổi của form khi các trường được chỉnh sửa
  // Kiểm tra sự thay đổi của form khi các trường được chỉnh sửa
  useEffect(() => {
    const handleFieldChange = (e: Event) => {
      // Formik sẽ tự động cập nhật và chúng ta sẽ kiểm tra khi render
    };

    // Thêm event listener
    document.addEventListener("change", handleFieldChange);

    // Cleanup
    return () => {
      document.removeEventListener("change", handleFieldChange);
    };
  }, [combo]);

  return (
    <div className="w-full">
      <Formik initialValues={initialValues} validationSchema={comboValidationSchema} onSubmit={handleSubmit} innerRef={formikRef}>
        {({ values, errors, touched, setFieldValue, isSubmitting }) => {
          // Kiểm tra xem có thay đổi thực sự không mỗi khi component render
          const hasRealChanges = combo ? checkForRealChanges(values) : false;

          return (
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
                            // Formik tự động cập nhật, không cần setHasChanges
                          }}
                          onImageClear={() => {
                            setImagePreview("");
                            setFieldValue("img", "");
                            // Formik tự động cập nhật, không cần setHasChanges
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
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Thông tin combo</CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenComboDetail(values)}
                        className="flex items-center gap-1"
                      >
                        {combo ? (
                          <>
                            <Edit className="h-4 w-4" />
                            <span>Chỉnh sửa thực phẩm trong combo</span>
                          </>
                        ) : (
                          <>
                            <PlusCircle className="h-4 w-4" />
                            <span>Thêm thực phẩm vào combo</span>
                          </>
                        )}
                      </Button>
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
                          <Label className="flex items-center gap-1">Giá tổng (VNĐ)</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              value={formatPrice(calculateComboPriceWithQuantity(values.snacks || []))}
                              readOnly
                              disabled
                              className="bg-gray-50 font-medium"
                            />
                            <div className="text-muted-foreground text-xs">
                              <div className="text-muted-foreground text-xs">Tổng giá của tất cả thực phẩm trong combo</div>
                            </div>
                          </div>
                        </div>

                        <FormField name="discount" label="Giảm giá (VNĐ)" type="number" placeholder="Nhập giảm giá" required />
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

                      {/* Thông báo thay đổi - chỉ hiển thị khi có thay đổi thực sự */}
                      {hasRealChanges && combo && (
                        <Alert className="border-amber-300 bg-amber-50">
                          <AlertTriangle className="h-4 w-4 text-amber-700" />
                          <AlertDescription className="text-amber-800">
                            Bạn đã thực hiện thay đổi cho combo này. Đừng quên nhấn nút "Cập nhật" để lưu lại thay đổi!
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onCancel}>
                          Hủy
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting || (combo && !hasRealChanges)}
                          className={combo && !hasRealChanges ? "cursor-not-allowed opacity-50" : ""}
                        >
                          {combo ? "Cập nhật" : "Tạo combo"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>{" "}
      {/* ComboDetail Modal */}
      {showComboDetail && tempCombo && (
        <ComboDetail
          combo={tempCombo}
          open={showComboDetail}
          onClose={() => setShowComboDetail(false)}
          onAddSnack={handleAddSnack}
          onUpdateSnack={handleUpdateSnack}
          onDeleteSnack={handleDeleteSnack}
          mode={combo?.id ? "edit" : "create"} // Thêm mode dựa vào có combo.id hay không
          isEditMode={Boolean(combo?.id)} // Biết đang ở chế độ edit hay create
          onComboChange={handleComboDetailChange} // Thêm callback
        />
      )}
    </div>
  );
};

export default ComboForm;
