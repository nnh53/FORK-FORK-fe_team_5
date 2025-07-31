import type { Snack, SnackForm } from "@/interfaces/snacks.interface";
import type { components } from "@/schema-from-be";
import { $api } from "@/utils/api";
type SnackResponse = components["schemas"]["SnackResponse"];

// Type aliases for union types
export type SnackCategory = "DRINK" | "FOOD";
export type SnackSize = "SMALL" | "MEDIUM" | "LARGE";
export type SnackStatus = "AVAILABLE" | "UNAVAILABLE";

// React Query hooks for snack operations
export const useSnacks = () => {
  return $api.useQuery("get", "/snacks", {});
};

export const useGetAllSnacks = () => {
    return $api.useQuery("get", "/snacks", {});
};

export const useSnack = (id: number) => {
  return $api.useQuery("get", "/snacks/{id}", {
    params: { path: { id } },
  });
};

export const useCreateSnack = () => {
  return $api.useMutation("post", "/snacks");
};

export const useUpdateSnack = () => {
  return $api.useMutation("put", "/snacks/{id}");
};

export const useDeleteSnack = () => {
  return $api.useMutation("delete", "/snacks/{id}");
};

// Transform functions for API request/response
export const transformSnackResponse = (snackResponse: SnackResponse): Snack => {
  return {
    id: Number(snackResponse.id),
    category: snackResponse.category as SnackCategory,
    name: String(snackResponse.name),
    size: snackResponse.size as SnackSize,
    flavor: String(snackResponse.flavor ?? ""),
    price: Number(snackResponse.price),
    description: String(snackResponse.description ?? ""),
    img: String(snackResponse.img ?? ""),
    status: snackResponse.status as SnackStatus,
  };
};

export const transformSnacksResponse = (snacksResponse: SnackResponse[]): Snack[] => {
  return snacksResponse.map(transformSnackResponse);
};

export const transformSnackToRequest = (snack: Snack | SnackForm) => {
  return {
    ...(snack as Record<string, unknown>),
    price: Number(snack.price),
  };
};

// Options for form selects
export const snackCategoryOptions = [
  { value: "DRINK" as SnackCategory, label: "Đồ uống" },
  { value: "FOOD" as SnackCategory, label: "Thức ăn" },
];

export const snackSizeOptions = [
  { value: "SMALL" as SnackSize, label: "Nhỏ" },
  { value: "MEDIUM" as SnackSize, label: "Vừa" },
  { value: "LARGE" as SnackSize, label: "Lớn" },
];

export const snackStatusOptions = [
  { value: "AVAILABLE" as SnackStatus, label: "Còn hàng" },
  { value: "UNAVAILABLE" as SnackStatus, label: "Hết hàng" },
];

// Helper functions
export const isValidSnackCategory = (category: string): category is SnackCategory => {
  return ["DRINK", "FOOD"].includes(category);
};

export const isValidSnackSize = (size: string): size is SnackSize => {
  return ["SMALL", "MEDIUM", "LARGE"].includes(size);
};

export const isValidSnackStatus = (status: string): status is SnackStatus => {
  return ["AVAILABLE", "UNAVAILABLE"].includes(status);
};

export const getSnackCategoryLabel = (category: SnackCategory): string => {
  return category === "DRINK" ? "Đồ uống" : "Thức ăn";
};

export const getSnackSizeLabel = (size: SnackSize): string => {
  const sizeMap: Record<SnackSize, string> = {
    SMALL: "Nhỏ",
    MEDIUM: "Vừa",
    LARGE: "Lớn",
  };
  return sizeMap[size];
};

export const getSnackStatusLabel = (status: SnackStatus): string => {
  return status === "AVAILABLE" ? "Còn hàng" : "Hết hàng";
};
