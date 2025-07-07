import type { UserFormData } from "@/constants/profile";
import { transformUserFormToUpdate, useUpdateUser } from "@/services/userService";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Custom hook for handling user data updates
 * @returns Object containing updateUser function and mutation state
 */
export const useUpdateUserData = () => {
  const updateUserMutation = useUpdateUser();
  const queryClient = useQueryClient();

  const updateUser = useCallback(
    (userId: string, userData: Partial<UserFormData & { avatar?: string }>) => {
      console.log("🔍 useUpdateUserData - userId:", userId);
      console.log("🔍 useUpdateUserData - userData:", userData);

      // Use transform function to properly format the data
      const transformedData = transformUserFormToUpdate({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        avatar: userData.avatar,
        dob: userData.dob,
        gender: userData.gender,
      });

      console.log("🔍 useUpdateUserData - transformedData:", transformedData);

      updateUserMutation.mutate(
        {
          params: { path: { userId } },
          body: transformedData,
        },
        {
          onSuccess: (data) => {
            console.log("✅ User updated successfully from useUpdateUserData:", data);

            // Force invalidate all queries to ensure fresh data
            queryClient.invalidateQueries();

            console.log("🔄 All queries invalidated from useUpdateUserData");
          },
          onError: (error) => {
            console.error("❌ User update failed from useUpdateUserData:", error);
          },
        },
      );
    },
    [updateUserMutation, queryClient],
  );

  return { updateUser, mutation: updateUserMutation };
};
