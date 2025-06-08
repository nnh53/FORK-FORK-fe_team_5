import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import LogVIAReg from './components/auth/LogVIAReg';
import InternalServerError from './components/error/InternalServerError';
import NotFoundError from './components/error/NotFoundError';
import Loading from './components/shared/Loading';
import PageTransition from './components/shared/PageTransition';
import ThemeSwitch from './components/theme/ThemeSwitch';
import Unauthorized from './components/unauth/Unauthor';
import ForgotPassword from './feature/auth/ForgotPassword';
import Login from './feature/auth/Login';
import Register from './feature/auth/Register';
import Welcome from './feature/theme/Welcome';

const TITLE = 'FCinema';

function App() {
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
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <ThemeSwitch />
    </div>
  );
}

export default App;
