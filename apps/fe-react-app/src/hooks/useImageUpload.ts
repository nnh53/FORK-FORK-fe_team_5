import { compressImage } from "@/services/imageCompressService";
import { $api } from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";

interface UploadResponse {
  code: number;
  message: string;
  result: string; // This is your image ID
}

/**
 * Custom hook for image upload with compression
 * @returns useMutation hook for uploading images
 */
export const useImageUpload = () => {
  const queryClient = useQueryClient();
  const uploadMutation = $api.useMutation("post", "/media/upload");

  const uploadImage = async (file: File) => {
    // Compress image first
    const compressedFile = await compressImage(file);

    // Create FormData
    const formData = new FormData();
    formData.append("file", compressedFile);

    // Use the mutation to upload
    return new Promise<UploadResponse>((resolve, reject) => {
      uploadMutation.mutate(
        {
          body: formData as unknown as { file: string },
        },
        {
          onSuccess: (data) => {
            // Save to localStorage for persistence
            const uploadResponse = data as UploadResponse;
            localStorage.setItem("uploadedImageId", uploadResponse.result);

            // Invalidate related queries if needed
            queryClient.invalidateQueries({ queryKey: ["user"] });

            console.log("Image uploaded successfully:", uploadResponse);
            resolve(uploadResponse);
          },
          onError: (error) => {
            console.error("Upload failed:", error);
            reject(new Error("Upload failed"));
          },
        },
      );
    });
  };

  return {
    uploadImage,
    isLoading: uploadMutation.isPending,
    error: uploadMutation.error,
    reset: uploadMutation.reset,
  };
};

/**
 * Utility function to get the uploaded image ID
 */
export const getUploadedImageId = (): string | null => {
  return localStorage.getItem("uploadedImageId");
};

/**
 * Utility function to clear the uploaded image ID
 */
export const clearUploadedImageId = (): void => {
  localStorage.removeItem("uploadedImageId");
};
