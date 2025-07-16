import type { CustomAPIResponse } from "@/type-from-be";
import { type UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Hook xử lý các trạng thái mutation và hiển thị toast message
 * @param mutation - Mutation result từ React Query
 * @param successMessage - Thông báo khi thành công
 * @param errorMessage - Thông báo khi thất bại
 * @param onSuccess - Callback khi thành công
 * @param refetch - Function để refresh dữ liệu
 */
export const useMutationHandler = <TData, TError extends CustomAPIResponse, TVariables>(
  mutation: UseMutationResult<TData, TError, TVariables>,
  successMessage: string,
  errorMessage: string,
  onSuccess?: () => void,
  refetch?: () => void,
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (mutation.isSuccess) {
      // Sử dụng id cho toast để tránh hiển thị nhiều toast cùng loại
      toast.success(successMessage, { id: `success-${successMessage}` });

      // Gọi refetch nếu được cung cấp
      if (refetch) {
        refetch();
      }

      // Gọi callback onSuccess nếu được cung cấp
      onSuccess?.();

      // Reset mutation state sau khi xử lý xong
      setTimeout(() => mutation.reset(), 100);
    } else if (mutation.isError) {
      toast.error(mutation.error?.message || errorMessage, {
        id: `error-${successMessage}`,
      });
    }
  }, [mutation, queryClient, successMessage, errorMessage, onSuccess, refetch]);

  return mutation;
};
