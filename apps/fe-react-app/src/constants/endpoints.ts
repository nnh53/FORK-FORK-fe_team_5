export const API_URL = 'http://localhost:3000';

export const STAFF_API = {
  BASE: `http://localhost:3000/staffs`,
} as const;

export const ROUTING_PATH = {
  MANAGERS_HOME: "/managers",
  MANAGERS_MOVIE: "/managers/movie",
  MANAGERS_SEAT: "/managers/seat",
  MANAGERS_SHOW: "/managers/show",
  MANAGERS_TICKET: "/managers/ticket",
  MANAGERS_STAFF: "/managers/staff",
  MANAGERS_MEMBER: "/managers/member",
} as const;
