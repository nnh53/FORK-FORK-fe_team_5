import type { SeatType } from "@/interfaces/seat.interface";
import type { components } from "@/schema-from-be";
import { $api } from "@/utils/api";

// OpenAPI types from schema
type SeatTypeResponse = components["schemas"]["SeatTypeResponse"];
type SeatTypeRequest = components["schemas"]["SeatTypeRequest"];

// React Query hooks for CRUD operations
export const useSeatTypes = () => {
  return $api.useQuery("get", "/seat-types", {});
};

export const useSeatType = (id: number) => {
  return $api.useQuery("get", "/seat-types/{id}", {
    params: { path: { id } },
  });
};

export const useUpdateSeatType = () => {
  return $api.useMutation("put", "/seat-types/{id}");
};

// Transform functions to convert API responses to our interface types
export const transformSeatTypeResponse = (response: SeatTypeResponse): SeatType => {
  return {
    id: response.id ?? 0,
    name: response.name ?? "REGULAR",
    price: response.price ?? 0,
    seatCount: response.seatCount ?? 1,
  };
};

export const transformSeatTypesResponse = (responses: SeatTypeResponse[]): SeatType[] => {
  return responses.map(transformSeatTypeResponse);
};

// Transform our interface type to API request format
export const transformSeatTypeToRequest = (seatType: Partial<SeatType>): SeatTypeRequest => {
  return {
    name: seatType.name as "VIP" | "REGULAR" | "COUPLE" | "PATH" | "BLOCK",
    price: seatType.price ?? 0,
  };
};

// Helper function to get Vietnamese labels for seat types
export const getSeatTypeLabel = (name: string): string => {
  switch (name) {
    case "VIP":
      return "VIP";
    case "REGULAR":
      return "Thường";
    case "COUPLE":
      return "Đôi";
    case "PATH":
      return "Lối đi";
    case "BLOCK":
      return "Chặn";
    default:
      return name;
  }
};

// Available seat type options
export const SEAT_TYPE_OPTIONS = [
  { value: "REGULAR", label: "Thường" },
  { value: "VIP", label: "VIP" },
  { value: "COUPLE", label: "Đôi" },
  { value: "PATH", label: "Lối đi" },
  { value: "BLOCK", label: "Chặn" },
] as const;
