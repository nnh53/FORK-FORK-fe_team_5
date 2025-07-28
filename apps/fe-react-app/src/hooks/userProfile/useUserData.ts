import { INITIAL_USER_DATA, type UserFormData } from "@/constants/profile";
import { useGetUserById } from "@/services/userService";
import { useEffect, useState } from "react";

/**
 * Custom hook for managing user data fetching and local state synchronization
 * @param userId - The user ID to fetch data for
 * @returns Object containing user info, setter, loading state, and error state
 */
export const useUserData = (userId: string | null) => {
  const { data: userData, isLoading, error } = useGetUserById(userId ?? "");
  const [userInfo, setUserInfo] = useState<UserFormData>(INITIAL_USER_DATA);

  useEffect(() => {
    if (userData?.result) {
      console.log("🔍 useUserData - Updating user info with fresh data:", userData.result);

      setUserInfo({
        id: userData.result.id ?? "",
        name: userData.result.fullName ?? "",
        email: userData.result.email ?? "",
        phone: userData.result.phone ?? "",
        dob: userData.result.dateOfBirth ?? "", // Use dateOfBirth from API
        gender: userData.result.gender?.toLowerCase() ?? "male", // Convert to lowercase
        city: "", // Default since city is not in API response
        address: userData.result.address ?? "",
        img: userData.result.avatar ?? "", // This should now have the new avatar
        avatar: userData.result.avatar ?? "", // Include avatar field
        loyaltyPoint: userData.result.loyaltyPoint ?? 0, // Include loyalty point
      });

      console.log("🔍 useUserData - User info updated with avatar:", userData.result.avatar);
    }
  }, [userData]);

  return { userInfo, setUserInfo, isLoading, error };
};
