import type { CustomAPIResponse } from "@/type-from-be";
import { type UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

/**
 * Hàm trích xuất thông báo lỗi từ đối tượng lỗi API
 * @param error - Đối tượng lỗi từ API
 * @param defaultMessage - Thông báo lỗi mặc định nếu không tìm thấy
 * @returns Thông báo lỗi đã xử lý
 */
const extractErrorMessage = <TError extends CustomAPIResponse>(error: TError | undefined, defaultMessage: string): string => {
  if (!error) return defaultMessage;

  // Trường hợp 1: Có message trực tiếp
  if (error.message) {
    return error.message;
  }
  // Trường hợp 2: Có mảng errors
  else if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    // Lấy thông báo lỗi từ result của phần tử đầu tiên trong mảng errors
    return error.errors[0].result || defaultMessage;
  }

  return defaultMessage;
};

/**
 * Hook xử lý các trạng thái mutation và hiển thị toast message
 * @param mutation - Mutation result từ React Query
 * @param successMessage - Thông báo khi thành công
 * @param errorMessage - Thông báo khi thất bại
 * @param onSuccess - Callback khi thành công
 * @param refetchOrInvalidate - Function để refresh dữ liệu hoặc invalidate query
 * @param queryKey - Query key để invalidate (nếu cần)
 * @param customToastId - ID tùy chỉnh cho toast (nếu cần)
 */
export const useMutationHandler = <TData, TError extends CustomAPIResponse, TVariables>(
  mutation: UseMutationResult<TData, TError, TVariables>,
  successMessage: string,
  errorMessage: string,
  onSuccess?: () => void,
  refetchOrInvalidate?: (() => void) | string[],
  queryKey?: string[],
  customToastId?: string,
) => {
  const queryClient = useQueryClient();
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (mutation.isSuccess && !toastShownRef.current) {
      // Sử dụng id cho toast để tránh hiển thị nhiều toast cùng loại
      const toastId = customToastId || `success-${successMessage}`;
      toast.success(successMessage, { id: toastId });
      toastShownRef.current = true;

      // Xử lý cập nhật dữ liệu sau khi mutation thành công
      if (typeof refetchOrInvalidate === "function") {
        // Nếu là function thì gọi để refetch data
        refetchOrInvalidate();
      } else if (Array.isArray(refetchOrInvalidate) && refetchOrInvalidate.length > 0) {
        // Nếu là mảng thì invalidate query với key được cung cấp
        queryClient.invalidateQueries({ queryKey: refetchOrInvalidate });
      } else if (queryKey?.length) {
        // Sử dụng queryKey nếu được cung cấp (cho backward compatibility)
        queryClient.invalidateQueries({ queryKey });
      }

      // Gọi callback onSuccess nếu được cung cấp
      onSuccess?.();

      // Reset mutation state sau khi xử lý xong
      setTimeout(() => {
        mutation.reset();
        toastShownRef.current = false;
      }, 100);
    } else if (mutation.isError && !toastShownRef.current) {
      const toastId = customToastId ? `error-${customToastId}` : `error-${successMessage}`;
      const errorMessageToShow = extractErrorMessage(mutation.error, errorMessage);

      toast.error(errorMessageToShow, { id: toastId });
      toastShownRef.current = true;

      setTimeout(() => {
        toastShownRef.current = false;
        // Reset mutation state sau khi hiển thị lỗi để có thể thử lại
        mutation.reset();
      }, 100);
    }

    return () => {
      toastShownRef.current = false;
    };
  }, [mutation, queryClient, successMessage, errorMessage, onSuccess, refetchOrInvalidate, queryKey, customToastId]);

  return mutation;
};
