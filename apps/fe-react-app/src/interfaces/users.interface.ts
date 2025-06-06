import { type Role } from "./roles.interface";

export type Member = User;
export type Staff = User;

export type USER_STATUS = "VERIFY" | "UNVERIFY" | "BANNED";

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
}

export type RegisterDTO = UserRegister &{
    confirm_password: string;
    status: string;
    role_id: number;
}

export type UpdatePasswordDTO = {
    email: string;
    new_password: string;
    old_password: string;
}
