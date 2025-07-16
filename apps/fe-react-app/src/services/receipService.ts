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

// POST /receipt - Create/filter receipts
export const queryReceipts = () => {
  return $api.useMutation("post", "/receipt");
};

// Helper function to get receipts with filters
export const getReceiptsWithFilters = () => {
  return $api.useMutation("post", "/receipt");
};
