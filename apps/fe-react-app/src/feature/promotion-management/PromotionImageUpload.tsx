/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Promotion } from "@/interfaces/promotion.interface.";
import React from "react";

interface PromotionImageUploadProps {
  imagePreview: string | null;
  setImagePreview: (img: string | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setFieldValue: (field: string, value: any) => void;
  formInitialValues: Omit<Promotion, "id">;
}

export const PromotionImageUpload: React.FC<PromotionImageUploadProps> = ({
  imagePreview,
  setImagePreview,
  fileInputRef,
  setFieldValue,
  formInitialValues,
}) => (
  <div>
    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
      Image
    </label>
    <div className="flex flex-wrap gap-3">
      {imagePreview ? (
        <img src={imagePreview} className="w-40 h-40" />
      ) : (
        formInitialValues.image && <img src={formInitialValues.image} className="w-100" />
      )}
      <input
        ref={fileInputRef}
        id="image"
        type="file"
        className="input input-bordered w-full pr-2 border-gray-300 rounded-md mt-3"
        placeholder=""
        hidden
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (file) {
            setFieldValue("image", file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
          }
        }}
      />
      <button
        onClick={() => (fileInputRef ? fileInputRef.current?.click() : undefined)}
        type="button"
        className="btn bg-[#44b6ae] hover:bg-[#50918c] text-black border-gray-300 font-semibold text-white"
      >
        TẢI ẢNH LÊN
      </button>
    </div>
    {/* ErrorMessage for image should be rendered in the parent Formik form */}
  </div>
);
