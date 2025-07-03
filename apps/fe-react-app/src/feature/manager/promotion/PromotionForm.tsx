import { Button } from "@/components/Shadcn/ui/button";
import type { Promotion } from "@/interfaces/promotion.interface";
import {
  promotionStatusOptions,
  promotionTypeOptions,
  transformPromotionToRequest,
  useCreatePromotion,
  useDeletePromotion,
  useUpdatePromotion,
} from "@/services/promotionService";
import { promotionValidationSchema } from "@/utils/validation.utils";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { PromotionImageUpload } from "./PromotionImageUpload";

interface PromotionFormProps {
  selectedPromotion?: Promotion;
  onSuccess?: () => void; // Add callback for success handling
}

const initialValues: Omit<Promotion, "id"> = {
  image: "",
  title: "",
  type: "PERCENTAGE", // Set default value to PERCENTAGE
  minPurchase: 0,
  discountValue: 0,
  startTime: new Date().toISOString().slice(0, 16), // Format for datetime-local input
  endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // Default to 30 days
  description: "",
  status: "INACTIVE",
};

export const PromotionForm: React.FC<PromotionFormProps> = ({ selectedPromotion, onSuccess }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Use the hooks from promotionService
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const deletePromotion = useDeletePromotion();

  const toFormattedFormData = (pro: Promotion) => {
    return {
      ...pro,
      startTime: new Date(pro.startTime).toISOString().slice(0, 16),
      endTime: new Date(pro.endTime).toISOString().slice(0, 16),
    };
  };

  const formInitialValues = selectedPromotion ? toFormattedFormData(selectedPromotion) : initialValues;

  const handleSubmit = async (
    values: Omit<Promotion, "id">,
    { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  ) => {
    try {
      const promotionData = transformPromotionToRequest(values);

      if (selectedPromotion) {
        // Update existing promotion
        await updatePromotion.mutateAsync({
          params: { path: { id: selectedPromotion.id } },
          body: promotionData,
        });
        toast.success("Khuyến mãi đã được cập nhật thành công");
      } else {
        // Create new promotion
        await createPromotion.mutateAsync({
          body: promotionData,
        });
        toast.success("Khuyến mãi đã được tạo thành công");
        resetForm();
      }

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to save promotion:", error);
      toast.error("Lưu khuyến mãi thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPromotion) return;

    try {
      await deletePromotion.mutateAsync({
        params: { path: { id: selectedPromotion.id } },
      });
      toast.success("Khuyến mãi đã được xóa thành công");

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to delete promotion:", error);
      toast.error("Xóa khuyến mãi thất bại");
    }
  };

  return (
    <Formik initialValues={formInitialValues} validationSchema={promotionValidationSchema} onSubmit={handleSubmit}>
      {({ setFieldValue, isSubmitting, values }) => (
        <Form className="space-y-6">
          <PromotionImageUpload
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            fileInputRef={fileInputRef}
            setFieldValue={setFieldValue}
            formInitialValues={formInitialValues}
          />

          {/* Title */}
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
              Tiêu đề
            </label>
            <Field
              type="text"
              id="title"
              name="title"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2"
              placeholder="Nhập tiêu đề khuyến mãi"
            />
            <ErrorMessage name="title" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="mb-2 block text-sm font-medium text-gray-700">
              Loại khuyến mãi
            </label>
            <Field as="select" id="type" name="type" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2">
              <option value="">Chọn loại khuyến mãi</option>
              {promotionTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage name="type" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          {/* Min Purchase and Discount Value in a grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="minPurchase" className="mb-2 block text-sm font-medium text-gray-700">
                Đơn tối thiểu (VND)
              </label>
              <Field
                type="number"
                id="minPurchase"
                name="minPurchase"
                min="0"
                step="1000"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2"
              />
              <ErrorMessage name="minPurchase" component="div" className="mt-1 text-sm text-red-500" />
            </div>
            <div>
              <label htmlFor="discountValue" className="mb-2 block text-sm font-medium text-gray-700">
                Giá trị giảm giá {values.type === "PERCENTAGE" ? "(%)" : "(VND)"}
              </label>
              <Field
                type="number"
                id="discountValue"
                name="discountValue"
                min="0"
                step={values.type === "PERCENTAGE" ? "1" : "1000"}
                max={values.type === "PERCENTAGE" ? "100" : undefined}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2"
              />
              <ErrorMessage name="discountValue" component="div" className="mt-1 text-sm text-red-500" />
            </div>
          </div>

          {/* Start Time and End Time in a grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="startTime" className="mb-2 block text-sm font-medium text-gray-700">
                Thời gian bắt đầu
              </label>
              <Field
                type="datetime-local"
                id="startTime"
                name="startTime"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2"
              />
              <ErrorMessage name="startTime" component="div" className="mt-1 text-sm text-red-500" />
            </div>
            <div>
              <label htmlFor="endTime" className="mb-2 block text-sm font-medium text-gray-700">
                Thời gian kết thúc
              </label>
              <Field
                type="datetime-local"
                id="endTime"
                name="endTime"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2"
              />
              <ErrorMessage name="endTime" component="div" className="mt-1 text-sm text-red-500" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <Field
              as="textarea"
              id="description"
              name="description"
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2"
              placeholder="Nhập mô tả khuyến mãi"
            />
            <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="mb-2 block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <Field
              as="select"
              id="status"
              name="status"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2"
            >
              {promotionStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage name="status" component="div" className="mt-1 text-sm text-red-500" />
          </div>

          {/* Submit and Delete Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            {selectedPromotion && (
              <Button type="button" onClick={handleDelete} disabled={isSubmitting || deletePromotion.isPending} variant="destructive">
                {deletePromotion.isPending ? "Đang xóa..." : "Xóa khuyến mãi"}
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {(() => {
                if (isSubmitting) return "Đang lưu...";
                return selectedPromotion ? "Cập nhật khuyến mãi" : "Tạo khuyến mãi";
              })()}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
