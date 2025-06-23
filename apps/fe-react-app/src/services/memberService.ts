import type { Member, MemberCreateRequest, PointTransaction } from "@/interfaces/member.interface";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const memberService = {
  // Get member by phone
  getMemberByPhone: async (phone: string): Promise<Member | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/members/phone/${phone}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error("Error fetching member:", error);
      throw error;
    }
  },

  // Get all members
  getAllMembers: async (): Promise<Member[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/members`);
      return response.data;
    } catch (error) {
      console.error("Error fetching members:", error);
      throw error;
    }
  },

  // Create new member
  createMember: async (memberData: MemberCreateRequest): Promise<Member> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/members`, memberData);
      return response.data;
    } catch (error) {
      console.error("Error creating member:", error);
      throw error;
    }
  },

  // Update member points
  updateMemberPoints: async (memberId: string, points: number, type: "earn" | "redeem", description: string): Promise<Member> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/members/${memberId}/points`, {
        points,
        type,
        description,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating member points:", error);
      throw error;
    }
  },

  // Get member's point transactions
  getMemberTransactions: async (memberId: string): Promise<PointTransaction[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/members/${memberId}/transactions`);
      return response.data;
    } catch (error) {
      console.error("Error fetching member transactions:", error);
      throw error;
    }
  },

  // Redeem points for discount
  redeemPoints: async (memberId: string, points: number): Promise<{ discount: number; newPoints: number }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/members/${memberId}/redeem`, {
        points,
      });
      return response.data;
    } catch (error) {
      console.error("Error redeeming points:", error);
      throw error;
    }
  },
};
