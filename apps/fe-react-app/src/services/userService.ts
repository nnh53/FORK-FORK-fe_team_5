import { ROLES } from "@/interfaces/roles.interface";
import type { LoginDTO, UserLoginResponse } from "@/interfaces/users.interface";
import { $api } from "@/utils/api";

export const useLogin = () => {
  return $api.useMutation("post", "/auth/authenticate");
};

export const useRegister = () => {
  return $api.useMutation("post", "/users");
};

export const useGetUserById = (userId: string) => {
  return $api.useQuery("get", "/users/{userId}", {
    params: { path: { userId } },
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  return $api.useMutation("put", "/users/{userId}");
};

export const transformLoginRequest = (data: { email: string; password: string }): LoginDTO => ({
  email: data.email,
  password: data.password,
});

export const transformRegisterRequest = (data: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  dateOfBirth?: Date | string;
  phone: string;
}) => {
  // Validate password match if confirmPassword is provided
  if (data.confirmPassword && data.password !== data.confirmPassword) {
    throw new Error("Mật khẩu không khớp");
  }

  return {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    role: ROLES.MEMBER,
    dateOfBirth: data.dateOfBirth instanceof Date ? data.dateOfBirth.toISOString().split("T")[0] : data.dateOfBirth,
    phone: data.phone,
  };
};

export const transformUserLoginResponse = (data: {
  id?: string;
  fullName?: string;
  roles?: string;
  token?: string;
  refresh_token?: string;
}): UserLoginResponse => ({
  id: data.id ?? "",
  fullName: data.fullName ?? "",
  roles: data.roles ? [data.roles as "ADMIN" | "STAFF" | "MEMBER"] : [],
  token: data.token ?? "",
  refresh_token: data.refresh_token ?? "",
});
