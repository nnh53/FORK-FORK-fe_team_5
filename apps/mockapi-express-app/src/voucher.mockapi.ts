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

export const mockVouchers: MyVoucher[] = [
  {
    voucherId: "VOUCHER1001",
    voucherDescription: "10% off on electronics",
    voucherType: "Discount",
    expiredDate: "2025-07-01",
  },
  {
    voucherId: "VOUCHER1002",
    voucherDescription: "Free shipping",
    voucherType: "Shipping",
    expiredDate: "2025-08-15",
  },
  {
    voucherId: "VOUCHER1003",
    voucherDescription: "$5 cashback on next order",
    voucherType: "Cashback",
    expiredDate: "2025-06-30",
  },
];

export const mockVoucherHistory: MyVoucherHistory[] = [
  {
    date: "2025-05-01",
    voucherId: "VOUCHER1001",
    voucherDescription: "10% off on electronics",
    status: "Used",
  },
  {
    date: "2025-04-15",
    voucherId: "VOUCHER1004",
    voucherDescription: "15% on first order",
    status: "Expired",
  },
];
