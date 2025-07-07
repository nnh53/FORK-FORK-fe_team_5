/**
 * Utility functions for Cloudflare R2 image handling
 */

/**
 * Construct Cloudflare R2 image URL from image ID
 * @param imageId - The image ID returned from /media/upload
 * @returns Full Cloudflare R2 image URL
 */
export const getCloudflareImageUrl = (imageId: string): string => {
  if (!imageId) return "";

  // If it's already a full URL, return as-is
  if (imageId.startsWith("http")) {
    return imageId;
  }

  // Construct Cloudflare R2 URL
  // Replace with your actual Cloudflare R2 domain/bucket
  const CLOUDFLARE_R2_URL = import.meta.env.VITE_CLOUDFLARE_R2_URL ?? "https://your-r2-bucket.r2.dev";

  return `${CLOUDFLARE_R2_URL}/${imageId}`;
};

/**
 * Get image ID from Cloudflare URL
 * @param imageUrl - Full Cloudflare R2 image URL
 * @returns Image ID
 */
export const getImageIdFromUrl = (imageUrl: string): string => {
  if (!imageUrl) return "";

  // If it's not a URL, return as-is (likely already an ID)
  if (!imageUrl.startsWith("http")) {
    return imageUrl;
  }

  // Extract image ID from URL
  const parts = imageUrl.split("/");
  return parts[parts.length - 1];
};

/**
 * Check if the image ID/URL is valid
 * @param imageId - Image ID or URL to validate
 * @returns Boolean indicating if valid
 */
export const isValidImageId = (imageId: string): boolean => {
  return Boolean(imageId && imageId.trim().length > 0);
};
