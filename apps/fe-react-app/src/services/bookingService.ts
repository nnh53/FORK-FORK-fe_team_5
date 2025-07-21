import type { Booking } from "@/interfaces/booking.interface";
import type { SeatMap } from "@/interfaces/seat.interface";
import type { components } from "@/schema-from-be";
import { $api } from "@/utils/api";
type BookingRequest = components["schemas"]["BookingRequest"];
type BookingResponse = components["schemas"]["BookingResponse"];

// ==================== BOOKING API HOOKS ====================

/**
 * Hook for getting all bookings
 */
export const useBookings = () => {
  return $api.useQuery("get", "/bookings", {});
};

/**
 * Hook for getting a booking by ID
 */
export const useBooking = (id: number) => {
  return $api.useQuery("get", "/bookings/{id}", {
    params: { path: { id } },
  });
};

/**
 * Hook for getting bookings by user ID
 */
export const queryBookingsByUserId = (userId: string) => {
  return $api.useQuery("get", "/bookings/user/{userId}", {
    params: { path: { userId } },
  });
};

/**
 * Hook for getting bookings by user ID and status
 */
export const useBookingsByUserAndStatus = (userId: string, status: "PENDING" | "SUCCESS" | "CANCELLED") => {
  return $api.useQuery("get", "/bookings/user/{userId}/status/{status}", {
    params: { path: { userId, status } },
  });
};

/**
 * Hook for getting bookings by status
 */
export const useBookingsByStatus = (
  status: "PENDING" | "SUCCESS" | "CANCELLED",
) => {
  return $api.useQuery("get", "/bookings/status/{status}", {
    params: { path: { status } },
  });
};

/**
 * Hook for getting bookings by showtime ID
 */
export const useBookingsByShowtimeId = (showtimeId: number) => {
  return $api.useQuery("get", "/bookings/showtime/{showtimeId}", {
    params: { path: { showtimeId } },
  });
};

/**
 * Hook for getting bookings by payment status
 */
export const useBookingsByPaymentStatus = (paymentStatus: "PENDING" | "SUCCESS" | "FAILED") => {
  return $api.useQuery("get", "/bookings/payment-status/{paymentStatus}", {
    params: { path: { paymentStatus } },
  });
};

/**
 * Hook for getting bookings by date range
 */
export const useBookingsByDateRange = (startDate: string, endDate: string) => {
  return $api.useQuery("get", "/bookings/date-range", {
    params: {
      query: { startDate, endDate },
    },
  });
};

/**
 * Hook for creating a new booking
 */
export const useCreateBooking = () => {
  return $api.useMutation("post", "/bookings");
};

/**
 * Hook for updating a booking
 */
export const useUpdateBooking = () => {
  return $api.useMutation("put", "/bookings/{id}");
};

/**
 * Hook for confirming booking payment
 */
export const useConfirmBookingPayment = () => {
  return $api.useMutation("post", "/bookings/{id}/confirm-payment");
};

/**
 * Hook for canceling a booking
 */
export const useCancelBooking = () => {
  return $api.useMutation("post", "/bookings/{id}/cancel");
};

/**
 * Hook for getting seats by showtime (for seat selection)
 */
export const useSeatsByShowtimeId = (showtimeId: number) => {
  return $api.useQuery("get", "/seats/showtime/{showtimeId}", {
    params: { path: { showtimeId } },
  });
};

/**
 * Transform API seat response to SeatMap interface for booking
 */
export const transformSeatsToSeatMap = (seatsResponse: unknown[], roomId: number): SeatMap => {
  if (!seatsResponse || !Array.isArray(seatsResponse)) {
    return {
      gridData: [],
      roomId: roomId,
    };
  }

  const transformedSeats = seatsResponse.map((seatData: unknown) => {
    const seat = seatData as Record<string, unknown>;
    const seatType = seat.type as Record<string, unknown> | undefined;

    return {
      id: typeof seat.id === "number" ? seat.id : 0,
      name: typeof seat.name === "string" ? seat.name : "",
      roomId: roomId,
      row: typeof seat.row === "string" ? seat.row : "",
      column: typeof seat.column === "string" ? seat.column : "",
      status: typeof seat.status === "string" ? (seat.status as "AVAILABLE" | "MAINTENANCE") : "AVAILABLE",
      selected: typeof seat.selected === "boolean" ? seat.selected : false, // Add selected field from API
      type: {
        id: typeof seatType?.id === "number" ? seatType.id : 0,
        name: typeof seatType?.name === "string" ? (seatType.name as "REGULAR" | "VIP" | "PATH" | "BLOCK" | "COUPLE") : "REGULAR",
        price: typeof seatType?.price === "number" ? seatType.price : 0,
        seatCount: typeof seatType?.seatCount === "number" ? seatType.seatCount : 1,
      },
      discarded: typeof seat.discarded === "boolean" ? seat.discarded : false,
      linkSeatId: typeof seat.linkSeatId === "number" ? seat.linkSeatId : null,
    };
  });

  return {
    gridData: transformedSeats,
    roomId: roomId,
  };
};

/**
 * Get booked seats for a specific showtime by querying all bookings
 * This is an alias for useBookingsByShowtimeId for backward compatibility
 */
export const useBookedSeatsByShowtime = (showtimeId: number) => {
  return useBookingsByShowtimeId(showtimeId);
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Transform API BookingResponse to internal Booking interface
 */
export const transformBookingResponse = (bookingResponse: BookingResponse): Booking => {
  return bookingResponse;
};

/**
 * Transform internal Booking to API BookingRequest
 */
export const transformBookingToRequest = (booking: Partial<Booking>): BookingRequest => {
  const { origin } = window.location;
  return {
    userId: booking.user?.id || "",
    showtimeId: booking.showTime?.id || 0,
    promotionId: booking.promotion?.id || undefined,
    seatIds: booking.seats?.map((seat) => seat.id || 0) || [],
    totalPrice: booking.totalPrice,
    paymentMethod: booking.paymentMethod === "CASH" ? "CASH" : "ONLINE",
    staffId: booking.staffId || undefined,
    estimatedPrice: booking.totalPrice || 0,
    loyaltyPointsUsed: booking.loyaltyPointsUsed || undefined,
    bookingCombos:
      booking.bookingCombos?.map((relation) => ({
        comboId: relation.combo?.id || 0,
        quantity: relation.quantity || 0,
      })) || undefined,
    bookingSnacks:
      booking.bookingSnacks?.map((relation) => ({
        snackId: relation.snack?.id || 0,
        quantity: relation.quantity || 0,
      })) || undefined,
    feUrl: origin,
  };
};
