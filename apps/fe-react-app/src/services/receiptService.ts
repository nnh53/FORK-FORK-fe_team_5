import type { ReceiptFilterRequest } from "@/interfaces/receipt.interface";
import { $api } from "@/utils/api";

// GET /receipt/topMovie - Get trending movies by revenue
export const queryReceiptTopMovies = (fromDate: string, toDate: string) => {
  return $api.useQuery("get", "/receipt/topMovie", {
    params: {
      query: {
        fromDate,
        toDate,
      },
    },
  });
};

export const useReceipt = () => {
  return $api.useMutation("post", "/receipt");
}; // POST /receipt - Filter receipts by date range

export const useReceiptsForChart = (fromDate: string, toDate: string) => {
  const filterRequest: ReceiptFilterRequest = {
    fromDate,
    toDate,
  };

  return $api.useQuery("post", "/receipt", {
    body: filterRequest,
  });
};

// POST /receipt - Create/filter receipts (legacy)
export const queryReceipts = () => {
  return $api.useMutation("post", "/receipt");
};

export const useTopSnack = (fromDate: string, toDate: string) => {
  return $api.useQuery("get", "/receipt/topSnack", {
    params: {
      query: {
        fromDate,
        toDate,
      },
    },
  });
};

export const useTopCombo = (fromDate: string, toDate: string) => {
  return $api.useQuery("get", "/receipt/topCombo", {
    params: {
      query: {
        fromDate,
        toDate,
      },
    },
  });
};
