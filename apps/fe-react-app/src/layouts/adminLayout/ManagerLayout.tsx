import React from 'react'
import DashBoardLayout from './DashBoardLayout';
import MemberManagementPage from '../../feature/member/pages/MemberManagementPage';
import { Route, Routes } from 'react-router-dom';
import MovieManagement from '../../feature/manager/movie/MovieManagement';

function ManagerLayout ()  {
  return (
    <DashBoardLayout>
      <Routes>
        {/* <Route path="" element={<ManagerDetail />} /> */}
        <Route path="member" element={<MemberManagementPage />} />
        {/* <Route path="staff" element={<StaffManagementPage />} /> */}
        <Route path="movie" element={<MovieManagement />} />

      </Routes>
    </DashBoardLayout>
  )
}

export default ManagerLayout;