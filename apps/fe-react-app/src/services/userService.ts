import { ROLES, type ROLE_TYPE } from "@/interfaces/roles.interface";
import type { LoginDTO, User, UserLoginResponse, UserRequest, UserUpdate } from "@/interfaces/users.interface";
import type { components } from "@/schema-from-be";
type UserResponse = components["schemas"]["UserResponse"];
import { $api } from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";

// ==================== USER API HOOKS ====================

/**
 * Hook for authentication (login)
 */
export const useLogin = () => {
  return $api.useMutation("post", "/auth/authenticate");
};

/**
 * Hook for registering a new user
 */
export const useRegister = () => {
  return $api.useMutation("post", "/users");
};

/**
 * Hook for getting all users
 */
export const useUsers = () => {
  return $api.useQuery("get", "/users", {});
};

/**
 * Hook for getting a user by ID
 */
export const useGetUserById = (userId: string) => {
  console.log(`userId: =${userId}=`);

  if (userId === "") {
    console.log("userid bị méo tồn tại");
    console.log(`userId: =${userId}=`);
  }

  return $api.useQuery("get", "/users/{userId}", {
    params: { path: { userId } },
    enabled: !!userId && userId.trim() !== "", // Chỉ gọi API khi userId hợp lệ
  });
};

/**
 * Hook for updating a user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return $api.useMutation("put", "/users/{userId}", {
    onSuccess: (data, variables) => {
      console.log("✅ User update successful:", data);
      console.log("🔍 Variables:", variables);

      // Invalidate all queries to ensure fresh data
      queryClient.invalidateQueries();

      console.log("🔄 All queries invalidated - user data will refetch");
    },
    onError: (error) => {
      console.error("❌ User update failed:", error);
    },
  });
};

/**
 * Hook for deleting a user
 */
export const useDeleteUser = () => {
  return $api.useMutation("delete", "/users/{userId}");
};

/**
 * Hook for validating a token
 */
export const useIntrospect = () => {
  return $api.useMutation("post", "/auth/introspect");
};

/**
 * Hook for searching users by email or phone
 */
export const useSearchUser = (searchInput: string) => {
  return $api.useQuery("get", "/users/search", {
    params: {
      query: {
        input: searchInput,
      },
    },
  });
};

// ==================== TRANSFORM FUNCTIONS ====================

/**
 * Transform login request data
 */
export const transformLoginRequest = (data: { email: string; password: string }): LoginDTO => ({
  email: data.email,
  password: data.password,
});

/**
 * Transform register request data
 */
export const transformRegisterRequest = (data: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  dateOfBirth?: Date | string;
  phone: string;
  role?: ROLE_TYPE;
}): UserRequest => {
  // Validate password match if confirmPassword is provided
  if (data.confirmPassword && data.password !== data.confirmPassword) {
    throw new Error("Mật khẩu không khớp");
  }

  return {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    role: data.role ?? ROLES.MEMBER,
    dateOfBirth: data.dateOfBirth instanceof Date ? data.dateOfBirth.toISOString().split("T")[0] : data.dateOfBirth,
    phone: data.phone,
  };
};

/**
 * Transform a user update request
 */
export const transformUserUpdateRequest = (data: Partial<User>): UserUpdate => {
  console.log("🔍 transformUserUpdateRequest - input data:", data);

  const transformed = {
    fullName: data.fullName,
    phone: data.phone,
    address: data.address,
    avatar: data.avatar,
    role: data.role,
    status: data.status,
    gender: data.gender,
    dateOfBirth: data.dateOfBirth,
  };

  console.log("🔍 transformUserUpdateRequest - transformed data:", transformed);

  return transformed;
};

/**
 * Transform a user response from the API to the User interface
 */
export const transformUserResponse = (userResponse: UserResponse): User => {
  return {
    id: userResponse.id ?? "",
    email: userResponse.email ?? "",
    fullName: userResponse.fullName ?? "",
    phone: userResponse.phone ?? "",
    address: userResponse.address ?? "",
    avatar: userResponse.avatar ?? "",
    role: (userResponse.role as ROLE_TYPE) ?? ROLES.MEMBER,
    status: userResponse.status ?? "ACTIVE",
    dateOfBirth: userResponse.dateOfBirth,
    gender: userResponse.gender,
  };
};

/**
 * Transform an array of user responses to an array of User interfaces
 */
export const transformUsersResponse = (usersResponse: UserResponse[]): User[] => {
  return usersResponse.map(transformUserResponse);
};

/**
 * Transform authentication response data
 */

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

/**
 * Transform user form data to UserUpdate request
 */
export const transformUserFormToUpdate = (
  data: Partial<{
    name: string;
    email: string;
    phone: string;
    address: string;
    avatar?: string;
    dob?: string;
    gender?: string;
  }>,
): UserUpdate => {
  console.log("🔍 transformUserFormToUpdate - input data:", data);

  const transformed: UserUpdate = {
    fullName: data.name,
    phone: data.phone,
    address: data.address,
    avatar: data.avatar,
    gender: data.gender as "MALE" | "FEMALE" | "OTHER" | undefined,
    dateOfBirth: data.dob,
  };

  console.log("🔍 transformUserFormToUpdate - transformed data:", transformed);

  return transformed;
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Check if a user has a specific role
 */
export const hasRole = (user: User, role: ROLE_TYPE): boolean => {
  return user.role === role;
};

/**
 * Check if a user is active
 */
export const isUserActive = (user: User): boolean => {
  return user.status === "ACTIVE";
};

/**
 * Format user information for display
 */
export const formatUserName = (user: User): string => {
  return user.fullName || user.email || "Unknown User";
};

/**
 * Format a date string to a localized date
 */
export const formatUserDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN");
};
