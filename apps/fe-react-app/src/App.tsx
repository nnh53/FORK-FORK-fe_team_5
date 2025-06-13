import { Toaster } from "@/components/ui/sonner";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LogVIAReg from "./components/auth/LogVIAReg";
import InternalServerError from "./components/error/InternalServerError";
import NotFoundError from "./components/error/NotFoundError";
import Loading from "./components/shared/Loading";
import PageTransition from "./components/shared/PageTransition";
import Unauthorized from "./components/unauth/Unauthor";
import { AuthProvider } from "./contexts/AuthContext";
import ForgotPassword from "./feature/auth/ForgotPassword";
import Login from "./feature/auth/Login";
import Register from "./feature/auth/Register";
import BookingPage from "./feature/booking/booking-page/BookingPage.tsx";
import CheckoutPage from "./feature/booking/checkout-page/CheckoutPage.tsx";
import HomePage from "./feature/booking/home-page/HomePage.tsx";
import CinemaRoomDetail from "./feature/manager/cinema-room/CinemaRoomDetail.tsx";
import CinemaRoomManagement from "./feature/manager/cinema-room/CinemaRoomManagement.tsx";
import MemberManagement from "./feature/manager/member/MemberManagement.tsx";
import MovieManagement from "./feature/manager/movie/MovieManagement";
import StaffManagement from "./feature/manager/staff/StaffManagement.tsx";
import { PromotionManagement } from "./feature/promotion-management/PromotionManagement.tsx";
import Welcome from "./feature/theme/Welcome";
import { MyUserManagement } from "./feature/user-management/MyUserManagement";
import AdminLayout from "./layouts/adminLayout/AdminLayout.tsx";
import UserLayout from "./layouts/userLayout/UserLayout";

const TITLE = "FCinema";

function App() {
  return (
    <AuthProvider>
      <div data-theme="caramellatte">
        <title>{TITLE}</title>
        <Toaster />
        <Routes>
          <Route
            path="/"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="/booking"
            element={
              <PageTransition>
                <BookingPage />
              </PageTransition>
            }
          />
          <Route
            path="/checkout"
            element={
              <PageTransition>
                <CheckoutPage />
              </PageTransition>
            }
          />
          <Route
            path="/login"
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            }
          />
          <Route
            path="/register"
            element={
              <PageTransition>
                <Register />
              </PageTransition>
            }
          />
          <Route
            path="/loading"
            element={
              <PageTransition>
                <Loading />
              </PageTransition>
            }
          />
          <Route
            path="/error"
            element={
              <PageTransition>
                <NotFoundError />
              </PageTransition>
            }
          />
          <Route
            path="/internal-server-error"
            element={
              <PageTransition>
                <InternalServerError />
              </PageTransition>
            }
          />
          <Route
            path="/logviareg"
            element={
              <PageTransition>
                <LogVIAReg />
              </PageTransition>
            }
          />
          <Route
            path="/unauthorized"
            element={
              <PageTransition>
                <Unauthorized />
              </PageTransition>
            }
          />
          <Route
            path="/welcome"
            element={
              <PageTransition>
                <Welcome />
              </PageTransition>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PageTransition>
                <ForgotPassword />
              </PageTransition>
            }
          />
          {/* //chưa auth */}
          <Route
            path="/movie-management"
            element={
              <PageTransition>
                <MovieManagement />
              </PageTransition>
            }
          />
          <Route
            path="/member-management"
            element={
              <PageTransition>
                <MemberManagement />
              </PageTransition>
            }
          />
          <Route
            path="/staff-management"
            element={
              <PageTransition>
                <StaffManagement />
              </PageTransition>
            }
          />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/dashboard"
            element={
              <PageTransition>
                <AdminLayout />
              </PageTransition>
            }
          />
          <Route
            path="/admin/booking"
            element={
              <PageTransition>
                <AdminLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Booking Management</h1>
                  </div>
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route
            path="/admin/movie"
            element={
              <PageTransition>
                <AdminLayout>
                  <MovieManagement />
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route
            path="/admin/cinema-room"
            element={
              <PageTransition>
                <AdminLayout>
                  <CinemaRoomManagement />
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route
            path="/admin/cinema-room/:roomId"
            element={
              <PageTransition>
                <AdminLayout>
                  <CinemaRoomDetail />
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route
            path="/admin/showtime"
            element={
              <PageTransition>
                <AdminLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Show Time Management</h1>
                  </div>
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route
            path="/admin/seat"
            element={
              <PageTransition>
                <AdminLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Seat Management</h1>
                  </div>
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route
            path="/admin/ticket"
            element={
              <PageTransition>
                <AdminLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Ticket Management</h1>
                  </div>
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route
            path="/admin/promotion"
            element={
              <PageTransition>
                <AdminLayout>
                  <PromotionManagement />
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route
            path="/admin/members"
            element={
              <PageTransition>
                <AdminLayout>
                  <MemberManagement />
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route
            path="/admin/staffs"
            element={
              <PageTransition>
                <AdminLayout>
                  <StaffManagement />
                </AdminLayout>
              </PageTransition>
            }
          />
          {/* Secondary navigation routes */}
          <Route
            path="/admin/settings"
            element={
              <PageTransition>
                <AdminLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Settings</h1>
                  </div>
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route
            path="/admin/help"
            element={
              <PageTransition>
                <AdminLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Help Center</h1>
                  </div>
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route
            path="/admin/search"
            element={
              <PageTransition>
                <AdminLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Search</h1>
                  </div>
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route
            path="/myAccount"
            element={
              <PageTransition>
                <UserLayout>
                  <MyUserManagement />
                </UserLayout>
              </PageTransition>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        {/* <ThemeSwitch /> */}
      </div>
    </AuthProvider>
  );
}

export default App;
