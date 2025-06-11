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
