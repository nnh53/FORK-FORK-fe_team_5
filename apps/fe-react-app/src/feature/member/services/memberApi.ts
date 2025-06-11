// src/feature/member/services/memberApi.ts
import axios from "axios";
import type { Member } from "../types"; // Adjust path if necessary

const API_URL = "https://67b28b81bc0165def8cdc590.mockapi.io/member";

export const getMembers = async (): Promise<Member[]> => {
  const response = await axios.get<Member[]>(API_URL);
  return response.data;
};

export const createMember = async (memberData: Omit<Member, "member_id">): Promise<Member> => {
  // MockAPI thường tự tạo member_id
  // Đảm bảo gửi đủ các trường mà MockAPI yêu cầu (ví dụ: password)
  const payload = { ...memberData, password: memberData.password ?? "defaultPassword123" };
  const response = await axios.post<Member>(API_URL, payload);
  return response.data;
};

export const updateMember = async (member: Member): Promise<Member> => {
  // Khi cập nhật, không nên gửi lại mật khẩu trừ khi bạn muốn thay đổi nó.
  // MockAPI có thể ghi đè toàn bộ object, nên cẩn thận với field password.
  // Để đơn giản, chúng ta gửi lại toàn bộ object member trừ password nếu không muốn cập nhật.
  const { ...memberWithoutPassword } = member;
  const payload = member.password ? member : memberWithoutPassword; // Gửi password nếu nó được cung cấp (thay đổi)
  const response = await axios.put<Member>(`${API_URL}/${member.member_id}`, payload);
  return response.data;
};

export const deleteMember = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
