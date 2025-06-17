import InternalServerError from "@/components/error/InternalServerError";
import NotFoundError from "@/components/error/NotFoundError";
import Loading from "@/components/shared/Loading";
import ForgotPassword from "@/feature/auth/ForgotPassword";
import Login from "@/feature/auth/Login";
import LogVIAReg from "@/feature/auth/LogVIAReg";
import Register from "@/feature/auth/Register";
import Unauthorized from "@/feature/auth/unauth/Unauthor";
import BookingPage from "@/feature/booking/booking-page/BookingPage.tsx";
import CheckoutPage from "@/feature/booking/checkout-page/CheckoutPage.tsx";
import HomePage from "@/feature/booking/home-page/HomePage.tsx";
import HomePageTest from "@/feature/booking/home-page/TestHomePage.tsx";
import MovieDetailPage from "@/feature/booking/movieDetail-page/MovieDetailPage.tsx";
import MemberManagement from "@/feature/manager/member/MemberManagement.tsx";
import MovieManagement from "@/feature/manager/movie/MovieManagement";
import StaffManagement from "@/feature/manager/staff/StaffManagement.tsx";
import Welcome from "@/feature/theme/Welcome";
import { MyUserManagement } from "@/feature/user-management/MyUserManagement";
import AdminLayout from "@/layouts/adminLayout/AdminLayout.tsx";
import UserLayout from "@/layouts/userLayout/UserLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "./route.constants";
import TermOfService from "@/feature/static/TermOfService";
import PrivacyPolicy from "@/feature/static/PrivacyPolicy";
import About from "@/feature/static/About";

// Main App Routes following React Router best practices
export const AppRoutes = () => (
  <Routes>
    {/* Root redirect */}
    <Route index element={<Navigate to={ROUTES.HOME} replace />} />

    {/* Public Routes */}
    <Route path={ROUTES.HOME} element={<HomePage />} />
    <Route path={ROUTES.HOME_TEST} element={<HomePageTest />} />
    <Route path={ROUTES.BOOKING} element={<BookingPage />} />
    <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
    <Route path={ROUTES.MOVIE_DETAIL} element={<MovieDetailPage />} />

    {/* Static Routes */}
    <Route path={ROUTES.TERM_OF_SERVICE} element={<TermOfService />} />
    <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
    <Route path={ROUTES.ABOUT} element={<About />} />

    {/* Auth Routes - grouped under /auth path prefix */}
    <Route path={ROUTES.AUTH.ROOT}>
      <Route index element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />
      <Route path={ROUTES.AUTH.LOGIN} element={<Login />} />
      <Route path={ROUTES.AUTH.REGISTER} element={<Register />} />
      <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.AUTH.LOG_VIA_REG} element={<LogVIAReg />} />
    </Route>

    {/* Legacy auth routes for backward compatibility */}
    <Route path={ROUTES.LEGACY_AUTH.LOGIN} element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />
    <Route path={ROUTES.LEGACY_AUTH.REGISTER} element={<Navigate to={ROUTES.AUTH.REGISTER} replace />} />
    <Route path={ROUTES.LEGACY_AUTH.FORGOT_PASSWORD} element={<Navigate to={ROUTES.AUTH.FORGOT_PASSWORD} replace />} />
    <Route path={ROUTES.LEGACY_AUTH.LOG_VIA_REG} element={<Navigate to={ROUTES.AUTH.LOG_VIA_REG} replace />} />

    {/* User Account Routes with layout */}
    <Route
      path={ROUTES.ACCOUNT}
      element={
        <UserLayout>
          <MyUserManagement />
        </UserLayout>
      }
    />
    {/* Legacy route for backward compatibility */}
    <Route path={ROUTES.LEGACY_ACCOUNT} element={<Navigate to={ROUTES.ACCOUNT} replace />} />

    {/* Admin Routes */}
    <Route path={ROUTES.ADMIN.ROOT} element={<Navigate to={ROUTES.ADMIN.PROMOTION} replace />} />
    <Route path={ROUTES.ADMIN.ROOT + "/*"} element={<AdminLayout />} />

    {/* Legacy Management Routes (should eventually be moved to admin) */}
    <Route path={ROUTES.LEGACY.MOVIE_MANAGEMENT} element={<MovieManagement />} />
    <Route path={ROUTES.LEGACY.MEMBER_MANAGEMENT} element={<MemberManagement />} />
    <Route path={ROUTES.LEGACY.STAFF_MANAGEMENT} element={<StaffManagement />} />

    {/* Utility Routes */}
    <Route path={ROUTES.WELCOME} element={<Welcome />} />
    <Route path={ROUTES.LOADING} element={<Loading />} />
    <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
    <Route path={ROUTES.ERROR} element={<NotFoundError />} />
    <Route path={ROUTES.INTERNAL_SERVER_ERROR} element={<InternalServerError />} />

    <Route path="*" element={<NotFoundError />} />
  </Routes>
);
