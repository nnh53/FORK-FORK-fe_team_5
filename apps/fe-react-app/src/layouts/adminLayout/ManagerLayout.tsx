import { Route, Routes } from "react-router-dom";
import MovieManagement from "../../feature/manager/movie/MovieManagement";
import MemberManagementPage from "../../feature/member/pages/MemberManagementPage";
import DashBoardLayout from "./DashBoardLayout";

function ManagerLayout() {
  return (
    <DashBoardLayout>
      <Routes>
        {/* <Route path="" element={<ManagerDetail />} /> */}
        <Route path="member" element={<MemberManagementPage />} />
        {/* <Route path="staff" element={<StaffManagementPage />} /> */}
        <Route path="movie" element={<MovieManagement />} />
      </Routes>
    </DashBoardLayout>
  );
}

export default ManagerLayout;
