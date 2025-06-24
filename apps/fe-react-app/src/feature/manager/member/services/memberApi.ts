import type { StaffRegisterDTO, UserBase } from "@/interfaces/users.interface";

const API_URL = "https://67b28b81bc0165def8cdc590.mockapi.io/member"; // Thay bằng URL API thực tế của bạn

export const getMembers = async (): Promise<UserBase[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Lỗi khi lấy danh sách thành viên");
  return response.json();
};

export const createMember = async (memberData: StaffRegisterDTO): Promise<UserBase> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(memberData),
  });
  if (!response.ok) throw new Error("Lỗi khi Thêm thành viên");
  return response.json();
};

export const updateMember = async (member: UserBase): Promise<UserBase> => {
  const response = await fetch(`${API_URL}/${member.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member),
  });
  if (!response.ok) throw new Error("Lỗi khi cập nhật thành viên");
  return response.json();
};

export const deleteMember = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Lỗi khi xóa thành viên");
};
