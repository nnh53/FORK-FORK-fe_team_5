import type { Snack } from "@/interfaces/snacks.interface";

const SNACK_API_URL = "https://fcinema-spring-ujhbb.ondigitalocean.app/movie_theater/api/snacks";

const normalizeSnack = (snack: unknown): Snack => {
  const s = snack as Record<string, unknown>;
  return {
    id: Number(s.id),
    category: s.category as "DRINK" | "FOOD",
    name: String(s.name),
    size: s.size as "SMALL" | "MEDIUM" | "LARGE",
    flavor: String(s.flavor),
    price: Number(s.price),
    description: String(s.description),
    img: String(s.img),
    status: s.status as "AVAILABLE" | "UNAVAILABLE",
  };
};

export const getSnacks = async (): Promise<Snack[]> => {
  const response = await fetch(SNACK_API_URL);
  if (!response.ok) throw new Error("Lỗi khi lấy danh sách đồ ăn");
  const data = await response.json();
  return (data.result || []).map(normalizeSnack);
};

export const createSnack = async (snackData: Omit<Snack, "id">): Promise<Snack> => {
  const response = await fetch(SNACK_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(snackData),
  });
  if (!response.ok) throw new Error("Lỗi khi thêm đồ ăn");
  const data = await response.json();
  return normalizeSnack(data);
};

export const updateSnack = async (snack: Snack): Promise<Snack> => {
  const response = await fetch(`${SNACK_API_URL}/${snack.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(snack),
  });
  if (!response.ok) throw new Error("Lỗi khi cập nhật đồ ăn");
  const data = await response.json();
  return normalizeSnack(data);
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
  const data = await response.json();
  return normalizeSnack(data);
};
