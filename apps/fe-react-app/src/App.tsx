import { DataTableDemo } from "@/components/shared/Test.tsx";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LogVIAReg from "./components/auth/LogVIAReg";
import InternalServerError from "./components/error/InternalServerError";
import NotFoundError from "./components/error/NotFoundError";
import Loading from "./components/shared/Loading";
import PageTransition from "./components/shared/PageTransition";
import ThemeSwitch from "./components/theme/ThemeSwitch.tsx";
import Unauthorized from "./components/unauth/Unauthor";
import { AuthProvider } from "./contexts/AuthContext";
import ForgotPassword from "./feature/auth/ForgotPassword";
import Login from "./feature/auth/Login";
import Register from "./feature/auth/Register";
import BookingPage from "./feature/booking/booking-page/BookingPage.tsx";
import CheckoutPage from "./feature/booking/checkout-page/CheckoutPage.tsx";
import HomePage from "./feature/booking/home-page/HomePage.tsx";
import MemberManagement from "./feature/manager/member/MemberManagement.tsx";
import MovieManagement from "./feature/manager/movie/MovieManagement";
import StaffManagement from "./feature/manager/staff/StaffManagement.tsx";
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
          <Route path="/myAccount" element={<UserLayout children={<MyUserManagement />} />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        <ThemeSwitch />
      </div>
    </AuthProvider>
  );
}

export default App;
