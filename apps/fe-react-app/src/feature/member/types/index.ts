// src/feature/member/types/index.ts
export interface Member {
  member_id: string;
  name: string;
  gender: boolean; // true: Male, false: Female (dựa theo mock data)
  email: string;
  phone: string;
  date_of_birth: string;
  identity_card: string;
  address: string;
  password?: string; // Mật khẩu có thể không luôn cần thiết ở client
  role: "employee" | "customer" | "manager" | string; // Cho phép các role khác nếu API linh hoạt
}
