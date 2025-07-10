import { ROUTES } from "@/routes/route.constants";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PaymentReturn = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(search);

    // Get parameters from the URL
    const code = searchParams.get("code");
    const id = searchParams.get("id");
    const cancel = searchParams.get("cancel");
    const status = searchParams.get("status");
    const orderCode = searchParams.get("orderCode");

    console.log("Payment return params:", { code, id, cancel, status, orderCode });

    // Check if payment was cancelled
    if (cancel === "true") {
      // Notify user about cancellation
      toast.error("Bạn đã hủy thanh toán. Vui lòng thử lại.");

      // First navigate to checkout page briefly to show the message
      navigate(ROUTES.CHECKOUT, {
        state: {
          paymentCancelled: true,
          message: "Thanh toán đã bị hủy",
        },
      });

      // Then navigate back to booking page after a short delay
      setTimeout(() => {
        navigate(ROUTES.BOOKING);
      }, 2000);

      return;
    }

    // Check if payment was successful
    if (status === "PAID" && cancel === "false") {
      // Navigate to booking success page with the booking ID
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
  }, [search, navigate]);

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
