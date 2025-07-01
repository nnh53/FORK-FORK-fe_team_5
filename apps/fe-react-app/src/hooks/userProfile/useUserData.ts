import { INITIAL_USER_DATA, type UserFormData } from "@/constants/userProfile.constants";
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
      setUserInfo({
        id: userData.result.id ?? "",
        name: userData.result.fullName ?? "",
        email: userData.result.email ?? "",
        phone: userData.result.phone ?? "",
        dob: "", // dateOfBirth is not available in the current API response
        gender: "male", // Default since gender is not in API response
        city: "", // Default since city is not in API response
        address: userData.result.address ?? "",
        img: userData.result.avatar ?? "",
      });
    }
  }, [userData]);

  return { userInfo, setUserInfo, isLoading, error };
};
