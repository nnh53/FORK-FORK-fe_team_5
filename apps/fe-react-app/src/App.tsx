import MemberManagementPage from './feature/member/pages/MemberManagementPage'; // Kiểm tra lại đường dẫn
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './feature/auth/Login';
import Register from './feature/auth/Register';
import Loading from './components/shared/Loading';
import NotFoundError from './components/error/NotFoundError';
import InternalServerError from './components/error/InternalServerError';

const TITLE = "FCinema";

function App() {
  // Bạn có thể đã có router hoặc các layout khác ở đây
  // Để DaisyUI hoạt động, bạn cần set theme. Có thể set trong tailwind.config.js hoặc thẻ html.
  // Ví dụ: đặt theme cho toàn bộ app
  return (
    <div data-theme="">
      <title>{TITLE}</title>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/error" element={<NotFoundError />} />
        <Route path="/internal-server-error" element={<InternalServerError />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>

      {/*{' '}*/}
      {/*/!* Chọn một theme của DaisyUI, ví dụ "cupcake" *!/*/}
      {/*<MemberManagementPage />*/}
    </div>
  );
}

export default App;
