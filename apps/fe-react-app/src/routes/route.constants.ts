/* eslint-disable sonarjs/no-hardcoded-passwords */
// Route constants for better maintainability and type safety
export const ROUTES = {
  // Root
  ROOT: "/",
  HOME: "/home",
  MOVIES_SELECTION: "/movies",
  BOOKING: "/booking",
  CHECKOUT: "/checkout",
  BOOKING_SUCCESS: "/booking-success",
  MOVIE_DETAIL: "/movie/:movieId",

  //viewing test
  CAROUSEL_SECTION: "/carousel-section",
  SCROLL_VELOCITY: "/scroll-velocity",
  HEADER_TEST: "/header-test",
  FAQ: "/faq",
  CINEMA_EXPERIENCE: "/cinema-experience",
  HERO_SECTION: "/welcome",
  NOW_SHOWING: "/now-showing",
  TRENDING_SECTION: "/trending-section",
  FLOWING_MENU_SECTION: "/flowing-menu",
  MOVIE_GALLERY: "/movie-gallery",

  //Static Routes
  TERM_OF_SERVICE: "/term-of-service",
  PRIVACY_POLICY: "/privacy-policy",
  ABOUT: "/about",
  HELP: "/help",
  SEARCH: "/search",

  // Auth Routes
  AUTH: {
    ROOT: "/auth",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    LOG_VIA_REG: "/auth/logviareg",
  },
  // Legacy Auth Routes (for redirects)
  LEGACY_AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    LOG_VIA_REG: "/logviareg",
  },

  // User Account Routes
  ACCOUNT: "/account",
  // Legacy Account Routes (for redirects)
  LEGACY_ACCOUNT: "/myAccount",

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
    COMBO: "/admin/combo",
    FOODS: "/admin/foods",
    STAFFS: "/admin/staffs",
    SETTINGS: "/admin/settings",
    HELP: "/admin/help",
    SEARCH: "/admin/search",
  }, // Staff Routes
  STAFF: {
    ROOT: "/staff",
    DASHBOARD: "/staff/dashboard",
    MOVIES: "/staff/movies",
    BOOKING: "/staff/booking",
    TICKET_SALES: "/staff/sales",
    CHECKIN: "/staff/checkin",
  },

  // Legacy Management Routes (to be deprecated)
  LEGACY: {
    MOVIE_MANAGEMENT: "/movie-management",
    MEMBER_MANAGEMENT: "/member-management",
    STAFF_MANAGEMENT: "/staff-management",
  },

  // Utility Routes
  LOADING: "/loading",
  UNAUTHORIZED: "/unauthorized",
  ERROR: "/error",
  INTERNAL_SERVER_ERROR: "/internal-server-error",
  TEST: "/test",
} as const;

// Helper functions for dynamic routes
export const createMovieDetailRoute = (movieId: string | number) => `/movie/${movieId}`;

export const createCinemaRoomDetailRoute = (roomId: string | number) => `/admin/cinema-room/${roomId}`;

export const createCinemaRoomEditRoute = (id: string | number) => `/admin/cinema-room/edit/${id}`;

// Navigation helpers
export const isAuthRoute = (pathname: string) => pathname.startsWith("/auth");
export const isAdminRoute = (pathname: string) => pathname.startsWith("/admin");
export const isStaffRoute = (pathname: string) => pathname.startsWith("/staff");
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
  ROUTES.ADMIN.FOODS,
  ROUTES.ADMIN.STAFFS,
  ROUTES.ADMIN.SETTINGS,
  ROUTES.ADMIN.HELP,
  ROUTES.ADMIN.SEARCH,
] as const;

export const UTILITY_ROUTES = [ROUTES.LOADING, ROUTES.UNAUTHORIZED, ROUTES.ERROR, ROUTES.INTERNAL_SERVER_ERROR, ROUTES.TEST] as const;

// cái này cái cũ của bảo
export const ROUTING_PATH = {
  ADMIN_HOME: "/admin/",
  ADMIN_MOVIE: "/admin/movie",
  ADMIN_SEAT: "/admin/seat",
  ADMIN_SHOW: "/admin/show",
  ADMIN_TICKET: "/admin/ticket",
  ADMIN_STAFF: "/admin/staff",
  ADMIN_MEMBER: "/admin/member",
} as const;
