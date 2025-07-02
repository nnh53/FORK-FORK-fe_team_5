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
}

const initialValues: Omit<Promotion, "id"> = {
  image: "",
  title: "",
  type: "",
  minPurchase: 0,
  discountValue: 0,
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default to 30 days
  description: "",
  status: "INACTIVE",
};

export const PromotionForm: React.FC<PromotionFormProps> = ({ selectedPromotion }) => {
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

  const handleSubmit = async (values: Omit<Promotion, "id">, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const promotionData = transformPromotionToRequest(values);

      if (selectedPromotion) {
        // Update existing promotion
        await updatePromotion.mutateAsync({
          params: { path: { id: selectedPromotion.id } },
          body: promotionData,
        });
        toast.success("Promotion updated successfully");
      } else {
        // Create new promotion
        await createPromotion.mutateAsync({
          body: promotionData,
        });
        toast.success("Promotion created successfully");
      }
    } catch (error) {
      console.error("Failed to save promotion:", error);
      toast.error("Failed to save promotion");
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
      toast.success("Promotion deleted successfully");
    } catch (error) {
      console.error("Failed to delete promotion:", error);
      toast.error("Failed to delete promotion");
    }
  };

  return (
    <Formik initialValues={formInitialValues} validationSchema={promotionValidationSchema} onSubmit={handleSubmit}>
      {({ setFieldValue, isSubmitting, values }) => (
        <Form className="space-y-6 ">
          <PromotionImageUpload
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            fileInputRef={fileInputRef}
            setFieldValue={setFieldValue}
            formInitialValues={formInitialValues}
          />
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề
            </label>
            <Field
              type="text"
              id="title"
              name="title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              placeholder="Enter promotion title"
            />
            <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
          </div>
          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Loại khuyến mãi
            </label>
            <Field as="select" id="type" name="type" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2">
              <option value="">Chọn loại khuyến mãi</option>
              {promotionTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage name="type" component="div" className="text-red-500 text-sm mt-1" />
          </div>
          {/* Min Purchase and Discount Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="minPurchase" className="block text-sm font-medium text-gray-700 mb-2">
                Đơn tối thiểu
              </label>
              <Field
                type="number"
                id="minPurchase"
                name="minPurchase"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              />
              <ErrorMessage name="minPurchase" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 mb-2">
                Giá trị giảm giá {values.type === "PERCENTAGE" ? "(%)" : "(VND)"}
              </label>
              <Field
                type="number"
                id="discountValue"
                name="discountValue"
                min="0"
                step={values.type === "PERCENTAGE" ? "1" : "0.01"}
                max={values.type === "PERCENTAGE" ? "100" : undefined}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              />
              <ErrorMessage name="discountValue" component="div" className="text-red-500 text-sm mt-1" />
            </div>
          </div>
          {/* Start Time and End Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian bắt đầu
              </label>
              <Field
                type="datetime-local"
                id="startTime"
                name="startTime"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              />
              <ErrorMessage name="startTime" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian kết thúc
              </label>
              <Field
                type="datetime-local"
                id="endTime"
                name="endTime"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              />
              <ErrorMessage name="endTime" component="div" className="text-red-500 text-sm mt-1" />
            </div>
          </div>
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <Field
              as="textarea"
              id="description"
              name="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              placeholder="Enter promotion description"
            />
            <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
          </div>
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <Field
              as="select"
              id="status"
              name="status"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            >
              {promotionStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage name="status" component="div" className="text-red-500 text-sm mt-1" />
          </div>
          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(() => {
                if (isSubmitting) return "Đang lưu...";
                return selectedPromotion ? "Cập nhật khuyến mãi" : "Tạo khuyến mãi";
              })()}
            </Button>
            {selectedPromotion && (
              <Button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting || deletePromotion.isPending}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletePromotion.isPending ? "Đang xóa..." : "Xóa"}
              </Button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};
