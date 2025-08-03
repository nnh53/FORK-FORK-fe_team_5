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
  PAYMENT_RETURN: "/return-url",
  //viewing test
  CAROUSEL_SECTION: "/carousel-section",
  SCROLL_VELOCITY: "/scroll-velocity",
  HEADER_TEST: "/header-test",
  FAQ: "/faq",
  CINEMA_EXPERIENCE: "/cinema-experience",
  HERO_SECTION: "/welcome",
  NOW_SHOWING: "/now-showing",
  TRENDING_SECTION: "/trending",
  SPOTLIGHT_SECTION: "/spotlight",
  FLOWING_MENU_SECTION: "/flowing-menu",
  MOVIE_GALLERY: "/movie-gallery",
  SCROLL_FLOAT: "/scroll-float",

  // Auth Routes
  AUTH: {
    ROOT: "/auth",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    // eslint-disable-next-line sonarjs/no-hardcoded-passwords
    FORGOT_PASSWORD: "/auth/forgot-password",
  },
  // Legacy Auth Routes (for redirects)
  LEGACY_AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    // eslint-disable-next-line sonarjs/no-hardcoded-passwords
    FORGOT_PASSWORD: "/forgot-password",
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
    GENRES: "/admin/genres",
    CINEMA_ROOM: "/admin/cinema-room",
    CINEMA_ROOM_DETAIL: "/admin/cinema-room/:roomId",
    CINEMA_ROOM_ADD: "/admin/cinema-room/add",
    CINEMA_ROOM_EDIT: "/admin/cinema-room/edit/:id",
    SHOWTIME: "/admin/showtime",
    SHOWTIME_TABLE: "/admin/showtime-table",
    SEAT: "/admin/seat",
    SEAT_TYPES: "/admin/seat-types",
    BOOKING: "/admin/booking",
    PROMOTION: "/admin/promotion",
    MEMBERS: "/admin/members",
    COMBO: "/admin/combo",
    SNACKS: "/admin/snacks",
    STAFFS: "/admin/staffs",

    HELP: "/admin/help",
    SEARCH: "/admin/search",
    TRENDING: "/admin/trending",
    SPOTLIGHT: "/admin/spotlight",
  },
  STAFF: {
    ROOT: "/staff",
    TICKET_SALES: "/staff/sales",
    BOOKING: "/staff/booking",
    MOVIES: "/staff/movies",
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
  LOG_VIA_REG: "/logviareg",
  INTERNAL_SERVER_ERROR: "/internal-server-error",
  TEST: "/test",

  //Static Routes
  TERM_OF_SERVICE: "/term-of-service",
  PRIVACY_POLICY: "/privacy-policy",
  ABOUT: "/about",
  HELP: "/help",
  SEARCH: "/search",
} as const;
