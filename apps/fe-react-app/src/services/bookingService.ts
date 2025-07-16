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
export const useBookingsByStatus = (status: "PENDING" | "SUCCESS" | "CANCELLED") => {
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
  // Helper functions for status mapping
  const mapPaymentStatus = (status?: string) => {
    if (status === "SUCCESS") return "SUCCESS";
    if (status === "FAILED") return "FAILED";
    return "PENDING";
  };

  const mapBookingStatus = (status?: string) => {
    if (status === "SUCCESS") return "SUCCESS";
    if (status === "CANCELLED") return "CANCELLED";
    return "PENDING";
  };

  const mapSeatTypeName = (name?: string) => {
    if (name === "VIP") return "VIP";
    if (name === "COUPLE") return "DOUBLE";
    if (name === "PATH") return "PATH";
    return "SINGLE"; // Default for REGULAR and BLOCK
  };

  const mapShowtimeStatus = (status?: string) => {
    if (status === "CANCELLED") return "CANCELLED";
    if (status === "COMPLETED") return "COMPLETED";
    if (status === "ONSCREEN") return "ONSCREEN";
    return "SCHEDULE";
  };

  return {
    id: bookingResponse.id || 0,
    user_id: bookingResponse.user?.id || "",
    user: bookingResponse.user
      ? {
          id: bookingResponse.user.id || "",
          full_name: bookingResponse.user.fullName || "",
          email: bookingResponse.user.email || "",
          phone: bookingResponse.user.phone || "",
          loyalty_point: bookingResponse.loyaltyPointsUsed || 0,
        }
      : undefined,
    showtime_id: bookingResponse.showTime?.id || 0,
    showtime: bookingResponse.showTime
      ? {
          id: bookingResponse.showTime.id || 0,
          room_id: bookingResponse.showTime.roomId || 0,
          movie_id: bookingResponse.showTime.movieId || 0,
          show_date_time: new Date(bookingResponse.showTime.showDateTime || new Date()),
          end_date_time: new Date(bookingResponse.showTime.endDateTime || new Date()),
          status: mapShowtimeStatus(bookingResponse.showTime.status),
        }
      : undefined,
    promotion_id: bookingResponse.promotion?.id || undefined,
    promotion: bookingResponse.promotion
      ? {
          id: bookingResponse.promotion.id || 0,
          title: bookingResponse.promotion.title || "",
          description: bookingResponse.promotion.description || "",
          discount_value: bookingResponse.promotion.discountValue || 0,
          min_purchase: bookingResponse.promotion.minPurchase || 0,
          start_time: new Date(bookingResponse.promotion.startTime || new Date()),
          end_time: new Date(bookingResponse.promotion.endTime || new Date()),
          status: 1, // Convert to number
          type: 1, // Convert to number
          image: bookingResponse.promotion.image || "",
        }
      : undefined,
    booking_date_time: new Date(bookingResponse.bookingDate || new Date()),
    total_price: bookingResponse.totalPrice || 0,
    payment_method: bookingResponse.paymentMethod === "CASH" ? "CASH" : "ONLINE",
    payment_status: mapPaymentStatus(bookingResponse.paymentStatus),
    booking_status: mapBookingStatus(bookingResponse.status),
    staff_id: bookingResponse.staffId || undefined,
    pay_os_code: bookingResponse.payOsCode || undefined,
    loyalty_point_used: bookingResponse.loyaltyPointsUsed && bookingResponse.loyaltyPointsUsed > 0 ? bookingResponse.loyaltyPointsUsed : undefined,

    // Transform seats - using booking_seats relation format
    booking_seats:
      bookingResponse.seats?.map((seat, index) => ({
        id: index + 1, // Generate relation ID
        seat_id: seat.id || 0,
        booking_id: bookingResponse.id || 0,
        seat: {
          id: seat.id || 0,
          name: seat.name || "",
          seat_type_id: seat.type?.id || 0,
          seat_column: seat.column || "",
          seat_row: seat.row || "",
          status: "AVAILABLE", // Default status
          type: "REGULAR", // Default type
          cinema_room_id: seat.roomId || 0,
          seat_link_id: seat.linkSeatId,
          seat_type: seat.type
            ? {
                id: seat.type.id || 0,
                price: seat.type.price || 0,
                name: mapSeatTypeName(seat.type.name),
              }
            : undefined,
        },
      })) || [],

    // Transform booking combos
    booking_combos:
      bookingResponse.bookingCombos?.map((comboResponse, index) => ({
        id: index + 1, // Generate relation ID
        booking_id: bookingResponse.id || 0,
        combo_id: comboResponse.combo?.id || 0,
        quantity: comboResponse.quantity || 0,
        combo: comboResponse.combo
          ? {
              id: comboResponse.combo.id || 0,
              name: comboResponse.combo.name || "",
              description: comboResponse.combo.description || "",
              img: comboResponse.combo.img || "",
              status: "AVAILABLE", // Default status
              snacks:
                comboResponse.combo.snacks?.map((snack) => ({
                  id: snack.id || 0,
                  name: snack.name || "",
                  description: snack.description || "",
                  price: snack.price || 0,
                  category: "FOOD", // Default category
                  size: "MEDIUM", // Default size
                  flavor: snack.flavor || "",
                  img: snack.img || "",
                  status: "AVAILABLE", // Default status
                })) || [],
            }
          : undefined,
      })) || [],

    // Transform booking snacks
    booking_snacks:
      bookingResponse.bookingSnacks?.map((snackResponse, index) => ({
        id: index + 1, // Generate relation ID
        booking_id: bookingResponse.id || 0,
        snack_id: snackResponse.snack?.id || 0,
        quantity: snackResponse.quantity || 0,
        snack: snackResponse.snack
          ? {
              id: snackResponse.snack.id || 0,
              name: snackResponse.snack.name || "",
              description: snackResponse.snack.description || "",
              price: snackResponse.snack.price || 0,
              category: "FOOD", // Default category
              size: "MEDIUM", // Default size
              flavor: snackResponse.snack.flavor || "",
              img: snackResponse.snack.img || "",
              status: "AVAILABLE", // Default status
            }
          : undefined,
      })) || [],
  };
};

/**
 * Transform internal Booking to API BookingRequest
 */
export const transformBookingToRequest = (booking: Partial<Booking>): BookingRequest => {
  const { origin } = window.location;
  return {
    userId: booking.user_id || "",
    showtimeId: booking.showtime_id || 0,
    promotionId: booking.promotion_id || undefined,
    seatIds: booking.booking_seats?.map((relation) => relation.seat_id) || [],
    totalPrice: booking.total_price,
    paymentMethod: booking.payment_method === "CASH" ? "CASH" : "ONLINE",
    staffId: booking.staff_id || undefined,
    estimatedPrice: booking.total_price || 0,
    loyaltyPointsUsed: booking.loyalty_point_used || undefined,
    bookingCombos:
      booking.booking_combos?.map((relation) => ({
        comboId: relation.combo_id,
        quantity: relation.quantity,
      })) || undefined,
    bookingSnacks:
      booking.booking_snacks?.map((relation) => ({
        snackId: relation.snack_id,
        quantity: relation.quantity,
      })) || undefined,
    feUrl: origin,
  };
};
