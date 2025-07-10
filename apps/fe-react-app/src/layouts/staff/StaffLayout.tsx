import { StaffSidebar } from "@/components/Shadcn/staff-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/Shadcn/ui/breadcrumb";
import { Separator } from "@/components/Shadcn/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/Shadcn/ui/sidebar";
import StaffBookingManagement from "@/feature/staff/booking/StaffBookingManagement";
import StaffTicketSales from "@/feature/staff/sales/StaffTicketSales";
import type { ReactNode } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

type StaffLayoutProps = {
  children?: ReactNode;
};

// Helper function to generate breadcrumb based on current path
const getBreadcrumbFromPath = (pathname: string) => {
  const pathSegments = pathname.split("/").filter(Boolean);

  if (pathSegments.includes("staff")) {
    const staffIndex = pathSegments.indexOf("staff");
    const currentPage = pathSegments[staffIndex + 1];

    switch (currentPage) {
      case "dashboard":
        return { section: "Staff Operations", page: "Dashboard" };
      case "sales":
        return { section: "Sales Operations", page: "Ticket Sales" };
      case "booking":
        return { section: "Customer Service", page: "Booking Management" };
      case "checkin":
        return { section: "Operations", page: "Check-in Management" };
      default:
        return { section: "FCinema Staff", page: "Operations" };
    }
  }

  return { section: "FCinema Staff", page: "Operations" };
};

export default function StaffLayout({ children }: Readonly<StaffLayoutProps>) {
  const location = useLocation();
  const breadcrumb = getBreadcrumbFromPath(location.pathname);

  return (
    <SidebarProvider>
      <StaffSidebar variant="sidebar" />
      <SidebarInset>
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/staff/dashboard">{breadcrumb.section}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumb.page}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <div className="p-4">
                  <h1 className="text-2xl font-bold">Staff Dashboard</h1>
                  <p>Welcome to staff dashboard!</p>
                </div>
              }
            />
            <Route path="/booking" element={<StaffBookingManagement />} />
            <Route path="/sales" element={<StaffTicketSales />} />
            {/* <Route path="/checkin" element={<StaffCheckinManagement />} /> */}
            {/* If children are provided, render them */}
            {children && <Route path="*" element={children} />}
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
