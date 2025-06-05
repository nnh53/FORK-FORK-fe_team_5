import MemberManagementPage from './feature/member/pages/MemberManagementPage'; // Kiểm tra lại đường dẫn
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Loading from './components/shared/Loading';
import Login from './feature/auth/Login';
import Register from './feature/auth/Register';
import InternalServerError from './components/error/InternalServerError';
import NotFoundError from './components/error/NotFoundError';
import PageTransition from './components/shared/PageTransition';
// import LiquidButton from './components/liquidButoon/LiquidButton';
import LogVIAReg from './components/auth/LogVIAReg';

const TITLE = 'FCinema';

function App() {
  // Bạn có thể đã có router hoặc các layout khác ở đây
  // Để DaisyUI hoạt động, bạn cần set theme. Có thể set trong tailwind.config.js hoặc thẻ html.
  // Ví dụ: đặt theme cho toàn bộ app
  return (
    <div data-theme="">
      <title>{TITLE}</title>
      <Routes>
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
        {/* <Route
          path="/liquidbutton"
          element={
            <PageTransition>
              <LiquidButton />
            </PageTransition>
          }
        /> */}
        <Route
          path="/logviareg"
          element={
            <PageTransition>
              <LogVIAReg />
            </PageTransition>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>

      {/*{' '}*/}
      {/*/!* Chọn một theme của DaisyUI, ví dụ "cupcake" *!/*/}
      {/*<MemberManagementPage />*/}
    </div>
  );
}

export default App;
