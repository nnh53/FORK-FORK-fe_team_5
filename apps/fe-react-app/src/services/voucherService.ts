import type { Voucher, VoucherValidationResult } from "@/interfaces/voucher.interface";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const voucherService = {
  // Get all vouchers
  getAllVouchers: async (): Promise<Voucher[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vouchers`);
      return response.data;
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      throw error;
    }
  },

  // Get active vouchers
  getActiveVouchers: async (): Promise<Voucher[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vouchers/active`);
      return response.data;
    } catch (error) {
      console.error("Error fetching active vouchers:", error);
      throw error;
    }
  },

  // Validate voucher code
  validateVoucher: async (code: string, orderAmount: number, movieId?: string): Promise<VoucherValidationResult> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/vouchers/validate`, {
        code,
        orderAmount,
        movieId,
      });
      return response.data;
    } catch (error) {
      console.error("Error validating voucher:", error);
      if (axios.isAxiosError(error) && error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  // Apply voucher (use voucher)
  applyVoucher: async (code: string, bookingId: string): Promise<Voucher> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/vouchers/apply`, {
        code,
        bookingId,
      });
      return response.data;
    } catch (error) {
      console.error("Error applying voucher:", error);
      throw error;
    }
  },

  // Get voucher by code
  getVoucherByCode: async (code: string): Promise<Voucher | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vouchers/code/${code}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error("Error fetching voucher by code:", error);
      throw error;
    }
  },
};
