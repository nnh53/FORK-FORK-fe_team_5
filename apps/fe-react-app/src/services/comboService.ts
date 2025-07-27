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
    transformedSnacks = comboResponse.comboSnacks.map((comboSnackData) => {
      return {
        id: Number(comboSnackData.id ?? 0),
        quantity: Number(comboSnackData.quantity ?? 1),
        combo: {
          id: Number(comboResponse.id),
          name: String(comboResponse.name ?? ""),
          description: String(comboResponse.description ?? ""),
          status: comboResponse.status as ComboStatus,
          img: String(comboResponse.img ?? ""),
          price: Number(comboResponse.price ?? 0),
          discount: Number(comboResponse.discount ?? 0),
          snacks: [], // Will be populated later to avoid circular reference
        },
        snack: {
          id: Number(comboSnackData.snack?.id ?? 0),
          category: (comboSnackData.snack?.category as "DRINK" | "FOOD") ?? "FOOD",
          name: String(comboSnackData.snack?.name ?? ""),
          size: (comboSnackData.snack?.size as "SMALL" | "MEDIUM" | "LARGE") ?? "MEDIUM",
          flavor: String(comboSnackData.snack?.flavor ?? ""),
          price: Number(comboSnackData.snack?.price ?? 0),
          description: String(comboSnackData.snack?.description ?? ""),
          img: String(comboSnackData.snack?.img ?? ""),
          status: (comboSnackData.snack?.status as "AVAILABLE" | "UNAVAILABLE") ?? "AVAILABLE",
        },
      };
    });
  }

  return {
    id: Number(comboResponse.id),
    name: String(comboResponse.name ?? ""),
    description: String(comboResponse.description ?? ""),
    status: comboResponse.status as ComboStatus,
    img: String(comboResponse.img ?? ""),
    price: Number(comboResponse.price ?? 0),
    discount: Number(comboResponse.discount ?? 0),
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
    snackData = {
      id: Number(comboSnackResponse.snack.id),
      category: comboSnackResponse.snack.category as "DRINK" | "FOOD",
      name: String(comboSnackResponse.snack.name),
      size: comboSnackResponse.snack.size as "SMALL" | "MEDIUM" | "LARGE",
      flavor: String(comboSnackResponse.snack.flavor ?? ""),
      price: Number(comboSnackResponse.snack.price),
      description: String(comboSnackResponse.snack.description ?? ""),
      img: String(comboSnackResponse.snack.img ?? ""),
      status: comboSnackResponse.snack.status as "AVAILABLE" | "UNAVAILABLE",
    };
  } else {
    console.warn("Missing snack data in combo-snack response, using fallback", comboSnackResponse);
    snackData = createFallbackSnack();
  }

  let comboData: Combo;
  if (comboSnackResponse.combo && typeof comboSnackResponse.combo === "object") {
    const combo = comboSnackResponse.combo as Record<string, unknown>; // Type assertion to bypass strict typing
    comboData = {
      id: Number(combo.id ?? 0),
      name: String(combo.name ?? ""),
      description: String(combo.description ?? ""),
      status: (combo.status as ComboStatus) ?? "AVAILABLE",
      img: String(combo.img ?? ""),
      price: Number(combo.price ?? 0),
      discount: Number(combo.discount ?? 0),
      snacks: [],
    };
  } else {
    comboData = {
      id: 0,
      name: "",
      description: "",
      status: "AVAILABLE",
      img: "",
      price: 0,
      discount: 0,
      snacks: [],
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
 * Calculate the total price of a combo based on its snacks
 */
export const calculateComboPrice = (combo: Combo): number => {
  // Use combo price directly from API
  console.log(`Using direct price for combo ${combo.id}: ${combo.price}`);
  return combo.price ?? 0;
};

/**
 * Calculate the total price of a combo based on provided combo-snacks data
 */
export const calculateComboPriceWithQuantity = (comboSnacks: ComboSnack[]): number => {
  if (!comboSnacks || comboSnacks.length === 0) return 0;

  console.log(
    `Calculating price with ${comboSnacks.length} snacks:`,
    (comboSnacks as ComboSnack[]).map((s) => ({
      id: s.snack?.id,
      name: s.snack?.name,
      price: s.snack?.price,
      quantity: s.quantity,
    })),
  );

  return comboSnacks.reduce((total, comboSnack) => {
    const basePrice = comboSnack.snack?.price ?? 0;
    const quantity = comboSnack.quantity || 1;
    const itemTotal = basePrice * quantity;

    console.log(`Snack ${comboSnack.snack?.name}: price=${basePrice}, quantity=${quantity}, itemTotal=${itemTotal}`);

    return total + itemTotal;
  }, 0);
};

/**
 * Calculate final combo price (base price - discount)
 * Returns 0 if discount is greater than base price or if there are no snacks
 */
export const calculateFinalComboPrice = (combo: Combo): number => {
  if (!combo?.snacks?.length) return 0;

  const basePrice = calculateComboPrice(combo);
  const discount = combo.discount || 0;

  // Prevent negative prices
  return Math.max(0, basePrice - discount);
};

/**
 * Update a combo's price based on its snacks
 * Returns a new combo object with updated price
 */
export const updateComboPriceFromSnacks = (combo: Combo): Combo => {
  if (!combo) return combo;

  const basePrice = calculateComboPrice(combo);

  return {
    ...combo,
    price: basePrice,
  };
};

/**
 * Validate that combo discount doesn't exceed the total price of snacks
 * Returns true if valid, false otherwise
 */
export const isValidComboDiscount = (combo: Combo): boolean => {
  if (!combo?.snacks?.length) return combo?.discount === 0;

  const basePrice = calculateComboPrice(combo);
  const discount = combo.discount || 0;

  return discount <= basePrice;
};

/**
 * Hook to update a combo's price based on its snacks whenever snacks change
 */
export const useAutoComboPrice = (combo: Combo): Combo => {
  if (!combo) return combo;
  return updateComboPriceFromSnacks(combo);
};

/**
 * Custom hook to fetch combo-snacks and calculate the total price
 */
export const useComboPrice = (comboId: number) => {
  const { data, isLoading, error } = useCombos();

  let combo = null;

  if (data?.result) {
    if (Array.isArray(data.result)) {
      combo = data.result.find((c) => c.id === comboId);
    } else if (typeof data.result === "object") {
      const resultObj = data.result as Record<string, unknown>;
      if ("id" in resultObj && resultObj.id === comboId) {
        combo = resultObj;
      }
    }
  }

  // Đảm bảo các giá trị là số trước khi thực hiện phép tính
  const price = combo && "price" in combo ? Number(combo.price) || 0 : 0;
  const discount = combo && "discount" in combo ? Number(combo.discount) || 0 : 0;
  const totalPrice = price - discount;

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
