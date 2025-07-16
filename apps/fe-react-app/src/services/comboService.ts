import type { Combo, ComboForm, ComboSnack } from "@/interfaces/combo.interface";
import type { Snack } from "@/interfaces/snacks.interface";
import type { components } from "@/schema-from-be";
import { $api } from "@/utils/api";
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
  console.log("Raw combo response:", JSON.stringify(comboResponse, null, 2));

  let transformedSnacks: ComboSnack[] = [];

  if (comboResponse.snacks && Array.isArray(comboResponse.snacks)) {
    transformedSnacks = comboResponse.snacks.map((snackData) => {
      return {
        id: Number(snackData.id ?? 0),
        quantity: 0, // Will be updated with correct quantity from combo-snacks API
        snackSizeId: undefined,
        discountPercentage: undefined,
        combo: {
          id: Number(comboResponse.id),
          name: String(comboResponse.name ?? ""),
          description: String(comboResponse.description ?? ""),
          status: comboResponse.status as ComboStatus,
          img: String(comboResponse.img ?? ""),
          snacks: [],
        },
        snack: {
          id: Number(snackData.id),
          category: snackData.category as "DRINK" | "FOOD",
          name: String(snackData.name),
          size: snackData.size as "SMALL" | "MEDIUM" | "LARGE",
          flavor: String(snackData.flavor ?? ""),
          price: Number(snackData.price),
          description: String(snackData.description ?? ""),
          img: String(snackData.img ?? ""),
          status: snackData.status as "AVAILABLE" | "UNAVAILABLE",
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
    comboData = {
      id: Number(comboSnackResponse.combo.id),
      name: String(comboSnackResponse.combo.name ?? ""),
      description: String(comboSnackResponse.combo.description ?? ""),
      status: comboSnackResponse.combo.status as ComboStatus,
      img: String(comboSnackResponse.combo.img ?? ""),
      snacks: [],
    };
  } else {
    comboData = {
      id: 0,
      name: "",
      description: "",
      status: "AVAILABLE",
      img: "",
      snacks: [],
    };
  }

  return {
    id: Number(comboSnackResponse.id),
    quantity: Number(comboSnackResponse.quantity || 1),
    snackSizeId: comboSnackResponse.snackSizeId,
    discountPercentage: comboSnackResponse.discountPercentage,
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
  if (!combo.snacks || combo.snacks.length === 0) return 0;

  console.log(
    `Calculating price for combo ${combo.id} with ${combo.snacks.length} snacks:`,
    (combo.snacks as ComboSnack[]).map((s) => ({
      id: s.snack?.id,
      name: s.snack?.name,
      price: s.snack?.price,
      quantity: s.quantity,
    })),
  );

  return combo.snacks.reduce((total, comboSnack) => {
    const basePrice = comboSnack.snack?.price ?? 0;
    const quantity = comboSnack.quantity || 1;
    const discountPercentage = comboSnack.discountPercentage ?? 0;
    const discountedPrice = basePrice * (1 - discountPercentage / 100);
    const itemTotal = discountedPrice * quantity;

    console.log(
      `Combo ${combo.id} - Snack ${comboSnack.snack?.name}: price=${basePrice}, quantity=${quantity}, discount=${discountPercentage}%, itemTotal=${itemTotal}`,
    );

    return total + itemTotal;
  }, 0);
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
    const discountPercentage = comboSnack.discountPercentage ?? 0;
    const discountedPrice = basePrice * (1 - discountPercentage / 100);
    const itemTotal = discountedPrice * quantity;

    console.log(`Snack ${comboSnack.snack?.name}: price=${basePrice}, quantity=${quantity}, discount=${discountPercentage}%, itemTotal=${itemTotal}`);

    return total + itemTotal;
  }, 0);
};

/**
 * Custom hook to fetch combo-snacks and calculate the total price
 */
export const useComboPrice = (comboId: number) => {
  const { data, isLoading, error } = useComboSnacksByComboId(comboId);

  let resultData: ComboSnackResponse[] = [];
  if (data?.result) {
    resultData = Array.isArray(data.result) ? data.result : [data.result];
  }

  const comboSnacks = data?.result ? transformComboSnacksResponse(resultData) : [];
  const totalPrice = calculateComboPriceWithQuantity(comboSnacks);
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
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
};

/**
 * Hàm để tải dữ liệu combo-snacks cho một danh sách combo
 */
export const loadCombosWithAccurateQuantity = async (combos: Combo[]): Promise<Combo[]> => {
  try {
    const updatedCombosPromises = combos.map((combo) => fetchAndUpdateComboSnacksQuantity(combo));
    const updatedCombos = await Promise.all(updatedCombosPromises);
    console.log("Loaded all combos with accurate quantities:", updatedCombos);
    return updatedCombos;
  } catch (error) {
    console.error("Error loading combos with accurate quantities:", error);
    return combos;
  }
};

/**
 * Helper function to fetch and update combo with accurate quantity information
 */
export const fetchAndUpdateComboSnacksQuantity = async (combo: Combo): Promise<Combo> => {
  try {
    const comboId = combo.id;
    const response = await fetch(`/api/combo-snacks/combo/${comboId}`);
    const responseData = await response.json();

    if (responseData?.result) {
      const comboSnacksData = Array.isArray(responseData.result) ? responseData.result : [responseData.result];
      const comboSnacks = transformComboSnacksResponse(comboSnacksData);

      const snackQuantityMap = new Map<number, number>();
      comboSnacks.forEach((cs) => {
        const id = cs.snack?.id;
        if (typeof id === "number") {
          snackQuantityMap.set(id, cs.quantity ?? 1);
        }
      });

      const updatedSnacks = combo.snacks.map((comboSnack) => {
        const snackId = comboSnack.snack?.id;
        if (typeof snackId === "number" && snackQuantityMap.has(snackId)) {
          return {
            ...comboSnack,
            quantity: snackQuantityMap.get(snackId) ?? 1,
          };
        }
        return comboSnack;
      });

      return {
        ...combo,
        snacks: updatedSnacks,
      };
    }
  } catch (error) {
    console.error("Error fetching combo-snacks:", error);
  }

  return combo;
};
