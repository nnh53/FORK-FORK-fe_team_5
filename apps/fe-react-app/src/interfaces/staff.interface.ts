import type { ROLE_TYPE } from "./roles.interface";
import type { USER_STATUS, User, UserBase, UserRequest, UserUpdate } from "./users.interface";

export type STAFF_STATUS = USER_STATUS;

// Loại bỏ các trường chỉ dành cho thành viên
export type Staff = Omit<UserBase, "loyalty_point" | "totalSpent" | "membershipLevel" | "is_subscription">;

export type StaffFormData = Omit<Staff, "id">;

// Interface Staff dựa trên schema mới
export interface StaffUser extends User {
  role: Extract<ROLE_TYPE, "STAFF">;
}

// Hàm lọc user có role là STAFF
export const filterStaffUsers = (users: User[]): StaffUser[] => {
  return users.filter((user) => user.role === "STAFF") as StaffUser[];
};

// Tạo Staff từ request
export type StaffRequest = Omit<UserRequest, "role"> & {
  role: "STAFF";
};

// Cập nhật thông tin Staff
export type StaffUpdate = UserUpdate;
