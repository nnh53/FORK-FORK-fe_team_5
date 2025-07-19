export interface FaqData {
  id: string;
  title: string;
  content: string;
  label: string;
  color: string;
}

export const FAQ_DATA: FaqData[] = [
  {
    id: "folder1",
    title: "Cancel booking?",
    content: "Go to My Bookings section and click Cancel button to cancel your reservation",
    label: "Booking",
    color: "#D2691E",
  },
  {
    id: "folder2",
    title: "Refund policy?",
    content: "Refunds are processed within 24 hours after cancellation request is approved",
    label: "Refunds",
    color: "#D4791F",
  },
  {
    id: "folder3",
    title: "Seat selection?",
    content: "You can choose your preferred seats during the booking process before payment",
    label: "Seats",
    color: "#D78B1F",
  },
  {
    id: "folder4",
    title: "Payment methods?",
    content: "We accept all major credit cards, PayPal, and digital wallets for secure payment",
    label: "Payment",
    color: "#D99D1F",
  },
  {
    id: "folder5",
    title: "Movie schedules?",
    content: "Movie schedules are updated daily. Check our website for the latest showtimes and availability",
    label: "Schedules",
    color: "#DAA520",
  },
];
