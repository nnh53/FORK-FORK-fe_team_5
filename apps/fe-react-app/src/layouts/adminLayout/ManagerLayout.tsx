import { Route, Routes } from 'react-router-dom';
import MemberManagement from '../../feature/manager/member/MemberManagement';
import MovieManagement from '../../feature/manager/movie/MovieManagement';
import StaffManagement from '../../feature/manager/staff/StaffManagement';
import DashBoardLayout from './DashBoardLayout';

function ManagerLayout() {
  return (
    <DashBoardLayout>
      <Routes>
        {/* <Route path="" element={<ManagerDetail />} /> */}
        <Route path="member" element={<MemberManagement />} />

        <Route path="movie" element={<MovieManagement />} />
        {/* <Route path="staff" element={<StaffManagementPage />} /> */}
        <Route path="staff" element={<StaffManagement />} />
      </Routes>
    </DashBoardLayout>
  );
}

export default ManagerLayout;
