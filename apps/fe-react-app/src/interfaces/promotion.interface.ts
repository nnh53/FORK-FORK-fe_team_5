import type { components } from "@/schema-from-be";

export type Promotion = components["schemas"]["PromotionResponse"];

export interface PromotionRequest {
  id: number;
  image?: File;
  title: string;
  type: string;
  minPurchase: number;
  discountValue: number;
  startTime: string;
  endTime: string;
  description: string;
  status: string;
}

// API Promotion interface from backend schema
export type ApiPromotion = components["schemas"]["PromotionResponse"];
