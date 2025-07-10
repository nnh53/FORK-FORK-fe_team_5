import { AppSidebar } from "@/components/Shadcn/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/Shadcn/ui/breadcrumb";
import { Separator } from "@/components/Shadcn/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/Shadcn/ui/sidebar";
import type { ReactNode } from "react";
import { Outlet, Route, useLocation } from "react-router-dom";
import { sidebarData } from "./sidebar-data";

type AdminLayoutProps = {
  children?: ReactNode;
};

// Helper function to generate breadcrumb based on current path using data object
const getBreadcrumbFromPath = (pathname: string) => {
  // Find matching item in data.navMain
  for (const section of sidebarData.navMain) {
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
      <AppSidebar data={sidebarData} />
      <SidebarInset>
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard">{breadcrumb.section}</BreadcrumbLink>
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
          <Outlet />
          {children && <Route path="*" element={children} />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
