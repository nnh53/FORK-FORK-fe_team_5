import type { ComboDetail, Food } from "@/interfaces/foodAndCombo.interface";

const FOOD_API_URL = "https://6852f9170594059b23cfc726.mockapi.io/Food";
const COMBO_API_URL = "https://6852f9170594059b23cfc726.mockapi.io/ComboDetail";

export const getFoods = async (): Promise<Food[]> => {
  const response = await fetch(FOOD_API_URL);
  if (!response.ok) throw new Error("Lỗi khi lấy danh sách đồ ăn");
  return response.json();
};

export const createFood = async (foodData: Omit<Food, "id">): Promise<Food> => {
  const response = await fetch(FOOD_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(foodData),
  });
  if (!response.ok) throw new Error("Lỗi khi thêm đồ ăn");
  return response.json();
};

export const updateFood = async (food: Food): Promise<Food> => {
  const response = await fetch(`${FOOD_API_URL}/${food.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(food),
  });
  if (!response.ok) throw new Error("Lỗi khi cập nhật đồ ăn");
  return response.json();
};

export const deleteFood = async (id: number): Promise<void> => {
  const response = await fetch(`${FOOD_API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Lỗi khi xóa đồ ăn");
};

export const getFoodById = async (id: number): Promise<Food> => {
  const response = await fetch(`${FOOD_API_URL}/${id}`);
  if (!response.ok) throw new Error("Lỗi khi lấy thông tin đồ ăn");
  return response.json();
};

// Bắt đầu gộp từ comboDetailApi
export const getComboDetails = async (): Promise<ComboDetail[]> => {
  const response = await fetch(COMBO_API_URL);
  if (!response.ok) throw new Error("Lỗi khi lấy danh sách chi tiết combo");
  return response.json();
};

export const getComboDetailsByComboId = async (comboId: number): Promise<ComboDetail[]> => {
  const response = await fetch(`${COMBO_API_URL}?comboId=${comboId}`);
  if (!response.ok) throw new Error("Lỗi khi lấy chi tiết combo");
  return response.json();
};

export const createComboDetail = async (comboDetailData: Omit<ComboDetail, "id">): Promise<ComboDetail> => {
  const response = await fetch(COMBO_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comboDetailData),
  });
  if (!response.ok) throw new Error("Lỗi khi thêm chi tiết combo");
  return response.json();
};

export const updateComboDetail = async (comboDetail: ComboDetail): Promise<ComboDetail> => {
  const response = await fetch(`${COMBO_API_URL}/${comboDetail.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comboDetail),
  });
  if (!response.ok) throw new Error("Lỗi khi cập nhật chi tiết combo");
  return response.json();
};

export const deleteComboDetail = async (id: number): Promise<void> => {
  const response = await fetch(`${COMBO_API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Lỗi khi xóa chi tiết combo");
};

export const getComboDetailById = async (id: number): Promise<ComboDetail> => {
  const response = await fetch(`${COMBO_API_URL}/${id}`);
  if (!response.ok) throw new Error("Lỗi khi lấy thông tin chi tiết combo");
  return response.json();
};

export const deleteComboDetailsByComboId = async (comboId: number): Promise<void> => {
  const comboDetails = await getComboDetailsByComboId(comboId);
  await Promise.all(comboDetails.map((detail) => deleteComboDetail(detail.id)));
};
