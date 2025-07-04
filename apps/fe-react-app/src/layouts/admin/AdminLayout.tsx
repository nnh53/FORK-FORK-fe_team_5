import { AppSidebar } from "@/components/Shadcn/app-sidebar";
import { ChartAreaInteractive } from "@/components/Shadcn/chart-area-interactive";
import { DataTable } from "@/components/Shadcn/data-table";
import { SectionCards } from "@/components/Shadcn/section-cards";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/Shadcn/ui/breadcrumb";
import { Separator } from "@/components/Shadcn/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/Shadcn/ui/sidebar";
import CinemaRoomAdd from "@/feature/manager/cinema-room/CinemaRoomAdd";
import CinemaRoomDetail from "@/feature/manager/cinema-room/CinemaRoomDetail";
import CinemaRoomEdit from "@/feature/manager/cinema-room/CinemaRoomEdit";
import CinemaRoomManagement from "@/feature/manager/cinema-room/CinemaRoomManagement";
import SeatMapManagement from "@/feature/manager/cinema-room/components/SeatMapManagement";
import ComboManagement from "@/feature/manager/food/ComboManagement";
import SnackManagement from "@/feature/manager/food/snack/SnackManagement";
import MemberManagement from "@/feature/manager/member/MemberManagement";
import MovieManagement from "@/feature/manager/movie/MovieManagement";
import { PromotionManagement } from "@/feature/manager/promotion/PromotionManagement";
import ShowtimeManagement from "@/feature/manager/show-time/ShowtimeManagement";
import StaffManagement from "@/feature/manager/staff/StaffManagement";
import {
  IconBox,
  IconChartBar,
  IconClock,
  IconListDetails,
  IconMovie,
  IconSpeakerphone,
  IconTicket,
  IconUserHeart,
  IconUsers,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import dataMock from "./data.admin-layout.json";

type AdminLayoutProps = {
  children?: ReactNode;
};

const data = {
  user: {
    name: "admin",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Management",
      url: "#",
      icon: IconChartBar,
      items: [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
          icon: IconChartBar,
        },
      ],
    },
    {
      title: "Operations",
      url: "#",
      icon: IconBox,
      items: [
        {
          title: "Booking",
          url: "/admin/booking",
          icon: IconListDetails,
        },
        {
          title: "Cinema Room",
          url: "/admin/cinema-room",
          icon: IconBox,
        },
        {
          title: "Ticket",
          url: "/admin/ticket",
          icon: IconTicket,
        },
      ],
    },
    {
      title: "Content Management",
      url: "#",
      icon: IconMovie,
      items: [
        {
          title: "Movie",
          url: "/admin/movie",
          icon: IconMovie,
        },
      ],
    },
    {
      title: "Schedule Management",
      url: "#",
      icon: IconClock,
      items: [
        {
          title: "Show Time",
          url: "/admin/showtime",
          icon: IconClock,
        },
      ],
    },
    {
      title: "Marketing",
      url: "#",
      icon: IconSpeakerphone,
      items: [
        {
          title: "Promotion",
          url: "/admin/promotion",
          icon: IconSpeakerphone,
        },
      ],
    },
    {
      title: "User Management",
      url: "#",
      icon: IconUsers,
      items: [
        {
          title: "Members",
          url: "/admin/members",
          icon: IconUsers,
        },
      ],
    },
    {
      title: "HR Management",
      url: "#",
      icon: IconUserHeart,
      items: [
        {
          title: "Staffs",
          url: "/admin/staffs",
          icon: IconUserHeart,
        },
      ],
    },
    {
      title: "F&B Management",
      url: "#",
      icon: IconBox,
      items: [
        {
          title: "Combo",
          url: "/admin/combo",
          icon: IconBox,
        },
        {
          title: "Snack",
          url: "/admin/snacks",
          icon: IconBox,
        },
      ],
    },
  ],
};

// Helper function to generate breadcrumb based on current path using data object
const getBreadcrumbFromPath = (pathname: string) => {
  // Find matching item in data.navMain
  for (const section of data.navMain) {
    if (section.items) {
      for (const item of section.items) {
        if (item.url === pathname) {
          return {
            section: section.title,
            page: item.title,
          };
        }
      }
    }
  }

  // Fallback for paths not found in data structure
  return { section: "FCinema Admin", page: "Dashboard" };
};

export default function AdminLayout({ children }: Readonly<AdminLayoutProps>) {
  const location = useLocation();
  const breadcrumb = getBreadcrumbFromPath(location.pathname);

  return (
    <SidebarProvider>
      <AppSidebar data={data} />

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
            path="booking"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Booking Management</h1>
              </div>
            }
          />
          <Route path="movie" element={<MovieManagement />} />
          <Route path="cinema-room" element={<CinemaRoomManagement />} />
          <Route path="cinema-room/:roomId" element={<CinemaRoomDetail />} />
          <Route path="cinema-room/:roomId/seat-map" element={<SeatMapManagement />} />
          <Route path="cinema-room/add" element={<CinemaRoomAdd />} />
          <Route path="cinema-room/edit/:id" element={<CinemaRoomEdit />} />
          <Route
            path="ticket"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Ticket Management</h1>
              </div>
            }
          />
          <Route path="promotion" element={<PromotionManagement />} />
          <Route path="members" element={<MemberManagement />} />
          <Route path="showtime" element={<ShowtimeManagement />} />
          <Route path="staffs" element={<StaffManagement />} />
          <Route path="combo" element={<ComboManagement />} />
          <Route path="/snacks" element={<SnackManagement />} />

          <Route
            path="settings"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Settings</h1>
              </div>
            }
          />
          <Route
            path="help"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Help Center</h1>
              </div>
            }
          />
          <Route
            path="search"
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
