// API Configuration for switching between mock and real APIs
export const API_CONFIG = {
  // Set to true to use real backend API, false for mock API
  USE_REAL_API: true,

  // Mock API URLs (Express server)
  MOCK_API: {
    BASE_URL: "http://localhost:3000",
    ENDPOINTS: {
      CINEMA_ROOMS: "/cinema-rooms",
      BOOKINGS: "/bookings",
      MEMBERS: "/members",
      MOVIES: "/movies",
      PROMOTIONS: "/promotions",
      VOUCHERS: "/vouchers",
      COMBOS: "/combos",
      SNACKS: "/snacks",
      SEAT_MAPS: "/seat-maps",
      SHOWTIMES: "/showtimes",
    },
  },

  // Real API URLs (Spring Boot backend)
  REAL_API: {
    BASE_URL: "https://fcinema-spring-ujhbb.ondigitalocean.app/movie_theater",
    ENDPOINTS: {
      CINEMA_ROOMS: "/cinema-rooms",
      SEAT_TYPES: "/seat-types",
      BOOKINGS: "/bookings",
      MEMBERS: "/members",
      MOVIES: "/movies",
      PROMOTIONS: "/promotions",
      VOUCHERS: "/vouchers",
      COMBOS: "/combos",
      SNACKS: "/snacks",
      SHOWTIMES: "/showtimes",
    },
  },
} as const;

// Helper function to get the current API base URL
export const getApiBaseUrl = (): string => {
  return API_CONFIG.USE_REAL_API ? API_CONFIG.REAL_API.BASE_URL : API_CONFIG.MOCK_API.BASE_URL;
};

// Helper function to get endpoint URL
export const getEndpointUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${endpoint}`;
};

// Helper function to check if using real API
export const isUsingRealApi = (): boolean => {
  return API_CONFIG.USE_REAL_API;
};
