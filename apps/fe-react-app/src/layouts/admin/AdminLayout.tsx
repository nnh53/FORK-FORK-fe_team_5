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
import ComboManagement from "@/feature/manager/food-combo/ComboManagement";
import FoodManagement from "@/feature/manager/food-combo/food/FoodManagement";
import MemberManagement from "@/feature/manager/member/MemberManagement";
import MovieManagement from "@/feature/manager/movie/MovieManagement";
import StaffManagement from "@/feature/manager/staff/StaffManagement";
import { PromotionManagement } from "@/feature/promotion-management/PromotionManagement";
import type { ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import dataMock from "./data.admin-layout.json";

type AdminLayoutProps = {
  children?: ReactNode;
};

export default function AdminLayout({ children }: Readonly<AdminLayoutProps>) {
  return (
    <SidebarProvider
    // style={
    //   {
    //     "--sidebar-width": "calc(var(--spacing) * 72)",
    //     "--header-height": "calc(var(--spacing) * 12)",
    //   } as React.CSSProperties
    // }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <Routes>
          <Route
            path="/admin/dashboard"
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
            path="/booking"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Booking Management</h1>
              </div>
            }
          />
          <Route path="/movie" element={<MovieManagement />} />
          <Route path="/cinema-room" element={<CinemaRoomManagement />} />
          <Route path="/cinema-room/:roomId" element={<CinemaRoomDetail />} />
          <Route path="/cinema-room/add" element={<CinemaRoomAdd />} />
          <Route path="/cinema-room/edit/:id" element={<CinemaRoomEdit />} />
          <Route
            path="/showtime"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Show Time Management</h1>
              </div>
            }
          />
          <Route
            path="/seat"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Seat Management</h1>
              </div>
            }
          />
          <Route
            path="/ticket"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Ticket Management</h1>
              </div>
            }
          />
          <Route path="/promotion" element={<PromotionManagement />} />
          <Route path="/members" element={<MemberManagement />} />
          <Route path="/staffs" element={<StaffManagement />} />
          <Route path="/combo" element={<ComboManagement />} />
          <Route path="/foods" element={<FoodManagement />} />
          <Route
            path="/settings"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Settings</h1>
              </div>
            }
          />
          <Route
            path="/help"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Help Center</h1>
              </div>
            }
          />
          <Route
            path="/search"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Search</h1>
              </div>
            }
          />
          {/* If children are provided, render them */}
          {children && <Route path="*" element={children} />}
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  );
}
