import {
  MOVIE_STATUS_BADGE_VARIANTS,
  MOVIE_STATUS_COLORS,
  ROOM_STATUS_BADGE_VARIANTS,
  ROOM_STATUS_COLORS,
  USER_STATUS_COLORS,
  USER_STATUS_LABELS,
} from "@/constants/status";

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
 * Format currency value for display
 */
export const formatCurrency = (value?: number): string => {
  if (!value) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};
