import {
  MOVIE_STATUS_BADGE_VARIANTS,
  MOVIE_STATUS_COLORS,
  ROOM_STATUS_BADGE_VARIANTS,
  ROOM_STATUS_COLORS,
  SHOWTIME_STATUS_COLORS,
  USER_STATUS_COLORS,
  USER_STATUS_LABELS,
} from "@/constants/status";
import * as Color from "color-bits";

/**
 * Get badge variant for movie status
 */
export const getStatusBadgeVariant = (status?: string) => {
  if (!status || !(status in MOVIE_STATUS_BADGE_VARIANTS)) {
    return "outline";
  }
  return MOVIE_STATUS_BADGE_VARIANTS[status as keyof typeof MOVIE_STATUS_BADGE_VARIANTS];
};

/**
 * Get CSS class name for movie status
 */
export const getStatusClassName = (status?: string) => {
  if (!status || !(status in MOVIE_STATUS_COLORS)) {
    return "bg-gray-100 text-gray-800";
  }
  return MOVIE_STATUS_COLORS[status as keyof typeof MOVIE_STATUS_COLORS];
};

/**
 * Get user status display (for Member/Staff tables)
 */
export const getUserStatusDisplay = (status: string) => {
  const label = USER_STATUS_LABELS[status as keyof typeof USER_STATUS_LABELS] || "Không xác định";
  const className = USER_STATUS_COLORS[status as keyof typeof USER_STATUS_COLORS] || "bg-yellow-100 text-yellow-800";

  return { label, className };
};

/**
 * Get room status badge variant
 */
export const getRoomStatusBadgeVariant = (status: string) => {
  return ROOM_STATUS_BADGE_VARIANTS[status as keyof typeof ROOM_STATUS_BADGE_VARIANTS] || "secondary";
};

/**
 * Get room status display (for CinemaRoomManagement)
 */
export const getRoomStatusDisplay = (status: string) => {
  const className = ROOM_STATUS_COLORS[status as keyof typeof ROOM_STATUS_COLORS] || "bg-gray-100 text-gray-800";
  return { className };
};

/**
 * Format duration in minutes to display string
 */
export const formatDuration = (duration?: number) => {
  return duration ? `${duration} min` : "N/A";
};

/**
 * Format age restriction to display string
 */
export const formatAgeRestrict = (age?: number) => {
  return age ? `${age}+` : "N/A";
};

/**
 * Format date string to locale date
 */
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

/**
 * Format date range for display
 */
export const formatDateRange = (fromDate?: string, toDate?: string) => {
  if (!fromDate) return "N/A";

  const formattedFromDate = formatDate(fromDate);
  const formattedToDate = toDate ? formatDate(toDate) : "N/A";

  return `${formattedFromDate} - ${formattedToDate}`;
};

/**
 * Get showtime status display color
 */
export const getShowtimeStatusColor = (status?: string) => {
  if (!status || !(status in SHOWTIME_STATUS_COLORS)) {
    return "bg-red-100 text-red-800";
  }
  return SHOWTIME_STATUS_COLORS[status as keyof typeof SHOWTIME_STATUS_COLORS];
};

// Helper function to add opacity to an RGB color string
export const colorWithOpacity = (color: string, opacity: number): string => {
  if (!color.startsWith("rgb")) return color;
  return Color.formatRGBA(Color.alpha(Color.parse(color), opacity));
};

// Helper function to convert any CSS color to rgba
export const getRGBA = (cssColor: React.CSSProperties["color"], fallback = "rgba(180, 180, 180)"): string => {
  if (typeof window === "undefined") return fallback;
  if (!cssColor) return fallback;

  try {
    // Handle CSS variables
    if (typeof cssColor === "string" && cssColor.startsWith("var(")) {
      const element = document.createElement("div");
      element.style.color = cssColor;
      document.body.appendChild(element);
      const computedColor = window.getComputedStyle(element).color;
      document.body.removeChild(element);
      return Color.formatRGBA(Color.parse(computedColor));
    }

    return Color.formatRGBA(Color.parse(cssColor));
  } catch (e) {
    console.error("Color parsing failed:", e);
    return fallback;
  }
};
