import AuthPageProtector from "@/components/auth/AuthPageProtector";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ChartAreaInteractive } from "@/components/Shadcn/chart-area-interactive";
import { DataTable } from "@/components/Shadcn/data-table";
import { SectionCards } from "@/components/Shadcn/section-cards";
import Loading from "@/components/shared/Loading";
import PageTransition from "@/components/shared/PageTransition";
import Test from "@/components/shared/Test";
import LogVIAReg from "@/feature/auth/LogVIAReg";
import RoleRoute from "@/feature/auth/RoleRoute";
import Unauthorized from "@/feature/auth/unauth/Unauthor";
import BookingPage from "@/feature/booking/BookingPage";
import BookingSuccessPage from "@/feature/booking/BookingSuccessPage.tsx";
import CheckoutPage from "@/feature/booking/CheckoutPage.tsx";
import ScrollVelocityTest from "@/feature/booking/components/Scroll-Velocitys/ScrollVelocityTest";
import CinemaRoomAdd from "@/feature/manager/cinema-room/CinemaRoomAdd";
import CinemaRoomDetail from "@/feature/manager/cinema-room/CinemaRoomDetail";
import CinemaRoomEdit from "@/feature/manager/cinema-room/CinemaRoomEdit";
import CinemaRoomManagement from "@/feature/manager/cinema-room/CinemaRoomManagement";
import SeatMapManagement from "@/feature/manager/cinema-room/components/SeatMapManagement";
import ComboManagement from "@/feature/manager/food/ComboManagement";
import SnackManagement from "@/feature/manager/food/snack/SnackManagement";
import MemberManagement from "@/feature/manager/member/MemberManagement.tsx";
import MovieManagement from "@/feature/manager/movie/MovieManagement";
import { MovieCategoryManagement } from "@/feature/manager/movie/settings";
import { PromotionManagement } from "@/feature/manager/promotion/PromotionManagement";
import { ShowtimeManagement } from "@/feature/manager/show-time";
import StaffManagement from "@/feature/manager/staff/StaffManagement";
import TrendingManagement from "@/feature/manager/trending/TrendingManagement";
import PaymentReturn from "@/feature/payment/PaymentReturn";
import { MyUserManagement } from "@/feature/userprofile/MyUserManagement";
import CarouselTest from "@/feature/views/CarouselSection/CarouselTest";
import CinemaExperience from "@/feature/views/CinemaExperience";
import FAQ from "@/feature/views/FAQ/FAQ";
import FlowingMenuSection from "@/feature/views/FlowingMenuSection";
import HeroSection from "@/feature/views/HeroSection/HeroSection";
import MovieGallery from "@/feature/views/MovieGallery/MovieGallery";
import NowShowing from "@/feature/views/NowShowing/NowShowing";
import TrendingSection from "@/feature/views/TrendingSection/TrendingSection";
import AdminLayout from "@/layouts/admin/AdminLayout";
import dataMock from "@/layouts/admin/data.admin-layout.json";
import StaffLayout from "@/layouts/staff/StaffLayout";
import { Header } from "@/layouts/user/components/Header";
import UserLayout from "@/layouts/user/UserLayout";
import ForgotPassword from "@/pages/authentication/ForgotPassword";
import Login from "@/pages/authentication/Login";
import Register from "@/pages/authentication/Register";
import InternalServerError from "@/pages/error/InternalServerError";
import NotFoundError from "@/pages/error/NotFoundError";
import HomePage from "@/pages/home/HomePage";
import About from "@/pages/static/attachment/About";
import PrivacyPolicy from "@/pages/static/rule/PrivacyPolicy";
import TermOfService from "@/pages/static/rule/TermOfService";
import MovieDetailPage from "@/pages/store/MovieDetailPage";
import MovieSelection from "@/pages/store/MovieSelection";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ROUTES } from "./route.constants";

// Main App Routes following React Router best practices
export const AppRoutes = () => (
  <Routes>
    <Route path={ROUTES.PAYMENT_RETURN} element={<PaymentReturn />} />
    {/* Auth Routes - standalone without layout */}
    <Route element={<AuthPageProtector />}>
      <Route path={ROUTES.AUTH.ROOT}>
        <Route index element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />
        <Route path={ROUTES.AUTH.LOGIN} element={<Login />} />
        <Route path={ROUTES.AUTH.REGISTER} element={<Register />} />
        <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} />
      </Route>
    </Route>

    {/* User Routes - All routes that use UserLayout */}
    <Route path="/" element={<UserLayout />}>
      {/* Root redirect */}
      <Route index element={<Navigate to={ROUTES.HOME} replace />} />
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.MOVIES_SELECTION} element={<MovieSelection />} />
      <Route path={ROUTES.MOVIE_DETAIL} element={<MovieDetailPage />} />

      {/* Protected Routes for Booking - require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.BOOKING} element={<BookingPage />} />
        <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
        <Route path={ROUTES.BOOKING_SUCCESS} element={<BookingSuccessPage />} />
        <Route path={ROUTES.ACCOUNT} element={<MyUserManagement />} />
      </Route>
      {/* Legacy route for backward compatibility */}
      <Route path={ROUTES.LEGACY_ACCOUNT} element={<Navigate to={ROUTES.ACCOUNT} replace />} />
      <Route path={ROUTES.LEGACY_AUTH.LOGIN} element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />
      <Route path={ROUTES.LEGACY_AUTH.REGISTER} element={<Navigate to={ROUTES.AUTH.REGISTER} replace />} />
      <Route path={ROUTES.LEGACY_AUTH.FORGOT_PASSWORD} element={<Navigate to={ROUTES.AUTH.FORGOT_PASSWORD} replace />} />
    </Route>
    {/*----------------------------------- Ở TRÊN LÀ MEMBER VÀ GUEST ---------------------------------------*/}
    {/* --------------------------------------------------------------------------------------------------- */}
    {/*----------------------------------- Ở DƯỚI LÀ ADMIN VÀ STAFF ---------------------------------------*/}
    {/* Admin Routes - Protected for ADMIN role */}
    <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
      <Route
        path="/"
        element={
          <PageTransition>
            <Outlet />
          </PageTransition>
        }
      >
        <Route path={ROUTES.ADMIN.ROOT} element={<AdminLayout />}>
          <Route index element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
          <Route
            path="dashboard"
            element={
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SectionCards />
                    <div className="px-4 lg:px-6">
                      <ChartAreaInteractive />
                    </div>
                    <DataTable data={dataMock} />
                  </div>
                </div>
              </div>
            }
          />
          <Route
            path="booking"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Booking Management</h1>
              </div>
            }
          />
          <Route path="movie" element={<MovieManagement />} />
          <Route path="genres" element={<MovieCategoryManagement />} />
          <Route path="cinema-room" element={<CinemaRoomManagement />} />
          <Route path="cinema-room/:roomId" element={<CinemaRoomDetail />} />
          <Route path="cinema-room/:roomId/seat-map" element={<SeatMapManagement />} />
          <Route path="cinema-room/add" element={<CinemaRoomAdd />} />
          <Route path="cinema-room/edit/:id" element={<CinemaRoomEdit />} />
          <Route path="promotion" element={<PromotionManagement />} />
          <Route path="members" element={<MemberManagement />} />
          <Route path="showtime" element={<ShowtimeManagement />} />
          <Route path="staffs" element={<StaffManagement />} />
          <Route path="combo" element={<ComboManagement />} />
          <Route path="snacks" element={<SnackManagement />} />
          <Route path="trending" element={<TrendingManagement />} />
        </Route>
      </Route>
    </Route>

    {/* Staff Routes - Protected for STAFF role */}
    <Route element={<RoleRoute allowedRoles={["STAFF"]} />}>
      <Route path={ROUTES.STAFF.ROOT} element={<Navigate to={ROUTES.STAFF.DASHBOARD} replace />} />
      <Route path={ROUTES.STAFF.ROOT + "/*"} element={<StaffLayout />} />
    </Route>
    {/* Legacy Management Routes - Protected for ADMIN/STAFF */}
    <Route element={<RoleRoute allowedRoles={["ADMIN", "STAFF"]} />}>
      <Route path={ROUTES.LEGACY.MOVIE_MANAGEMENT} element={<MovieManagement />} />
    </Route>
    <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
      <Route path={ROUTES.LEGACY.MEMBER_MANAGEMENT} element={<MemberManagement />} />
    </Route>
    {/* <Route path={ROUTES.LEGACY.STAFF_MANAGEMENT} element={<StaffManagement />} /> */}
    {/* --------------------------------------------------------------------------------------------------- */}
    {/*----------------------------------- Ở DƯỚI LÀ UTILITY VÀ STATIC VÀ TEST ---------------------------------------*/}
    {/* --------------------------------------------------------------------------------------------------- */}
    {/* Utility Routes */}
    <Route path={ROUTES.LOADING} element={<Loading />} />
    <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
    <Route path={ROUTES.ERROR} element={<NotFoundError />} />
    <Route path={ROUTES.LOG_VIA_REG} element={<LogVIAReg />} />
    <Route path={ROUTES.INTERNAL_SERVER_ERROR} element={<InternalServerError />} />
    <Route path={ROUTES.TEST} element={<Test />} />
    <Route path="*" element={<NotFoundError />} />
    {/* Static Routes */}
    <Route path={ROUTES.TERM_OF_SERVICE} element={<TermOfService />} />
    <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
    <Route path={ROUTES.ABOUT} element={<About />} />
    {/* Viewing Test Route */}
    <Route path={ROUTES.FAQ} element={<FAQ />} />
    <Route path={ROUTES.CAROUSEL_SECTION} element={<CarouselTest />} />
    <Route path={ROUTES.SCROLL_VELOCITY} element={<ScrollVelocityTest />} />
    <Route path={ROUTES.HEADER_TEST} element={<Header />} />
    <Route path={ROUTES.CINEMA_EXPERIENCE} element={<CinemaExperience />} />
    <Route path={ROUTES.HERO_SECTION} element={<HeroSection />} />
    <Route path={ROUTES.NOW_SHOWING} element={<NowShowing />} />
    <Route path={ROUTES.TRENDING_SECTION} element={<TrendingSection />} />
    <Route path={ROUTES.FLOWING_MENU_SECTION} element={<FlowingMenuSection />} />
    <Route path={ROUTES.MOVIE_GALLERY} element={<MovieGallery />} />
    {/* Catch-all for unknown routes */}
  </Routes>
);
