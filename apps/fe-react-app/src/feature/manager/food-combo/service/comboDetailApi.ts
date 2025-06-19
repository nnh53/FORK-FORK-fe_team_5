import type { ComboDetail } from "@/interfaces/foodAndCombo.interface";

const API_URL = "https://6852f9170594059b23cfc726.mockapi.io/ComboDetail"; // Thay bằng URL API thực tế của bạn

export const getComboDetails = async (): Promise<ComboDetail[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Lỗi khi lấy danh sách chi tiết combo");
  return response.json();
};

export const getComboDetailsByComboId = async (comboId: number): Promise<ComboDetail[]> => {
  const response = await fetch(`${API_URL}?comboId=${comboId}`);
  if (!response.ok) throw new Error("Lỗi khi lấy chi tiết combo");
  return response.json();
};

export const createComboDetail = async (comboDetailData: Omit<ComboDetail, "id">): Promise<ComboDetail> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comboDetailData),
  });
  if (!response.ok) throw new Error("Lỗi khi thêm chi tiết combo");
  return response.json();
};

export const updateComboDetail = async (comboDetail: ComboDetail): Promise<ComboDetail> => {
  const response = await fetch(`${API_URL}/${comboDetail.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comboDetail),
  });
  if (!response.ok) throw new Error("Lỗi khi cập nhật chi tiết combo");
  return response.json();
};

export const deleteComboDetail = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Lỗi khi xóa chi tiết combo");
};

export const getComboDetailById = async (id: number): Promise<ComboDetail> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Lỗi khi lấy thông tin chi tiết combo");
  return response.json();
};

export const deleteComboDetailsByComboId = async (comboId: number): Promise<void> => {
  const comboDetails = await getComboDetailsByComboId(comboId);
  await Promise.all(comboDetails.map((detail) => deleteComboDetail(detail.id)));
};
