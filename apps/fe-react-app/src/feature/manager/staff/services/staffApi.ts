import type { Staff, StaffFormData } from "../../../../interfaces/staff.interface";

const API_URL = "https://67b28b81bc0165def8cdc590.mockapi.io/users";

/**
 * Lấy danh sách tất cả nhân viên
 */
export const getStaffs = async (): Promise<Staff[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Lỗi khi lấy danh sách nhân viên");
  return response.json();
};

/**
 * Tạo nhân viên mới
 */
export const createStaff = async (staffData: StaffFormData): Promise<Staff> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(staffData),
  });
  if (!response.ok) throw new Error("Lỗi khi thêm nhân viên");
  return response.json();
};

/**
 * Cập nhật thông tin nhân viên
 */
export const updateStaff = async (staff: Staff): Promise<Staff> => {
  const response = await fetch(`${API_URL}/${staff.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(staff),
  });
  if (!response.ok) throw new Error("Lỗi khi cập nhật nhân viên");
  return response.json();
};

/**
 * Xóa nhân viên theo ID
 */
export const deleteStaff = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Lỗi khi xóa nhân viên");
};
