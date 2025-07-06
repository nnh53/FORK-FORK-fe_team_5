import type { UserFormData } from "@/constants/profile";
import { useUpdateUser } from "@/services/userService";
import { useCallback } from "react";

/**
 * Custom hook for handling user data updates
 * @returns Object containing updateUser function and mutation state
 */
export const useUpdateUserData = () => {
  const updateUserMutation = useUpdateUser();

  const updateUser = useCallback(
    (userId: string, userData: Partial<UserFormData>) => {
      const updateData = {
        fullName: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
      };

      updateUserMutation.mutate({
        params: { path: { userId } },
        body: updateData,
      });
    },
    [updateUserMutation],
  );

  return { updateUser, mutation: updateUserMutation };
};
