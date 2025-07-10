import type { Combo, ComboForm, ComboSnack } from "@/interfaces/combo.interface";
import type { Snack } from "@/interfaces/snacks.interface";
import type { ComboResponse, ComboSnackResponse } from "@/type-from-be";
import { $api } from "@/utils/api";

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
  console.log("Raw combo response:", JSON.stringify(comboResponse, null, 2));

  // Khi API trả về combo, snacks trong combo là dạng ApiSnack[], không phải dạng ComboSnackResponse[]
  // Cần chuyển đổi đúng cách để bảo toàn thông tin
  let transformedSnacks: ComboSnack[] = [];

  if (comboResponse.snacks && Array.isArray(comboResponse.snacks)) {
    // Trước khi map, ta cần phải lấy thông tin quantity từ combo-snacks API
    transformedSnacks = comboResponse.snacks.map((snackData) => {
      // Tạo một đối tượng ComboSnack mới với thông tin cơ bản
      // Chú ý: quantity sẽ được cập nhật sau bằng useComboSnacksByComboId
      return {
        id: Number(snackData.id ?? 0),
        quantity: 1, // Mặc định là 1, sẽ được cập nhật sau từ API combo-snacks
        snackSizeId: null,
        discountPercentage: null,
        combo: {
          id: Number(comboResponse.id),
          name: String(comboResponse.name ?? ""),
          description: String(comboResponse.description ?? ""),
          status: comboResponse.status as ComboStatus,
          img: String(comboResponse.img ?? ""),
          snacks: [], // Tránh đệ quy
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
 * Transform a combo-snack response from the API to the ComboSnack interface
 */
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

export const transformComboSnackResponse = (comboSnackResponse: ComboSnackResponse): ComboSnack => {
  console.log("Raw comboSnack response:", JSON.stringify(comboSnackResponse, null, 2));

  // Kiểm tra và xử lý dữ liệu snack
  let snackData: Snack;
  // Chỉ sử dụng fallback khi thực sự không có dữ liệu snack
  if (comboSnackResponse.snack && typeof comboSnackResponse.snack === "object") {
    // Chuyển đổi trực tiếp để đảm bảo đúng định dạng
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

  // Kiểm tra và xử lý dữ liệu combo
  let comboData: Combo;
  if (comboSnackResponse.combo && typeof comboSnackResponse.combo === "object") {
    // Tạo một phiên bản đơn giản của combo để tránh đệ quy vô hạn
    comboData = {
      id: Number(comboSnackResponse.combo.id),
      name: String(comboSnackResponse.combo.name ?? ""),
      description: String(comboSnackResponse.combo.description ?? ""),
      status: comboSnackResponse.combo.status as ComboStatus,
      img: String(comboSnackResponse.combo.img ?? ""),
      snacks: [], // Không chuyển đổi danh sách snack của combo để tránh đệ quy
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
    quantity: Number(comboSnackResponse.quantity ?? 0),
    snackSizeId: comboSnackResponse.snackSizeId ?? null,
    discountPercentage: comboSnackResponse.discountPercentage ?? null,
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
    quantity: comboSnack.quantity ?? 1, // Đảm bảo luôn có quantity, mặc định là 1
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
    const basePrice = comboSnack.snack?.price ?? 0;
    const quantity = comboSnack.quantity ?? 1;
    const discountPercentage = comboSnack.discountPercentage ?? 0;

    // Tính giá sau giảm giá
    const discountedPrice = basePrice * (1 - discountPercentage / 100);

    // Tính tổng giá dựa trên số lượng
    return total + discountedPrice * quantity;
  }, 0);
};

/**
 * Format a price in VND
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
};

/**
 * Helper function to fetch and update combo with accurate quantity information
 * This function gets the combo-snacks for a combo and updates the snacks in the combo with the correct quantity
 */
export const fetchAndUpdateComboSnacksQuantity = async (combo: Combo): Promise<Combo> => {
  try {
    // Sử dụng hook useComboSnacksByComboId để lấy combo-snacks
    const comboId = combo.id;
    // Gọi trực tiếp API theo endpoint
    const response = await fetch(`/api/combo-snacks/combo/${comboId}`);
    const responseData = await response.json();

    if (responseData?.result) {
      const comboSnacksData = Array.isArray(responseData.result) ? responseData.result : [responseData.result];

      // Chuyển đổi response thành ComboSnack[]
      const comboSnacks = transformComboSnacksResponse(comboSnacksData);

      // Tạo một map của snack id -> quantity
      const snackQuantityMap = new Map<number, number>();
      comboSnacks.forEach((cs) => {
        if (cs.snack?.id) {
          snackQuantityMap.set(cs.snack.id, cs.quantity);
        }
      });

      // Cập nhật quantity cho từng snack trong combo
      const updatedSnacks = combo.snacks.map((comboSnack) => {
        const snackId = comboSnack.snack?.id;
        if (snackId && snackQuantityMap.has(snackId)) {
          return {
            ...comboSnack,
            quantity: snackQuantityMap.get(snackId) ?? 1,
          };
        }
        return comboSnack;
      });

      // Trả về combo đã được cập nhật
      return {
        ...combo,
        snacks: updatedSnacks,
      };
    }
  } catch (error) {
    console.error("Error fetching combo-snacks:", error);
  }

  // Nếu có lỗi, trả về combo ban đầu
  return combo;
};
