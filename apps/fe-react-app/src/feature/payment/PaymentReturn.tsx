import { ROUTES } from "@/routes/route.constants";
import { $api } from "@/utils/api";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PaymentReturn = () => {
  const { search, state } = useLocation();
  const navigate = useNavigate();
  const cancelRequestWithOrderCode = $api.useMutation("post", "/bookings/cancel/{id}");

  const searchParams = new URLSearchParams(search);

  // Get parameters from the URL
  const code = searchParams.get("code");
  const id = searchParams.get("id");
  const cancel = searchParams.get("cancel");
  const status = searchParams.get("status");
  const orderCode = searchParams.get("orderCode");

  // Check if this is a staff booking (from navigation state)
  const isStaffBooking = state?.isStaffBooking || false;
  const paymentMethod = state?.paymentMethod;

  console.log("Payment return params:", { code, id, cancel, status, orderCode, isStaffBooking, paymentMethod });

  useEffect(() => {
    // Handle staff booking - they should always go to success page
    if (isStaffBooking && paymentMethod === "OFFLINE") {
      console.log("Staff booking with offline payment, navigating to success page");
      navigate(ROUTES.BOOKING_SUCCESS);
      return;
    }

    // If no URL parameters but we have state, it might be a staff booking
    if (!code && !id && !status && !cancel && !orderCode && state) {
      console.log("No URL parameters but state exists, assuming staff booking success");
      navigate(ROUTES.BOOKING_SUCCESS);
      return;
    }

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
      return;
    }

    // Check if payment was successful (for online payments)
    if (status === "PAID" && cancel === "false") {
      // Navigate to booking success page with the booking ID in URL params
      console.log("Payment successful, navigating to success page with booking ID:", id);
      navigate(`${ROUTES.BOOKING_SUCCESS}`);

      // Clear the booking state from localStorage since booking is complete
      // localStorage.removeItem("bookingState");

      return;
    }

    // Handle other cases (failed payment, invalid status, etc.)
    // Only show error if we have URL parameters (indicating this is an online payment return)
    if (code || id || status || cancel || orderCode) {
      toast.error("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.");
      navigate(ROUTES.CHECKOUT);
    }
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
