import type { components } from "@/schema-from-be";

export type Receipt = components["schemas"]["Receipt"];

export type ReceiptItem = components["schemas"]["ReceiptItem"];

export type ReceiptFilterRequest = components["schemas"]["ReceiptFilterRequest"];

export type MovieTrendingResponse = components["schemas"]["MovieTrendingResponse"];

// API Response wrappers from backend schema
export type ApiResponseListReceipt = components["schemas"]["ApiResponseListReceipt"];

export type ApiResponseListMovieTrendingResponse = components["schemas"]["ApiResponseListMovieTrendingResponse"];
