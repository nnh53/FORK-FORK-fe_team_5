import { type ROLE_TYPE } from "./roles.interface.ts";

export type USER_STATUS = "ACTIVE" | "BAN";
export type USER_GENDER = "MALE" | "FEMALE" | "OTHER";

// Interface phù hợp với schema của BE - API User interface (from OpenAPI schema)
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address?: string;
  avatar?: string;
  role: string;
  status: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
}

export type UserRequest = {
  email: string;
  fullName: string;
  password: string;
  phone?: string;
  role?: string;
  dateOfBirth?: string;
};

export type UserUpdate = {
  fullName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role?: string;
  status?: string;
  gender?: USER_GENDER;
  dateOfBirth?: string;
};

// Interface cho phản hồi từ API Authentication
export interface AuthenticationResponse {
  token: string;
  freshToken: string;
  roles: ROLE_TYPE;
  fullName: string;
  id: string;
}

// Giữ nguyên các interface cũ bên dưới
export type UserDetailsResponse = UserBase & {
  created_at: string | null;
  updated_at: string | null;
};

export type MEMBERSHIP_LEVEL = "Silver" | "Gold" | "Platinum" | "Diamond" | null;

export interface UserBase {
  id: string;
  full_name: string;
  date_of_birth: string;
  email: string;
  password: string | null;
  is_active: number;
  is_subscription: number;
  role_name: string;
  status_name: USER_STATUS;
  avatar_url: string;
  loyalty_point: number;
  createdAt: string;
  updatedAt: string;
  totalSpent: number;
  membershipLevel: MEMBERSHIP_LEVEL;
}

export type UserRegisterBase = {
  full_name: string;
  date_of_birth?: string;
  email: string;
  password: string;
};

export type UserRegisterDTO = UserRegisterBase & {
  confirm_password: string;
  status: string;
  role_id: number;
  receiveEmailNotifications?: boolean;
  acceptPolicy?: boolean;
};

export type StaffRegisterDTO = Omit<UserRegisterBase, "password"> & {
  password: string;
  is_active?: boolean | number;
  is_subscription?: boolean | number;
  avatar_url?: string;
};

export type UpdatePasswordDTO = {
  email: string;
  new_password: string;
};

export interface MyInfoData {
  id: string;
  name: string;
  phone: string;
  dob?: string;
  email: string;
  gender?: "Nam" | "Nu" | "BD";
  city?: string;
  district?: string;
  address?: string;
  img?: string | Blob;
}

export interface MyMembershipData {
  cardNumber: string;
  tier: string;
  activationDate: string;
  totalSpent: number;
  accumulatePoints: number;
  usedPoints: number;
  availablePoints: number;
  nearExpiringPoints: number;
  expiredDate: string;
}

export interface MyPointHistory {
  date: string;
  points: string;
  description: string;
}

export interface MyPoint {
  accumulatePoints: number;
  usedPoints: number;
  availablePoints: number;
  nearExpiringPoints: number;
  pointHistory: MyPointHistory[];
}

// của login

export type LoginDTO = {
  email: string;
  password: string;
};

export type Member = UserBase;
export type Staff = UserBase;

export type UserLoginResponse = {
  id: string;
  fullName: string;
  roles: ROLE_TYPE[];
  token: string;
  refresh_token: string;
};

// API User interface (from OpenAPI schema)
export interface ApiUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address?: string;
  avatar?: string;
  role: string;
  status: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
}

// Legacy alias for backward compatibility
