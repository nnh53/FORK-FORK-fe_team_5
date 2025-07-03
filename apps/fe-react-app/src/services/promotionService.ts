import type { Promotion } from "@/interfaces/promotion.interface";
import type { PromotionResponse } from "@/type-from-be";
import { $api } from "@/utils/api";

// Type aliases for union types
type PromotionStatus = "ACTIVE" | "INACTIVE";
type PromotionType = "PERCENTAGE" | "AMOUNT";

// ==================== PROMOTION API HOOKS ====================

/**
 * Hook for getting all promotions
 */
export const usePromotions = () => {
  return $api.useQuery("get", "/promotions", {});
};

/**
 * Hook for getting a promotion by id
 */
export const usePromotion = (id: number) => {
  return $api.useQuery("get", "/promotions/{id}", {
    params: { path: { id } },
    enabled: !!id,
  });
};

/**
 * Hook for creating a new promotion
 */
export const useCreatePromotion = () => {
  return $api.useMutation("post", "/promotions");
};

/**
 * Hook for updating a promotion
 */
export const useUpdatePromotion = () => {
  return $api.useMutation("put", "/promotions/{id}");
};

/**
 * Hook for deleting a promotion
 */
export const useDeletePromotion = () => {
  return $api.useMutation("delete", "/promotions/{id}");
};

// ==================== TRANSFORMATION FUNCTIONS ====================

/**
 * Transform a promotion response from the API to our interface
 */
export const transformPromotionResponse = (promotionResponse: PromotionResponse): Promotion => {
  return {
    id: promotionResponse.id ?? 0,
    image: promotionResponse.image ?? "",
    title: promotionResponse.title ?? "",
    type: promotionResponse.type ?? "",
    minPurchase: promotionResponse.minPurchase ?? 0,
    discountValue: promotionResponse.discountValue ?? 0,
    startTime: promotionResponse.startTime ?? "",
    endTime: promotionResponse.endTime ?? "",
    description: promotionResponse.description ?? "",
    status: promotionResponse.status ?? "INACTIVE",
  };
};

/**
 * Transform an array of promotion responses
 */
export const transformPromotionsResponse = (promotionsResponse: PromotionResponse[]): Promotion[] => {
  return promotionsResponse.map(transformPromotionResponse);
};

/**
 * Transform a promotion to the format expected by the API
 */
export const transformPromotionToRequest = (promotion: Partial<Promotion>) => {
  return {
    image: promotion.image ?? "",
    title: promotion.title ?? "",
    type: promotion.type ?? "",
    minPurchase: promotion.minPurchase ?? 0,
    discountValue: promotion.discountValue ?? 0,
    startTime: promotion.startTime ?? new Date().toISOString(),
    endTime: promotion.endTime ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default to 30 days
    description: promotion.description ?? "",
    status: promotion.status ?? "INACTIVE",
  };
};

// ==================== UI OPTIONS ====================

/**
 * Options for promotion status select
 */
export const promotionStatusOptions = [
  { value: "ACTIVE" as PromotionStatus, label: "Đang hoạt động" },
  { value: "INACTIVE" as PromotionStatus, label: "Chưa hoạt động" },
];

/**
 * Options for promotion type select
 */
export const promotionTypeOptions = [
  { value: "PERCENTAGE" as PromotionType, label: "Giảm theo phần trăm" },
  { value: "AMOUNT" as PromotionType, label: "Giảm số tiền cố định" },
];

// ==================== HELPER FUNCTIONS ====================

/**
 * Check if a string is a valid promotion status
 */
export const isValidPromotionStatus = (status: string): status is PromotionStatus => {
  return ["ACTIVE", "INACTIVE"].includes(status);
};

/**
 * Check if a string is a valid promotion type
 */
export const isValidPromotionType = (type: string): type is PromotionType => {
  return ["PERCENTAGE", "AMOUNT"].includes(type);
};

/**
 * Get the label for a promotion status
 */
export const getPromotionStatusLabel = (status: PromotionStatus): string => {
  const option = promotionStatusOptions.find((option) => option.value === status);
  return option ? option.label : "Unknown";
};

/**
 * Get the label for a promotion type
 */
export const getPromotionTypeLabel = (type: PromotionType): string => {
  const option = promotionTypeOptions.find((option) => option.value === type);
  return option ? option.label : "Unknown";
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

/**
 * Check if a promotion is active based on its dates and status
 */
export const isPromotionActive = (promotion: Promotion): boolean => {
  if (promotion.status !== "ACTIVE") return false;

  const now = new Date();
  const startTime = new Date(promotion.startTime);
  const endTime = new Date(promotion.endTime);

  return now >= startTime && now <= endTime;
};

/**
 * Format a date string for display
 */
export const formatPromotionDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Calculate discount amount based on promotion type and purchase amount
 */
export const calculateDiscount = (promotion: Promotion, purchaseAmount: number): number => {
  // Return 0 if the promotion is not active or purchase amount is below minimum
  if (!isPromotionActive(promotion) || purchaseAmount < promotion.minPurchase) {
    return 0;
  }

  if (promotion.type === "PERCENTAGE") {
    // Cap the percentage at 100%
    const percentage = Math.min(promotion.discountValue, 100);
    return (purchaseAmount * percentage) / 100;
  } else if (promotion.type === "AMOUNT") {
    // Fixed amount can't be more than the purchase amount
    return Math.min(promotion.discountValue, purchaseAmount);
  }

  // For FREE_ITEM or unknown types, no calculation needed
  return 0;
};
