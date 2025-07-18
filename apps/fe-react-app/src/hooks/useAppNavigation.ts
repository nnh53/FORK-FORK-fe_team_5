import { useNavigate } from "react-router-dom";
import { ROUTES, createCinemaRoomDetailRoute, createCinemaRoomEditRoute, createMovieDetailRoute } from "../routes/route.constants";

/**
 * Custom hook for type-safe navigation throughout the application
 * Uses the centralized route constants for consistency
 */
export const useAppNavigation = () => {
  const navigate = useNavigate();

  return {
    // Basic navigation
    goTo: (path: string) => navigate(path),
    goBack: () => navigate(-1),
    replace: (path: string) => navigate(path, { replace: true }),

    // Public routes
    goToHome: () => navigate(ROUTES.HOME),
    goToBooking: () => navigate(ROUTES.BOOKING),
    goToCheckout: () => navigate(ROUTES.CHECKOUT),
    goToMovieDetail: (movieId: string | number) => navigate(createMovieDetailRoute(movieId)),

    // Auth routes
    goToLogin: () => navigate(ROUTES.AUTH.LOGIN),
    goToRegister: () => navigate(ROUTES.AUTH.REGISTER),
    goToForgotPassword: () => navigate(ROUTES.AUTH.FORGOT_PASSWORD),
    goToAuth: () => navigate(ROUTES.AUTH.ROOT),

    // Account routes
    goToAccount: () => navigate(ROUTES.ACCOUNT),

    // Admin routes
    goToAdminDashboard: () => navigate(ROUTES.ADMIN.DASHBOARD),
    goToMovieManagement: () => navigate(ROUTES.ADMIN.MOVIE),
    goToGenresManagement: () => navigate(ROUTES.ADMIN.GENRES),
    goToCinemaRoomManagement: () => navigate(ROUTES.ADMIN.CINEMA_ROOM),
    goToCinemaRoomDetail: (roomId: string | number) => navigate(createCinemaRoomDetailRoute(roomId)),
    goToCinemaRoomAdd: () => navigate(ROUTES.ADMIN.CINEMA_ROOM_ADD),
    goToCinemaRoomEdit: (id: string | number) => navigate(createCinemaRoomEditRoute(id)),
    goToShowtimeManagement: () => navigate(ROUTES.ADMIN.SHOWTIME),
    goToMemberManagement: () => navigate(ROUTES.ADMIN.MEMBERS),
    goToSnackManagement: () => navigate(ROUTES.ADMIN.SNACKS),
    goToComboManagement: () => navigate(ROUTES.ADMIN.COMBO),
    goToStaffManagement: () => navigate(ROUTES.ADMIN.STAFFS),
    goToPromotionManagement: () => navigate(ROUTES.ADMIN.PROMOTION),
    goToAdminSettings: () => navigate(ROUTES.ADMIN.SETTINGS),

    // Utility routes
    goToLoading: () => navigate(ROUTES.LOADING),
    goToUnauthorized: () => navigate(ROUTES.UNAUTHORIZED),
    goToError: () => navigate(ROUTES.ERROR),
    goToInternalServerError: () => navigate(ROUTES.INTERNAL_SERVER_ERROR),

    // Navigation with state
    goToWithState: (path: string, state: unknown) => navigate(path, { state }),

    // Conditional navigation based on user role
    goToUserHome: (userRole?: string) => {
      switch (userRole) {
        case "ROLE_ADMIN":
        case "ROLE_MANAGER":
          return navigate(ROUTES.ADMIN.DASHBOARD);
        case "ROLE_MEMBER":
          return navigate(ROUTES.HOME);
        default:
          return navigate(ROUTES.AUTH.LOGIN);
      }
    },

    // URL builders (useful for Link components)
    buildMovieDetailUrl: createMovieDetailRoute,
    buildCinemaRoomDetailUrl: createCinemaRoomDetailRoute,
    buildCinemaRoomEditUrl: createCinemaRoomEditRoute,
  };
};

// Example usage in components:
/*
const MyComponent = () => {
  const navigation = useAppNavigation();

  const handleMovieClick = (movieId: number) => {
    navigation.goToMovieDetail(movieId);
  };

  const handleLoginSuccess = (userRole: string) => {
    navigation.goToUserHome(userRole);
  };

  // For Link components
  const movieDetailUrl = navigation.buildMovieDetailUrl(123);

  return (
    <div>
      <button onClick={() => navigation.goToHome()}>Go Home</button>
      <Link to={movieDetailUrl}>Movie Detail</Link>
    </div>
  );
};
*/
