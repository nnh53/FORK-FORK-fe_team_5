import type { Combo, ComboForm, ComboSnack } from "@/interfaces/combo.interface";
import type { Snack } from "@/interfaces/snacks.interface";
import type { components } from "@/schema-from-be";
import { $api } from "@/utils/api";
import { formatVND } from "@/utils/currency.utils";
type ComboResponse = components["schemas"]["ComboResponse"];
type ComboSnackResponse = components["schemas"]["ComboSnackResponse"];

// Type aliases for union types
export type ComboStatus = "AVAILABLE" | "UNAVAILABLE";

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
 * Hook for updating combo snacks
 */
export const useUpdateComboSnacks = () => {
  return $api.useMutation("put", "/combos/{id}");
};

/**
 * Hook for updating combo price
 */
export const useUpdateComboPrice = () => {
  return $api.useMutation("put", "/combos/{id}");
};

/**
 * Hook for deleting a combo
 */
export const useDeleteCombo = () => {
  return $api.useMutation("delete", "/combos/{id}");
};

// ==================== TRANSFORM FUNCTIONS ====================

/**
 * Transform a combo response from the API to the Combo interface
 */
export const transformComboResponse = (comboResponse: ComboResponse): Combo => {
  console.log("Raw combo response:", JSON.stringify(comboResponse, null, 2));

  let transformedSnacks: ComboSnack[] = [];

  if (comboResponse.comboSnacks && Array.isArray(comboResponse.comboSnacks)) {
    transformedSnacks = comboResponse.comboSnacks.map((comboSnack) => ({
      id: comboSnack.id,
      quantity: comboSnack.quantity,
      combo: comboSnack.combo as unknown as Combo,
      snack: comboSnack.snack || createFallbackSnack(),
    }));
  }

  return {
    id: comboResponse.id,
    name: comboResponse.name || "",
    description: comboResponse.description || "",
    status: (comboResponse.status as ComboStatus) || "AVAILABLE",
    img: comboResponse.img || "",
    price: comboResponse.price,
    discount: comboResponse.discount,
    snacks: transformedSnacks,
  };
};

/**
 * Transform an array of combo responses from the API to an array of Combo interfaces
 */
export const transformCombosResponse = (combosResponse: ComboResponse[]): Combo[] => {
  return combosResponse.map((comboResponse) => transformComboResponse(comboResponse));
};

/**
 * Create a fallback snack object to use when no snack data is available
 */
export const createFallbackSnack = (): Snack => {
  return {
    id: 0,
    name: "Unknown Snack",
    description: "No description available",
    price: 0,
    img: "",
    category: "FOOD",
    size: "MEDIUM",
    flavor: "",
    status: "AVAILABLE",
  };
};

/**
 * Transform a combo-snack response from the API to the ComboSnack interface
 */
export const transformComboSnackResponse = (comboSnackResponse: ComboSnackResponse): ComboSnack => {
  console.log("Raw comboSnack response:", JSON.stringify(comboSnackResponse, null, 2));

  let snackData: Snack;
  if (comboSnackResponse.snack && typeof comboSnackResponse.snack === "object") {
    const snackObj = comboSnackResponse.snack as Record<string, any>;
    snackData = {
      id: Number(snackObj.id || 0),
      category: (snackObj.category || "FOOD") as "DRINK" | "FOOD",
      name: String(snackObj.name || ""),
      size: (snackObj.size || "MEDIUM") as "SMALL" | "MEDIUM" | "LARGE",
      flavor: String(snackObj.flavor || ""),
      price: Number(snackObj.price || 0),
      description: String(snackObj.description || ""),
      img: String(snackObj.img || ""),
      status: (snackObj.status || "AVAILABLE") as "AVAILABLE" | "UNAVAILABLE",
    };
  } else {
    console.warn("Missing snack data in combo-snack response, using fallback", comboSnackResponse);
    snackData = createFallbackSnack();
  }

  let comboData: Combo;
  if (comboSnackResponse.combo && typeof comboSnackResponse.combo === "object") {
    const comboObj = comboSnackResponse.combo as Record<string, any>;
    comboData = {
      id: Number(comboObj.id || 0),
      name: String(comboObj.name || ""),
      description: String(comboObj.description || ""),
      status: (comboObj.status || "AVAILABLE") as ComboStatus,
      img: String(comboObj.img || ""),
      snacks: [],
      price: Number(comboObj.price || 0),
      discount: Number(comboObj.discount || 0),
    };
  } else {
    comboData = {
      id: 0,
      name: "",
      description: "",
      status: "AVAILABLE",
      img: "",
      snacks: [],
      price: 0,
      discount: 0,
    };
  }

  return {
    id: Number(comboSnackResponse.id),
    quantity: Number(comboSnackResponse.quantity || 1),
    combo: comboData,
    snack: snackData,
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
    price: combo.price,
    discount: combo.discount,
    snacks: combo.snacks
      ? combo.snacks.map((s) => {
          if ("snack" in s && s.snack) {
            return {
              snackId: typeof s.snack.id === "number" ? s.snack.id : 0,
              quantity: s.quantity ?? 1,
            };
          } else if ("snackId" in s) {
            return {
              snackId: typeof s.snackId === "number" ? s.snackId : 0,
              quantity: s.quantity ?? 1,
            };
          }
          // Fallback (should not happen in practice)
          return { snackId: 0, quantity: 1 };
        })
      : [],
  };
};

/**
 * Transform a request to add snacks to a combo
 */
export const transformAddSnacksToComboRequest = (snacks: Array<{ snackId: number; quantity: number }>) => {
  return snacks;
};

/**
 * Transform a request to create or update a combo-snack
 */
export const transformComboSnackToRequest = (comboSnack: Partial<ComboSnack>) => {
  return {
    comboId: comboSnack.combo?.id,
    snackId: comboSnack.snack?.id,
    quantity: comboSnack.quantity ?? 1,
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
 * Calculate the total price of a combo based on its price and discount
 */
export const calculateComboPrice = (combo: Combo): number => {
  if (!combo.price) return 0;

  const price = combo.price || 0;
  const discount = combo.discount || 0;

  return price - discount;
};

/**
 * Custom hook to fetch combo price
 */
export const useComboPrice = (comboId: number) => {
  const { data, isLoading, error } = useCombos();

  let combo = null;

  if (data?.result) {
    if (Array.isArray(data.result)) {
      combo = data.result.find((c: any) => c.id === comboId);
    } else if (typeof data.result === "object") {
      const resultObj = data.result as Record<string, any>;
      if ("id" in resultObj && resultObj.id === comboId) {
        combo = resultObj;
      }
    }
  }

  const totalPrice = combo ? (combo.price || 0) - (combo.discount || 0) : 0;

  return {
    totalPrice,
    isLoading,
    error,
  };
};

/**
 * Format a price in VND
 */
export const formatPrice = (price: number): string => {
  return formatVND(price);
};
