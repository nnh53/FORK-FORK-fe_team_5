import { useMemo } from "react";
import { useSeatsByShowtimeId } from "@/services/bookingService";

export const useAvailableSeats = (showtimeId: number) => {
  const query = useSeatsByShowtimeId(showtimeId);

  const availableSeats = useMemo(() => {
    const result = query.data?.result;
    if (!result) return 0;
    const seats = Array.isArray(result) ? result : [result];
    return seats.filter((seat) => seat.status === "AVAILABLE").length;
  }, [query.data]);

  return { ...query, availableSeats } as const;
};
