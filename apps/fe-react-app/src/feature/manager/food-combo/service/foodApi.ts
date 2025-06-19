import type { Food } from "@/interfaces/foodAndCombo.interface";

const API_URL = "https://6852f9170594059b23cfc726.mockapi.io/Food"; // Thay bằng URL API thực tế của bạn

export const getFoods = async (): Promise<Food[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Lỗi khi lấy danh sách đồ ăn");
  return response.json();
};

export const createFood = async (foodData: Omit<Food, "id">): Promise<Food> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(foodData),
  });
  if (!response.ok) throw new Error("Lỗi khi thêm đồ ăn");
  return response.json();
};

export const updateFood = async (food: Food): Promise<Food> => {
  const response = await fetch(`${API_URL}/${food.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(food),
  });
  if (!response.ok) throw new Error("Lỗi khi cập nhật đồ ăn");
  return response.json();
};

export const deleteFood = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Lỗi khi xóa đồ ăn");
};

export const getFoodById = async (id: number): Promise<Food> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Lỗi khi lấy thông tin đồ ăn");
  return response.json();
};
