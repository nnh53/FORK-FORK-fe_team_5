import { DataTableDemo } from "@/components/shared/Test.tsx";
import { Toaster } from "@/components/ui/sonner";
import MovieDetailPage from "@/feature/booking/movieDetail-page/MovieDetailPage.tsx";
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
import CinemaRoomAdd from "./feature/manager/cinema-room/CinemaRoomAdd.tsx";
import CinemaRoomDetail from "./feature/manager/cinema-room/CinemaRoomDetail.tsx";
import CinemaRoomEdit from "./feature/manager/cinema-room/CinemaRoomEdit.tsx";
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
            path="/test"
            element={
              <PageTransition>
                <h1>test</h1>
                <DataTableDemo />
                <button className="btn" onClick={() => (document.getElementById("my_modal_4") as HTMLDialogElement)?.showModal()}>
                  open modal
                </button>
                <dialog id="my_modal_4" className="modal">
                  <div className="modal-box w-11/12 max-w-5xl">
                    <h3 className="font-bold text-lg">Hello!</h3>
                    <p className="py-4">Click the button below to close</p>
                    <div className="modal-action">
                      <form method="dialog">
                        {/* if there is a button, it will close the modal */}
                        <button className="btn">Close</button>
                      </form>
                    </div>
                  </div>
                </dialog>

                <div className="overflow-x-auto">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr>
                        <th>
                          <label>
                            <input type="checkbox" className="checkbox" />
                          </label>
                        </th>
                        <th>Name</th>
                        <th>Job</th>
                        <th>Favorite Color</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* row 1 */}
                      <tr>
                        <th>
                          <label>
                            <input type="checkbox" className="checkbox" />
                          </label>
                        </th>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12">
                                <img src="https://img.daisyui.com/images/profile/demo/2@94.webp" alt="Avatar Tailwind CSS Component" />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">Hart Hagerty</div>
                              <div className="text-sm opacity-50">United States</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          Zemlak, Daniel and Leannon
                          <br />
                          <span className="badge badge-ghost badge-sm">Desktop Support Technician</span>
                        </td>
                        <td>Purple</td>
                        <th>
                          <button className="btn btn-ghost btn-xs">details</button>
                        </th>
                      </tr>
                      {/* row 2 */}
                      <tr>
                        <th>
                          <label>
                            <input type="checkbox" className="checkbox" />
                          </label>
                        </th>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12">
                                <img src="https://img.daisyui.com/images/profile/demo/3@94.webp" alt="Avatar Tailwind CSS Component" />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">Brice Swyre</div>
                              <div className="text-sm opacity-50">China</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          Carroll Group
                          <br />
                          <span className="badge badge-ghost badge-sm">Tax Accountant</span>
                        </td>
                        <td>Red</td>
                        <th>
                          <button className="btn btn-ghost btn-xs">details</button>
                        </th>
                      </tr>
                      {/* row 3 */}
                      <tr>
                        <th>
                          <label>
                            <input type="checkbox" className="checkbox" />
                          </label>
                        </th>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12">
                                <img src="https://img.daisyui.com/images/profile/demo/4@94.webp" alt="Avatar Tailwind CSS Component" />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">Marjy Ferencz</div>
                              <div className="text-sm opacity-50">Russia</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          Rowe-Schoen
                          <br />
                          <span className="badge badge-ghost badge-sm">Office Assistant I</span>
                        </td>
                        <td>Crimson</td>
                        <th>
                          <button className="btn btn-ghost btn-xs">details</button>
                        </th>
                      </tr>
                      {/* row 4 */}
                      <tr>
                        <th>
                          <label>
                            <input type="checkbox" className="checkbox" />
                          </label>
                        </th>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12">
                                <img src="https://img.daisyui.com/images/profile/demo/5@94.webp" alt="Avatar Tailwind CSS Component" />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">Yancy Tear</div>
                              <div className="text-sm opacity-50">Brazil</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          Wyman-Ledner
                          <br />
                          <span className="badge badge-ghost badge-sm">Community Outreach Specialist</span>
                        </td>
                        <td>Indigo</td>
                        <th>
                          <button className="btn btn-ghost btn-xs">details</button>
                        </th>
                      </tr>
                    </tbody>
                    {/* foot */}
                    <tfoot>
                      <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Job</th>
                        <th>Favorite Color</th>
                        <th></th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </PageTransition>
            }
          />
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
            path="/movie/:movieId" // Example dynamic route
            element={
              <PageTransition>
                <MovieDetailPage />
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
          {/* //chưa auth */}
          <Route
            path="/admin"
            element={
              <PageTransition>
                <AdminLayout />
              </PageTransition>
            }
          />
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
                <AdminLayout
                  children={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Booking Management</h1>
                    </div>
                  }
                />
              </PageTransition>
            }
          />
          <Route
            path="/admin/movie"
            element={
              <PageTransition>
                <AdminLayout children={<MovieManagement />} />
              </PageTransition>
            }
          />
          <Route
            path="/admin/cinema-room"
            element={
              <PageTransition>
                <AdminLayout children={<CinemaRoomManagement />} />
              </PageTransition>
            }
          />
          <Route
            path="/admin/cinema-room/:roomId"
            element={
              <PageTransition>
                <AdminLayout children={<CinemaRoomDetail />} />
              </PageTransition>
            }
          />
          <Route
            path="/admin/cinema-room/add"
            element={
              <PageTransition>
                <AdminLayout children={<CinemaRoomAdd />} />
              </PageTransition>
            }
          />
          <Route
            path="/admin/cinema-room/edit/:id"
            element={
              <PageTransition>
                <AdminLayout children={<CinemaRoomEdit />} />
              </PageTransition>
            }
          />
          <Route
            path="/admin/showtime"
            element={
              <PageTransition>
                <AdminLayout
                  children={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Show Time Management</h1>
                    </div>
                  }
                />
              </PageTransition>
            }
          />
          <Route
            path="/admin/seat"
            element={
              <PageTransition>
                <AdminLayout
                  children={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Seat Management</h1>
                    </div>
                  }
                />
              </PageTransition>
            }
          />
          <Route
            path="/admin/ticket"
            element={
              <PageTransition>
                <AdminLayout
                  children={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Ticket Management</h1>
                    </div>
                  }
                />
              </PageTransition>
            }
          />
          <Route
            path="/admin/promotion"
            element={
              <PageTransition>
                <AdminLayout children={<PromotionManagement />} />
              </PageTransition>
            }
          />
          <Route
            path="/admin/members"
            element={
              <PageTransition>
                <AdminLayout children={<MemberManagement />} />
              </PageTransition>
            }
          />
          <Route
            path="/admin/staffs"
            element={
              <PageTransition>
                <AdminLayout children={<StaffManagement />} />
              </PageTransition>
            }
          />
          {/* Secondary navigation routes */}
          <Route
            path="/admin/settings"
            element={
              <PageTransition>
                <AdminLayout
                  children={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Settings</h1>
                    </div>
                  }
                />
              </PageTransition>
            }
          />
          <Route
            path="/admin/help"
            element={
              <PageTransition>
                <AdminLayout
                  children={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Help Center</h1>
                    </div>
                  }
                />
              </PageTransition>
            }
          />
          <Route
            path="/admin/search"
            element={
              <PageTransition>
                <AdminLayout
                  children={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Search</h1>
                    </div>
                  }
                />
              </PageTransition>
            }
          />
          <Route path="/myAccount" element={<UserLayout children={<MyUserManagement />} />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        {/* <ThemeSwitch /> */}
      </div>
    </AuthProvider>
  );
}

export default App;
