import { type Role } from "./roles.interface";

export type Member = UserBase;
export type Staff = UserBase;

export type USER_STATUS = "ACTIVE" | "UNVERIFY" | "BAN";

export type UserDetailsResponse = UserBase & {
  created_at: string | null;
  updated_at: string | null;
};

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
}

export type LoginDTO = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type UserLoginResponse = {
  tokenType: string;
  id: number;
  username: string;
  roles: Role[];
  message: string;
  token: string;
  refresh_token: string;
};

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
  dob?: string | "";
  email: string;
  gender?: "Nam" | "Nu" | "BD" | "";
  city?: string | "";
  district?: string | "";
  address?: string | "";
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
