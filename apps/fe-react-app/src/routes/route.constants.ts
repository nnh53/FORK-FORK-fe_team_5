// Route constants for better maintainability and type safety
export const ROUTES = {
  // Root
  ROOT: "/",

  // Public Routes
  HOME: "/home",
  BOOKING: "/booking",
  CHECKOUT: "/checkout",
  MOVIE_DETAIL: "/movie/:movieId",

  // Auth Routes
  AUTH: {
    ROOT: "/auth",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    LOG_VIA_REG: "/auth/logviareg",
  },

  // User Account Routes
  ACCOUNT: "/account",

  // Admin Routes
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    MOVIE: "/admin/movie",
    CINEMA_ROOM: "/admin/cinema-room",
    CINEMA_ROOM_DETAIL: "/admin/cinema-room/:roomId",
    CINEMA_ROOM_ADD: "/admin/cinema-room/add",
    CINEMA_ROOM_EDIT: "/admin/cinema-room/edit/:id",
    SHOWTIME: "/admin/showtime",
    SEAT: "/admin/seat",
    TICKET: "/admin/ticket",
    PROMOTION: "/admin/promotion",
    MEMBERS: "/admin/members",
    STAFFS: "/admin/staffs",
    SETTINGS: "/admin/settings",
    HELP: "/admin/help",
    SEARCH: "/admin/search",
  },

  // Legacy Management Routes (to be deprecated)
  LEGACY: {
    MOVIE_MANAGEMENT: "/movie-management",
    MEMBER_MANAGEMENT: "/member-management",
    STAFF_MANAGEMENT: "/staff-management",
  },

  // Utility Routes
  WELCOME: "/welcome",
  LOADING: "/loading",
  UNAUTHORIZED: "/unauthorized",
  ERROR: "/error",
  INTERNAL_SERVER_ERROR: "/internal-server-error",
  TEST: "/test",

  // Legacy Routes (for redirects)
  LEGACY_AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    LOG_VIA_REG: "/logviareg",
  },

  LEGACY_ACCOUNT: "/myAccount",
} as const;

// Helper functions for dynamic routes
export const createMovieDetailRoute = (movieId: string | number) => `/movie/${movieId}`;

export const createCinemaRoomDetailRoute = (roomId: string | number) => `/admin/cinema-room/${roomId}`;

export const createCinemaRoomEditRoute = (id: string | number) => `/admin/cinema-room/edit/${id}`;

// Navigation helpers
export const isAuthRoute = (pathname: string) => pathname.startsWith("/auth");
export const isAdminRoute = (pathname: string) => pathname.startsWith("/admin");
export const isAccountRoute = (pathname: string) => pathname.startsWith("/account");

// Route groups for easier management
export const PUBLIC_ROUTES = [ROUTES.HOME, ROUTES.BOOKING, ROUTES.CHECKOUT, ROUTES.MOVIE_DETAIL] as const;

export const AUTH_ROUTES = [ROUTES.AUTH.LOGIN, ROUTES.AUTH.REGISTER, ROUTES.AUTH.FORGOT_PASSWORD, ROUTES.AUTH.LOG_VIA_REG] as const;

export const ADMIN_ROUTES = [
  ROUTES.ADMIN.DASHBOARD,
  ROUTES.ADMIN.MOVIE,
  ROUTES.ADMIN.CINEMA_ROOM,
  ROUTES.ADMIN.SHOWTIME,
  ROUTES.ADMIN.SEAT,
  ROUTES.ADMIN.TICKET,
  ROUTES.ADMIN.PROMOTION,
  ROUTES.ADMIN.MEMBERS,
  ROUTES.ADMIN.STAFFS,
  ROUTES.ADMIN.SETTINGS,
  ROUTES.ADMIN.HELP,
  ROUTES.ADMIN.SEARCH,
] as const;

export const UTILITY_ROUTES = [ROUTES.WELCOME, ROUTES.LOADING, ROUTES.UNAUTHORIZED, ROUTES.ERROR, ROUTES.INTERNAL_SERVER_ERROR, ROUTES.TEST] as const;

export const ROUTING_PATH = {
  ADMIN_HOME: "/admin/",
  ADMIN_MOVIE: "/admin/movie",
  ADMIN_SEAT: "/admin/seat",
  ADMIN_SHOW: "/admin/show",
  ADMIN_TICKET: "/admin/ticket",
  ADMIN_STAFF: "/admin/staff",
  ADMIN_MEMBER: "/admin/member",
} as const;
