import type { USER_STATUS, UserBase } from "./users.interface";

export type STAFF_STATUS = USER_STATUS;

// Loại bỏ các trường chỉ dành cho thành viên
export type Staff = Omit<UserBase, "loyalty_point" | "totalSpent" | "membershipLevel" | "is_subscription">;

export type StaffFormData = Omit<Staff, "id">;
