import { ROUTES } from "@/routes/route.constants";
import { $api } from "@/utils/api";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PaymentReturn = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const cancelRequestWithOrderCode = $api.useMutation("post", "/bookings/cancel/{id}");

  const searchParams = new URLSearchParams(search);

  // Get parameters from the URL
  const code = searchParams.get("code");
  const id = searchParams.get("id");
  const cancel = searchParams.get("cancel");
  const status = searchParams.get("status");
  const orderCode = searchParams.get("orderCode");

  console.log("Payment return params:", { code, id, cancel, status, orderCode });

  useEffect(() => {
    // Check if payment was cancelled
    if (cancel === "true" && orderCode != null) {
      console.log("orderCode:", orderCode);
      cancelRequestWithOrderCode.mutate({
        params: {
          path: {
            id: parseInt(orderCode),
          },
        },
      });
      // quay về movies tạm
      toast.error("Bạn đã hủy thanh toán. Vui lòng thử lại.");
      navigate(ROUTES.MOVIES_SELECTION);
      // navigate(ROUTES.BOOKING, {
      //   state: {
      //     paymentCancelled: true, // khúc này chưa làm, phải route ngược lại trang booking nhưng thiếu state
      //     message: "Bạn đã hủy thanh toán. Vui lòng đặt lại lại.",
      //   },
      // });
      return;
    }

    // Check if payment was successful
    if (status === "PAID" && cancel === "false") {
      // Navigate to booking success page with the booking ID
      console.log("navigate");
      navigate(ROUTES.BOOKING_SUCCESS, {
        state: {
          bookingId: id,
          orderCode: orderCode,
          paymentSuccess: true,
        },
      });

      // // Clear the booking state from localStorage since booking is complete
      // localStorage.removeItem("bookingState");

      return;
    }

    // Handle other cases (failed payment, invalid status, etc.)
    toast.error("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.");
    navigate(ROUTES.CHECKOUT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show loading while processing
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-red-600"></div>
        <p className="mt-4 text-gray-600">Đang xử lý kết quả thanh toán...</p>
      </div>
    </div>
  );
};

export default PaymentReturn;
