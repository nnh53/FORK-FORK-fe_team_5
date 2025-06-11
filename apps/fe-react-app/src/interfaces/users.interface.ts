import { type Role } from './roles.interface';

export type Member = User;
export type Staff = User;

export type USER_STATUS = 'VERIFY' | 'UNVERIFY' | 'BANNED';

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role_name: string;
}

export type LoginDTO = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  tokenType: string;
  id: string;
  roles: Role[];
  username: string;
  message: string;
};

export type UserRegister = {
  full_name: string;
  email: string;
  password: string;
  // phoneNumber: string;
  // address: string;
  role_name: string;
};

export type RegisterDTO = UserRegister & {
  confirm_password: string;
  status: string;
  role_id: number;
};

export type UpdatePasswordDTO = {
  email: string;
  new_password: string;
  old_password: string;
};
export interface MyInfoData {
  id: string;
  name: string;
  phone: string;
  dob?: string | null;
  email: string;
  gender?: 'Nam' | 'Nu' | 'BD' | null;
  city?: string | null;
  district?: string | null;
  address?: string | null;
  img?: string | null;
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
