import { AppSidebar } from "@/components/Shadcn/app-sidebar";
import { ChartAreaInteractive } from "@/components/Shadcn/chart-area-interactive";
import { DataTable } from "@/components/Shadcn/data-table";
import { SectionCards } from "@/components/Shadcn/section-cards";
import { SiteHeader } from "@/components/Shadcn/site-header";
import { SidebarInset, SidebarProvider } from "@/components/Shadcn/ui/sidebar";
import CinemaRoomAdd from "@/feature/manager/cinema-room/CinemaRoomAdd";
import CinemaRoomDetail from "@/feature/manager/cinema-room/CinemaRoomDetail";
import CinemaRoomEdit from "@/feature/manager/cinema-room/CinemaRoomEdit";
import CinemaRoomManagement from "@/feature/manager/cinema-room/CinemaRoomManagement";
import SeatMapManagement from "@/feature/manager/cinema-room/components/SeatMapManagement";
import ComboManagement from "@/feature/manager/food/ComboManagement";
import SnackManagement from "@/feature/manager/food/snack/SnackManagement";
import MemberManagement from "@/feature/manager/member/MemberManagement";
import MovieManagement from "@/feature/manager/movie/MovieManagement";
import MovieCategoryManagement from "@/feature/manager/movie/settings/MovieCategoryManagement";
import { PromotionManagement } from "@/feature/manager/promotion/PromotionManagement";
// import ShowtimeManagement from "@/feature/manager/show-time/ShowtimeManagement";
import StaffManagement from "@/feature/manager/staff/StaffManagement";
import type { ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import dataMock from "./data.admin-layout.json";
import { sidebarData } from "./sidebar-data";
import ShowtimeDemoPage from "@/feature/manager/show-time/ShowtimeDemo";

type AdminLayoutProps = {
  children?: ReactNode;
};

export default function AdminLayout({ children }: Readonly<AdminLayoutProps>) {
  return (
    <SidebarProvider>
      <AppSidebar data={sidebarData} />
      <SidebarInset>
        <SiteHeader />

        <Routes>
          <Route
            path="dashboard"
            element={
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SectionCards />
                    <div className="px-4 lg:px-6">
                      <ChartAreaInteractive />
                    </div>
                    <DataTable data={dataMock} />
                  </div>
                </div>
              </div>
            }
          />
          <Route
            path="booking"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Booking Management</h1>
              </div>
            }
          />
          <Route path="movie" element={<MovieManagement />} />
          <Route path="genres" element={<MovieCategoryManagement />} />
          <Route path="cinema-room" element={<CinemaRoomManagement />} />
          <Route path="cinema-room/:roomId" element={<CinemaRoomDetail />} />
          <Route path="cinema-room/:roomId/seat-map" element={<SeatMapManagement />} />
          <Route path="cinema-room/add" element={<CinemaRoomAdd />} />
          <Route path="cinema-room/edit/:id" element={<CinemaRoomEdit />} />
          <Route path="promotion" element={<PromotionManagement />} />
          <Route path="members" element={<MemberManagement />} />
          <Route path="showtime" element={<ShowtimeDemoPage />} />
          <Route path="staffs" element={<StaffManagement />} />
          <Route path="combo" element={<ComboManagement />} />
          <Route path="snacks" element={<SnackManagement />} />
          {children && <Route path="*" element={children} />}
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  );
}
