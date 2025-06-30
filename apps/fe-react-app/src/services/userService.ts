import { ROLES } from "@/interfaces/roles.interface";
import type { LoginDTO, UserLoginResponse } from "@/interfaces/users.interface";
import { $api } from "@/utils/api";

export const useLogin = () => {
  return $api.useMutation("post", "/auth/authenticate");
};

export const useRegister = () => {
  return $api.useMutation("post", "/users");
};

export const transformLoginRequest = (data: { email: string; password: string }): LoginDTO => ({
  email: data.email,
  password: data.password,
});

export const transformRegisterRequest = (data: {
  fullName: string;
  email: string;
  password: string;
  dateOfBirth?: Date | string;
  phone: string;
}) => ({
  fullName: data.fullName,
  email: data.email,
  password: data.password,
  role: ROLES.MEMBER,
  dateOfBirth: data.dateOfBirth instanceof Date ? data.dateOfBirth.toISOString().split("T")[0] : data.dateOfBirth,
  phone: data.phone,
});

export const transformUserLoginResponse = (data: {
  id?: string;
  fullName?: string;
  roles?: string;
  token?: string;
  refresh_token?: string;
}): UserLoginResponse => ({
  id: data.id ? parseInt(data.id, 10) : 0,
  fullName: data.fullName ?? "",
  roles: data.roles ? [data.roles as "ADMIN" | "STAFF" | "MEMBER"] : [],
  token: data.token ?? "",
  refresh_token: data.refresh_token ?? "",
});
