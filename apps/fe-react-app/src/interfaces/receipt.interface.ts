// Receipt related interfaces based on backend schema
export interface Receipt {
  id?: number;
  user?: {
    id?: string;
    fullName?: string;
    email?: string;
    phone?: string;
  };
  bookingId?: number;
  movieId?: number;
  movieName?: string;
  showtime?: string;
  promotionName?: string;
  roomName?: string;
  items?: ReceiptItem[];
  totalAmount?: number;
  paymentMethod?: "CASH" | "ONLINE";
  refunded?: boolean;
  paymentReference?: string;
  issuedAt?: string;
  addedPoints?: number;
  usedPoints?: number;
  refundedPoints?: number;
  ticketCount?: number;
}

export interface ReceiptItem {
  id?: number;
  receipt?: Receipt;
  name?: string;
  unitPrice?: number;
  totalPrice?: number;
  quantity?: number;
  type?: "COMBO" | "SNACK" | "TICKET";
}

export interface ReceiptFilterRequest {
  userId?: string;
  fromDate?: string;
  toDate?: string;
  bookingId?: string;
  movieName?: string;
  paymentMethod?: "CASH" | "ONLINE";
  refunded?: boolean;
  minAmount?: number;
  maxAmount?: number;
}

// For GET /receipt/topMovie endpoint
export interface MovieTrendingResponse {
  movieId?: number;
  movieName?: string;
  ticketCount?: number;
  totalRevenue?: number;
}

import type { components } from "@/schema-from-be";

// API Response wrappers from backend schema
export type ApiResponseListReceipt = components["schemas"]["ApiResponseListReceipt"];

export type ApiResponseListMovieTrendingResponse =
  components["schemas"]["ApiResponseListMovieTrendingResponse"];
