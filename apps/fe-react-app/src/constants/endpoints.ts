export const API_URL = "http://localhost:3000";

export const STAFF_API = {
  BASE: `http://localhost:3000/staffs`,
} as const;

export const ROUTING_PATH = {
  ADMIN_HOME: "/admin",
  ADMIN_MOVIE: "/admin/movie",
  ADMIN_SEAT: "/admin/seat",
  ADMIN_SHOW: "/admin/show",
  ADMIN_TICKET: "/admin/ticket",
  ADMIN_STAFF: "/admin/staff",
  ADMIN_MEMBER: "/admin/member",
} as const;
