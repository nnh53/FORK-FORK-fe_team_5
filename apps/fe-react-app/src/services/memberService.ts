import type { Member, MemberCreateRequest, PointTransaction } from "@/interfaces/member.interface";
import type { components } from "@/schema-from-be";
import { $api } from "@/utils/api";
import axios from "axios";
type UserResponse = components["schemas"]["UserResponse"];

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/movie_theater`;

// Helper function to convert UserResponse to Member
const transformUserToMember = (user: UserResponse): Member => {
  return {
    id: user.id || "",
    name: user.fullName || "",
    phone: user.phone || "",
    email: user.email || "",
    currentPoints: user.loyaltyPoint || 0,
    membershipLevel: "Silver", // Default level since API doesn't provide this
    totalSpent: 0, // Default since API doesn't provide this
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// ==================== MEMBER API HOOKS ====================

/**
 * Hook for searching users/members by email or phone
 */
export const useSearchMember = (searchInput: string, enabled = true) => {
  return $api.useQuery(
    "get",
    "/users/search",
    {
      params: {
        query: {
          input: searchInput,
        },
      },
    },
    {
      enabled: enabled && !!searchInput,
    },
  );
};

/**
 * Hook for getting all users as members
 */
export const useAllMembers = () => {
  return $api.useQuery("get", "/users", {});
};

/**
 * Transform user search response to Member
 */
export const transformSearchToMember = (response: { data?: { result?: UserResponse } }): Member | null => {
  if (response?.data?.result) {
    return transformUserToMember(response.data.result);
  }
  return null;
};

// ==================== LEGACY MEMBER SERVICE ====================
// Note: These functions are kept for backward compatibility
// Consider migrating to React Query hooks above

export const memberService = {
  // Search member by phone or email using the real API
  searchMember: async (searchValue: string): Promise<Member | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/search`, {
        params: {
          input: searchValue,
        },
      });

      if (response.data?.result) {
        const user = response.data.result;
        // Convert UserResponse to Member format using helper function
        return transformUserToMember(user);
      }
      return null;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Get member by phone (now uses searchMember)
  getMemberByPhone: async (phone: string): Promise<Member | null> => {
    return memberService.searchMember(phone);
  },

  // Get member by email (now uses searchMember)
  getMemberByEmail: async (email: string): Promise<Member | null> => {
    return memberService.searchMember(email);
  },

  // Get all users (using real API users endpoint)
  getAllMembers: async (): Promise<Member[]> => {
    const response = await axios.get(`${API_BASE_URL}/users`);
    if (response.data?.result && Array.isArray(response.data.result)) {
      return response.data.result.map(transformUserToMember);
    }
    return [];
  },

  // Note: The following functions are kept for backward compatibility but may not work
  // until corresponding endpoints are implemented in the backend

  // Create new member (placeholder - may need backend implementation)
  createMember: async (memberData: MemberCreateRequest): Promise<Member> => {
    const response = await axios.post(`${API_BASE_URL}/users`, memberData);
    return response.data;
  },

  // Update member points (placeholder - may need backend implementation)
  updateMemberPoints: async (memberId: string, points: number, type: "earn" | "redeem", description: string): Promise<Member> => {
    // This endpoint may not exist yet - keeping for compatibility
    const response = await axios.post(`${API_BASE_URL}/users/${memberId}/points`, {
      points,
      type,
      description,
    });
    return response.data;
  },

  // Get member's point transactions (placeholder - may need backend implementation)
  getMemberTransactions: async (memberId: string): Promise<PointTransaction[]> => {
    // This endpoint may not exist yet - keeping for compatibility
    const response = await axios.get(`${API_BASE_URL}/users/${memberId}/transactions`);
    return response.data;
  },

  // Redeem points for discount (placeholder - may need backend implementation)
  redeemPoints: async (memberId: string, points: number): Promise<{ discount: number; newPoints: number }> => {
    // This endpoint may not exist yet - keeping for compatibility
    const response = await axios.post(`${API_BASE_URL}/users/${memberId}/redeem`, {
      points,
    });
    return response.data;
  },
};
