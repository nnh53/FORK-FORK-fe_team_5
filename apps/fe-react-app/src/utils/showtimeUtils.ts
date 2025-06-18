import type { Showtime } from "../../../mockapi-express-app/src/showtimes.mockapi";
import type { SchedulePerDay } from "../feature/booking/components/ShowtimesModal/ShowtimesModal";

/**
 * Convert Showtime[] to SchedulePerDay[] format used by UI components
 */
export const convertShowtimesToSchedulePerDay = (showtimes: Showtime[]): SchedulePerDay[] => {
  // Group showtimes by date
  const groupedByDate = showtimes.reduce(
    (acc, showtime) => {
      const date = showtime.date;
      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push({
        time: showtime.startTime,
        availableSeats: showtime.availableSeats,
        format: showtime.format,
        price: showtime.price,
        showtimeId: showtime.id,
        cinemaRoomId: showtime.cinemaRoomId,
        endTime: showtime.endTime,
      });

      return acc;
    },
    {} as Record<
      string,
      Array<{
        time: string;
        availableSeats: number;
        format: string;
        price: number;
        showtimeId: string;
        cinemaRoomId: string;
        endTime: string;
      }>
    >,
  );

  // Convert to SchedulePerDay format
  return Object.entries(groupedByDate).map(([date, showtimes]) => ({
    date,
    showtimes: showtimes.sort((a, b) => a.time.localeCompare(b.time)), // Sort by time
  }));
};

/**
 * Get unique dates from showtimes
 */
export const getAvailableDatesFromShowtimes = (showtimes: Showtime[]): string[] => {
  const dates = [...new Set(showtimes.map((showtime) => showtime.date))];
  return dates.sort();
};

/**
 * Format time for display (e.g., "10:00" -> "10:00 AM")
 */
export const formatShowtime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour24 = parseInt(hours);
  let hour12;
  if (hour24 === 0) {
    hour12 = 12;
  } else if (hour24 > 12) {
    hour12 = hour24 - 12;
  } else {
    hour12 = hour24;
  }
  const ampm = hour24 >= 12 ? "PM" : "AM";
  return `${hour12}:${minutes} ${ampm}`;
};

/**
 * Format date for display (e.g., "2025-06-16" -> "Thứ 2, 16/06")
 */
export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  const weekdays = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  const weekday = weekdays[date.getDay()];
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");

  return `${weekday}, ${day}/${month}`;
};

/**
 * Format price for display (e.g., 120000 -> "120.000 ₫")
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
