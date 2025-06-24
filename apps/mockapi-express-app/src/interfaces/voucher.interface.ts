export interface MyVoucher {
  voucherId: string;
  voucherDescription: string;
  voucherType: string;
  expiredDate: string;
}

export interface MyVoucherHistory {
  date: string;
  voucherId: string;
  voucherDescription: string;
  status: string;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  applicableMovies?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VoucherValidationResult {
  isValid: boolean;
  voucher?: Voucher;
  discount: number;
  message: string;
}
