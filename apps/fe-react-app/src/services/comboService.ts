import type { Combo, ComboForm, ComboSnack } from "@/interfaces/combo.interface";
import type { Snack } from "@/interfaces/snacks.interface";
import type { ComboResponse, ComboSnackResponse } from "@/type-from-be";
import { $api } from "@/utils/api";
import { transformSnackResponse } from "./snackService";

// Type aliases for union types
type ComboStatus = "AVAILABLE" | "UNAVAILABLE";

// ==================== COMBO API HOOKS ====================

/**
 * Hook for getting all combos
 */
export const useCombos = () => {
  return $api.useQuery("get", "/combos", {});
};

/**
 * Hook for creating a new combo
 */
export const useCreateCombo = () => {
  return $api.useMutation("post", "/combos");
};

/**
 * Hook for adding snacks to a combo
 */
export const useAddSnacksToCombo = () => {
  return $api.useMutation("post", "/combos/{comboId}/snacks");
};

/**
 * Hook for removing snacks from a combo
 */
export const useRemoveSnacksFromCombo = () => {
  return $api.useMutation("delete", "/combos/{comboId}/snacks");
};

/**
 * Hook for updating a combo
 */
export const useUpdateCombo = () => {
  return $api.useMutation("put", "/combos/{id}");
};

/**
 * Hook for deleting a combo
 */
export const useDeleteCombo = () => {
  return $api.useMutation("delete", "/combos/{id}");
};

// ==================== COMBO-SNACK API HOOKS ====================

/**
 * Hook for getting all combo-snacks
 */
export const useComboSnacks = () => {
  return $api.useQuery("get", "/combo-snacks", {});
};

/**
 * Hook for getting a combo-snack by id
 */
export const useComboSnack = (id: number) => {
  return $api.useQuery("get", "/combo-snacks/{id}", {
    params: { path: { id } },
  });
};

/**
 * Hook for creating a new combo-snack
 */
export const useCreateComboSnack = () => {
  return $api.useMutation("post", "/combo-snacks");
};

/**
 * Hook for updating a combo-snack
 */
export const useUpdateComboSnack = () => {
  return $api.useMutation("put", "/combo-snacks/{id}");
};

/**
 * Hook for deleting a combo-snack
 */
export const useDeleteComboSnack = () => {
  return $api.useMutation("delete", "/combo-snacks/{id}");
};

/**
 * Hook for getting all combo-snacks by snack id
 */
export const useComboSnacksBySnackId = (snackId: number) => {
  return $api.useQuery("get", "/combo-snacks/snack/{snackId}", {
    params: { path: { snackId } },
  });
};

/**
 * Hook for getting all combo-snacks by combo id
 */
export const useComboSnacksByComboId = (comboId: number) => {
  return $api.useQuery("get", "/combo-snacks/combo/{comboId}", {
    params: { path: { comboId } },
  });
};

/**
 * Hook for getting a combo-snack by combo and snack ids
 */
export const useComboSnackByComboAndSnack = (comboId: number, snackId: number) => {
  return $api.useQuery("get", "/combo-snacks/combo/{comboId}/snack/{snackId}", {
    params: { path: { comboId, snackId } },
  });
};

/**
 * Hook for deleting a combo-snack by combo and snack ids
 */
export const useDeleteComboSnackByComboAndSnack = () => {
  return $api.useMutation("delete", "/combo-snacks/combo/{comboId}/snack/{snackId}");
};

// ==================== TRANSFORM FUNCTIONS ====================

/**
 * Transform a combo response from the API to the Combo interface
 */
export const transformComboResponse = (comboResponse: ComboResponse): Combo => {
  return {
    id: Number(comboResponse.id),
    name: String(comboResponse.name ?? ""),
    description: String(comboResponse.description ?? ""),
    status: comboResponse.status as ComboStatus,
    img: String(comboResponse.img ?? ""),
    snacks: comboResponse.snacks ? comboResponse.snacks.map(transformComboSnackResponse) : [],
  };
};

/**
 * Transform an array of combo responses from the API to an array of Combo interfaces
 */
export const transformCombosResponse = (combosResponse: ComboResponse[]): Combo[] => {
  return combosResponse.map((comboResponse) => transformComboResponse(comboResponse));
};

/**
 * Transform a combo-snack response from the API to the ComboSnack interface
 */
export const transformComboSnackResponse = (comboSnackResponse: ComboSnackResponse): ComboSnack => {
  return {
    id: Number(comboSnackResponse.id),
    quantity: Number(comboSnackResponse.quantity ?? 0),
    snackSizeId: comboSnackResponse.snackSizeId ?? null,
    discountPercentage: comboSnackResponse.discountPercentage ?? null,
    combo: comboSnackResponse.combo ? transformComboResponse(comboSnackResponse.combo) : ({} as Combo),
    snack: comboSnackResponse.snack ? transformSnackResponse(comboSnackResponse.snack) : ({} as Snack),
  };
};

/**
 * Transform an array of combo-snack responses from the API to an array of ComboSnack interfaces
 */
export const transformComboSnacksResponse = (comboSnacksResponse: ComboSnackResponse[]): ComboSnack[] => {
  return comboSnacksResponse.map(transformComboSnackResponse);
};

/**
 * Transform a Combo interface to a format suitable for API requests
 */
export const transformComboToRequest = (combo: Combo | ComboForm) => {
  return {
    name: combo.name,
    description: combo.description,
    status: combo.status,
    img: combo.img,
  };
};

/**
 * Transform a request to add snacks to a combo
 */
export const transformAddSnacksToComboRequest = (snacks: Array<{ snackId: number; quantity: number }>) => {
  return snacks.map((snack) => ({
    snackId: snack.snackId,
    quantity: snack.quantity,
  }));
};

/**
 * Transform a request to create or update a combo-snack
 */
export const transformComboSnackToRequest = (comboSnack: Partial<ComboSnack>) => {
  return {
    comboId: comboSnack.combo?.id,
    snackId: comboSnack.snack?.id,
    quantity: comboSnack.quantity,
  };
};

// ==================== OPTIONS AND HELPERS ====================

/**
 * Options for combo status select
 */
export const comboStatusOptions = [
  { value: "AVAILABLE" as ComboStatus, label: "Có sẵn" },
  { value: "UNAVAILABLE" as ComboStatus, label: "Không có sẵn" },
];

/**
 * Check if a string is a valid combo status
 */
export const isValidComboStatus = (status: string): status is ComboStatus => {
  return ["AVAILABLE", "UNAVAILABLE"].includes(status);
};

/**
 * Get the label for a combo status
 */
export const getComboStatusLabel = (status: ComboStatus): string => {
  return status === "AVAILABLE" ? "Có sẵn" : "Không có sẵn";
};

/**
 * Calculate the total price of a combo based on its snacks
 */
export const calculateComboPrice = (combo: Combo): number => {
  if (!combo.snacks || combo.snacks.length === 0) return 0;

  return combo.snacks.reduce((total, comboSnack) => {
    return total + (comboSnack.snack.price ?? 0);
  }, 0);
};

/**
 * Format a price in VND
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
};
