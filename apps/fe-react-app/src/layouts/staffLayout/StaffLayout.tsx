import { SiteHeader } from "@/components/site-header";
import { StaffSidebar } from "@/components/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import StaffBookingManagement from "@/feature/staff/booking/StaffBookingManagement";
import StaffCheckinManagement from "@/feature/staff/checkin/StaffCheckinManagement";
import StaffDashboard from "@/feature/staff/dashboard/StaffDashboard";
import StaffTicketSales from "@/feature/staff/sales/StaffTicketSales";
import type { ReactNode } from "react";
import { Route, Routes } from "react-router-dom";

type StaffLayoutProps = {
  children?: ReactNode;
};

export default function StaffLayout({ children }: Readonly<StaffLayoutProps>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <StaffSidebar variant="sidebar" />
      <SidebarInset>
        <SiteHeader />{" "}
        <Routes>
          {" "}
          <Route path="/dashboard" element={<StaffDashboard />} />
          <Route path="/booking" element={<StaffBookingManagement />} />
          <Route path="/sales" element={<StaffTicketSales />} />
          <Route path="/checkin" element={<StaffCheckinManagement />} />
          {/* If children are provided, render them */}
          {children && <Route path="*" element={children} />}
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  );
}
