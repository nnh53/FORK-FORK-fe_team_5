import { clearUploadedImageId, getUploadedImageId } from "@/hooks/useImageUpload";
import { useUpdateUser } from "@/services/userService";
import type { UserUpdate } from "@/type-from-be";
import { useCallback } from "react";

/**
 * Custom hook for updating user data including avatar
 */
export const useUpdateUserWithAvatar = () => {
  const updateUserMutation = useUpdateUser();

  const updateUser = useCallback(
    (userId: string, userData: Partial<UserUpdate>) => {
      // Get the uploaded image ID from localStorage
      const avatarId = getUploadedImageId();

      const updateData: UserUpdate = {
        ...userData,
        avatar: avatarId || userData.avatar || "", // Use uploaded ID or existing avatar
      };

      updateUserMutation.mutate(
        {
          params: { path: { userId } },
          body: updateData,
        },
        {
          onSuccess: (data) => {
            // Clear the uploaded image ID after successful update
            clearUploadedImageId();
            console.log("User updated successfully:", data);
          },
          onError: (error) => {
            console.error("User update failed:", error);
          },
        },
      );
    },
    [updateUserMutation],
  );

  return {
    updateUser,
    mutation: updateUserMutation,
    isLoading: updateUserMutation.isPending,
    error: updateUserMutation.error,
  };
};
