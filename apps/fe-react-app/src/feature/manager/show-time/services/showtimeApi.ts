import type { Showtime, ShowtimeFormData } from "@/interfaces/showtime.interface";

const API_URL = "https://67b28b81bc0165def8cdc590.mockapi.io/showtimes"; // URL API suất chiếu

/**
 * Lấy danh sách tất cả suất chiếu
 * @returns Promise<Showtime[]> Danh sách suất chiếu
 */
export const getShowtimes = async (): Promise<Showtime[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Lỗi khi lấy danh sách suất chiếu");
  return response.json();
};

/**
 * Lấy thông tin chi tiết của một suất chiếu
 * @param id ID của suất chiếu
 * @returns Promise<Showtime> Thông tin chi tiết suất chiếu
 */
export const getShowtimeById = async (id: string): Promise<Showtime> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Lỗi khi lấy thông tin suất chiếu");
  return response.json();
};

/**
 * Tạo suất chiếu mới
 * @param showtimeData Dữ liệu suất chiếu cần tạo
 * @returns Promise<Showtime> Thông tin suất chiếu đã tạo
 */
export const createShowtime = async (showtimeData: ShowtimeFormData): Promise<Showtime> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(showtimeData),
  });
  if (!response.ok) throw new Error("Lỗi khi tạo suất chiếu");
  return response.json();
};

/**
 * Cập nhật thông tin suất chiếu
 * @param showtime Dữ liệu suất chiếu cần cập nhật
 * @returns Promise<Showtime> Thông tin suất chiếu đã cập nhật
 */
export const updateShowtime = async (showtime: Showtime): Promise<Showtime> => {
  const response = await fetch(`${API_URL}/${showtime.showtime_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(showtime),
  });
  if (!response.ok) throw new Error("Lỗi khi cập nhật suất chiếu");
  return response.json();
};

/**
 * Xóa suất chiếu
 * @param id ID của suất chiếu cần xóa
 * @returns Promise<void>
 */
export const deleteShowtime = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Lỗi khi xóa suất chiếu");
};
