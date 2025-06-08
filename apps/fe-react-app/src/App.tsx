import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Loading from './components/shared/Loading';
import Login from './feature/auth/Login';
import Register from './feature/auth/Register';
import InternalServerError from './components/error/InternalServerError';
import NotFoundError from './components/error/NotFoundError';
import PageTransition from './components/shared/PageTransition';
import LogVIAReg from './components/auth/LogVIAReg';
import Unauthorized from './components/unauth/Unauthor';


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
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
