import type { Snack } from "@/interfaces/snacks.interface";

const SNACK_API_URL = "https://6852f9170594059b23cfc726.mockapi.io/Food";

export const getSnacks = async (): Promise<Snack[]> => {
  const response = await fetch(SNACK_API_URL);
  if (!response.ok) throw new Error("Lỗi khi lấy danh sách đồ ăn");
  return response.json();
};

export const createSnack = async (snackData: Omit<Snack, "id">): Promise<Snack> => {
  const response = await fetch(SNACK_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(snackData),
  });
  if (!response.ok) throw new Error("Lỗi khi thêm đồ ăn");
  return response.json();
};

export const updateSnack = async (snack: Snack): Promise<Snack> => {
  const response = await fetch(`${SNACK_API_URL}/${snack.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(snack),
  });
  if (!response.ok) throw new Error("Lỗi khi cập nhật đồ ăn");
  return response.json();
};

export const deleteSnack = async (id: number): Promise<void> => {
  const response = await fetch(`${SNACK_API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Lỗi khi xóa đồ ăn");
};

export const getSnackById = async (id: number): Promise<Snack> => {
  const response = await fetch(`${SNACK_API_URL}/${id}`);
  if (!response.ok) throw new Error("Lỗi khi lấy thông tin đồ ăn");
  return response.json();
};
