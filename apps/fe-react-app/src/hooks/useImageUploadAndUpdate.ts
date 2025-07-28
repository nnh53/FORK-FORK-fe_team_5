import type { UserFormData } from "@/constants/profile";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useImageUpload } from "./useImageUpload";
import { useUpdateUserData } from "./userProfile/useUpdateUserData";

/**
 * Combined hook for uploading image and updating user profile
 * This ensures avatar is saved immediately after upload
 */
export const useImageUploadAndUpdate = () => {
  const { uploadImage, isLoading: isUploading, error: uploadError } = useImageUpload();
  const { updateUser, mutation: updateMutation } = useUpdateUserData();
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);

  const uploadAndUpdateAvatar = useCallback(
    async (file: File, userId: string, currentUserData: Partial<UserFormData>) => {
      try {
        console.log("🔍 useImageUploadAndUpdate - Starting upload and update");

        // Step 1: Upload image
        const uploadResult = await uploadImage(file);
        console.log("🔍 useImageUploadAndUpdate - Upload result:", uploadResult);

        setUploadedImageId(uploadResult.result);

        // Step 2: Immediately update user with new avatar (partial update)
        const updatedUserData = {
          avatar: uploadResult.result,
        };

        console.log("🔍 useImageUploadAndUpdate - Updating user with avatar:", updatedUserData);

        // Update user profile with new avatar
        updateUser(userId, updatedUserData);

        // Save to localStorage as backup
        localStorage.setItem("uploadedImageId", uploadResult.result);

        toast.success("Ảnh đã được tải lên và cập nhật thành công!");

        return uploadResult.result;
      } catch (error) {
        console.error("Upload and update failed:", error);
        toast.error("Có lỗi xảy ra khi tải ảnh lên và cập nhật profile");
        throw error;
      }
    },
    [uploadImage, updateUser, setUploadedImageId],
  );

  return {
    uploadAndUpdateAvatar,
    isUploading,
    isUpdating: updateMutation.isPending,
    uploadError,
    updateError: updateMutation.error,
    uploadedImageId,
    setUploadedImageId,
  };
};
