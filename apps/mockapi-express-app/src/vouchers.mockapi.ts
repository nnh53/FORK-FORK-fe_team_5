// Vouchers mock API
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

// Mock data
export const vouchersMockData: Voucher[] = [
  {
    id: "V001",
    code: "WELCOME10",
    title: "Chào mừng thành viên mới",
    description: "Giảm 10% cho lần đặt vé đầu tiên",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 100000,
    maxDiscountAmount: 50000,
    startDate: "2025-01-01T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
    usageLimit: 1000,
    usedCount: 150,
    isActive: true,
    applicableMovies: [],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-06-19T00:00:00Z",
  },
  {
    id: "V002",
    code: "MOVIE50K",
    title: "Giảm cố định 50K",
    description: "Giảm ngay 50.000đ cho đơn hàng từ 200.000đ",
    discountType: "fixed",
    discountValue: 50000,
    minOrderAmount: 200000,
    startDate: "2025-06-01T00:00:00Z",
    endDate: "2025-06-30T23:59:59Z",
    usageLimit: 500,
    usedCount: 89,
    isActive: true,
    applicableMovies: [],
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: "2025-06-19T00:00:00Z",
  },
  {
    id: "V003",
    code: "WEEKEND20",
    title: "Cuối tuần vui vẻ",
    description: "Giảm 20% cho suất chiếu cuối tuần",
    discountType: "percentage",
    discountValue: 20,
    minOrderAmount: 150000,
    maxDiscountAmount: 100000,
    startDate: "2025-06-01T00:00:00Z",
    endDate: "2025-08-31T23:59:59Z",
    usageLimit: 300,
    usedCount: 45,
    isActive: true,
    applicableMovies: [],
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: "2025-06-19T00:00:00Z",
  },
  {
    id: "V004",
    code: "EXPIRED50",
    title: "Mã đã hết hạn",
    description: "Mã giảm giá đã hết hạn sử dụng",
    discountType: "fixed",
    discountValue: 50000,
    minOrderAmount: 100000,
    startDate: "2025-01-01T00:00:00Z",
    endDate: "2025-05-31T23:59:59Z",
    usageLimit: 100,
    usedCount: 100,
    isActive: false,
    applicableMovies: [],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-05-31T00:00:00Z",
  },
  {
    id: "V005",
    code: "SUMMER100",
    title: "Hè sôi động",
    description: "Giảm 100.000đ cho đơn hàng từ 500.000đ",
    discountType: "fixed",
    discountValue: 100000,
    minOrderAmount: 500000,
    startDate: "2025-06-01T00:00:00Z",
    endDate: "2025-08-31T23:59:59Z",
    usageLimit: 200,
    usedCount: 12,
    isActive: true,
    applicableMovies: [],
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: "2025-06-19T00:00:00Z",
  },
];

// Vouchers API
export const vouchersAPI = {
  getAll: (): Voucher[] => {
    return vouchersMockData;
  },

  getActive: (): Voucher[] => {
    const now = new Date();
    return vouchersMockData.filter(
      (voucher) =>
        voucher.isActive && new Date(voucher.startDate) <= now && new Date(voucher.endDate) >= now && voucher.usedCount < voucher.usageLimit,
    );
  },

  getById: (id: string): Voucher | null => {
    return vouchersMockData.find((voucher) => voucher.id === id) || null;
  },

  getByCode: (code: string): Voucher | null => {
    return vouchersMockData.find((voucher) => voucher.code.toUpperCase() === code.toUpperCase()) || null;
  },

  validateVoucher: (code: string, orderAmount: number, movieId?: string): VoucherValidationResult => {
    const voucher = vouchersAPI.getByCode(code);

    if (!voucher) {
      return {
        isValid: false,
        discount: 0,
        message: "Mã giảm giá không tồn tại",
      };
    }

    if (!voucher.isActive) {
      return {
        isValid: false,
        discount: 0,
        message: "Mã giảm giá đã bị vô hiệu hóa",
      };
    }

    const now = new Date();
    if (new Date(voucher.startDate) > now) {
      return {
        isValid: false,
        discount: 0,
        message: "Mã giảm giá chưa có hiệu lực",
      };
    }

    if (new Date(voucher.endDate) < now) {
      return {
        isValid: false,
        discount: 0,
        message: "Mã giảm giá đã hết hạn",
      };
    }

    if (voucher.usedCount >= voucher.usageLimit) {
      return {
        isValid: false,
        discount: 0,
        message: "Mã giảm giá đã hết lượt sử dụng",
      };
    }

    if (orderAmount < voucher.minOrderAmount) {
      return {
        isValid: false,
        discount: 0,
        message: `Đơn hàng tối thiểu ${voucher.minOrderAmount.toLocaleString()} VNĐ`,
      };
    }

    // Check movie restriction
    if (voucher.applicableMovies && voucher.applicableMovies.length > 0 && movieId) {
      if (!voucher.applicableMovies.includes(movieId)) {
        return {
          isValid: false,
          discount: 0,
          message: "Mã giảm giá không áp dụng cho phim này",
        };
      }
    }

    // Calculate discount
    let discount = 0;
    if (voucher.discountType === "fixed") {
      discount = voucher.discountValue;
    } else {
      discount = Math.floor((orderAmount * voucher.discountValue) / 100);
      if (voucher.maxDiscountAmount) {
        discount = Math.min(discount, voucher.maxDiscountAmount);
      }
    }

    // Don't exceed order amount
    discount = Math.min(discount, orderAmount);

    return {
      isValid: true,
      voucher,
      discount,
      message: `Áp dụng thành công! ${voucher.title}`,
    };
  },

  applyVoucher: (code: string, bookingId: string): Voucher | null => {
    const voucher = vouchersAPI.getByCode(code);
    if (voucher) {
      // Increment usage count
      voucher.usedCount += 1;
      voucher.updatedAt = new Date().toISOString();

      // In a real app, we would also record the booking ID
      console.log(`Applied voucher ${code} to booking ${bookingId}`);
    }
    return voucher;
  },

  create: (voucherData: Omit<Voucher, "id" | "createdAt" | "updatedAt" | "usedCount">): Voucher => {
    const newVoucher: Voucher = {
      ...voucherData,
      id: `V${String(vouchersMockData.length + 1).padStart(3, "0")}`,
      usedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    vouchersMockData.push(newVoucher);
    return newVoucher;
  },

  update: (id: string, updateData: Partial<Voucher>): Voucher | null => {
    const index = vouchersMockData.findIndex((voucher) => voucher.id === id);
    if (index === -1) return null;

    vouchersMockData[index] = {
      ...vouchersMockData[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    return vouchersMockData[index];
  },

  delete: (id: string): Voucher | null => {
    const index = vouchersMockData.findIndex((voucher) => voucher.id === id);
    if (index === -1) return null;

    const deletedVoucher = vouchersMockData[index];
    vouchersMockData.splice(index, 1);
    return deletedVoucher;
  },
};
