export const MOVIE_STATUS = {
  ACTIVE: "ACTIVE",
  UPCOMING: "UPCOMING",
  INACTIVE: "INACTIVE",
} as const;

export type MovieStatus = (typeof MOVIE_STATUS)[keyof typeof MOVIE_STATUS];

export const MOVIE_STATUS_LABELS = {
  [MOVIE_STATUS.ACTIVE]: "Đang chiếu",
  [MOVIE_STATUS.UPCOMING]: "Sắp chiếu",
  [MOVIE_STATUS.INACTIVE]: "Ngừng chiếu",
} as const;

export const MOVIE_STATUS_BADGE_VARIANTS = {
  [MOVIE_STATUS.ACTIVE]: "default",
  [MOVIE_STATUS.UPCOMING]: "secondary",
  [MOVIE_STATUS.INACTIVE]: "outline",
} as const;

export const MOVIE_STATUS_COLORS = {
  [MOVIE_STATUS.ACTIVE]: "bg-green-100 text-green-800",
  [MOVIE_STATUS.UPCOMING]: "bg-blue-100 text-blue-800",
  [MOVIE_STATUS.INACTIVE]: "bg-red-100 text-red-800",
} as const;

// User/Member/Staff Status
export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BANNED: "BANNED",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: "Hoạt động",
  [USER_STATUS.INACTIVE]: "Không hoạt động",
  [USER_STATUS.BANNED]: "Bị cấm",
} as const;

export const USER_STATUS_COLORS = {
  [USER_STATUS.ACTIVE]: "bg-green-100 text-green-800",
  [USER_STATUS.INACTIVE]: "bg-yellow-100 text-yellow-800",
  [USER_STATUS.BANNED]: "bg-red-100 text-red-800",
} as const;

// Cinema Room Status
export const ROOM_STATUS = {
  ACTIVE: "ACTIVE",
  MAINTENANCE: "MAINTENANCE",
  CLOSED: "CLOSED",
} as const;

export type RoomStatus = (typeof ROOM_STATUS)[keyof typeof ROOM_STATUS];

export const ROOM_STATUS_LABELS = {
  [ROOM_STATUS.ACTIVE]: "Hoạt động",
  [ROOM_STATUS.MAINTENANCE]: "Bảo trì",
  [ROOM_STATUS.CLOSED]: "Đóng cửa",
} as const;

export const ROOM_STATUS_BADGE_VARIANTS = {
  [ROOM_STATUS.ACTIVE]: "default",
  [ROOM_STATUS.MAINTENANCE]: "outline",
  [ROOM_STATUS.CLOSED]: "destructive",
} as const;

export const ROOM_STATUS_COLORS = {
  [ROOM_STATUS.ACTIVE]: "bg-green-100 text-green-800",
  [ROOM_STATUS.MAINTENANCE]: "bg-yellow-100 text-yellow-800",
  [ROOM_STATUS.CLOSED]: "bg-red-100 text-red-800",
} as const;

// Showtime Status
export const SHOWTIME_STATUS = {
  SCHEDULE: "SCHEDULE",
  ONSCREEN: "ONSCREEN",
  COMPLETED: "COMPLETED",
} as const;

export type ShowtimeStatus = (typeof SHOWTIME_STATUS)[keyof typeof SHOWTIME_STATUS];

export const SHOWTIME_STATUS_LABELS = {
  [SHOWTIME_STATUS.SCHEDULE]: "Đã lập lịch",
  [SHOWTIME_STATUS.ONSCREEN]: "Đang chiếu",
  [SHOWTIME_STATUS.COMPLETED]: "Hoàn thành",
} as const;

export const SHOWTIME_STATUS_COLORS = {
  [SHOWTIME_STATUS.SCHEDULE]: "bg-blue-100 text-blue-800",
  [SHOWTIME_STATUS.ONSCREEN]: "bg-green-100 text-green-800",
  [SHOWTIME_STATUS.COMPLETED]: "bg-gray-100 text-gray-800",
} as const;
