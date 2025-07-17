import type { UIShowtime } from "@/feature/staff/sales/types";
import type { SchedulePerDay } from "../feature/booking/components/ShowtimesModal/ShowtimesModal";

/**
 * Convert Showtime[] to SchedulePerDay[] format used by UI components
 */
export const convertShowtimesToSchedulePerDay = (
  showtimes: UIShowtime[],
): SchedulePerDay[] => {
  const now = new Date();

  // Group future showtimes by date
  const groupedByDate = showtimes.reduce(
    (acc, showtime) => {
      const showDateTime = new Date(`${showtime.date}T${showtime.startTime}`);
      if (showDateTime < now) {
        return acc;
      }

      const date = showtime.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(showtime);
      return acc;
    },
    {} as Record<string, UIShowtime[]>,
  );

  // Convert to SchedulePerDay format with sorted dates and times
  return Object.entries(groupedByDate)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, showtimes]) => {
      const sortedShowtimes = [...showtimes].sort((a, b) => a.startTime.localeCompare(b.startTime));
      return {
        date,
        showtimes: sortedShowtimes,
      };
    });
};

/**
 * Get unique dates from showtimes
 */
export const getAvailableDatesFromShowtimes = (
  showtimes: UIShowtime[],
): string[] => {
  const dates = [...new Set(showtimes.map((showtime) => showtime.date))];
  return dates.sort((a, b) => a.localeCompare(b));
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
