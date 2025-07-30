import { AppSidebar } from "@/components/Shadcn/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/Shadcn/ui/breadcrumb";
import { Separator } from "@/components/Shadcn/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/Shadcn/ui/sidebar";
import type { ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { sidebarData } from "./staff-sidebar-data";

type StaffLayoutProps = {
  children?: ReactNode;
};

// Helper function to generate breadcrumb based on current path
const getBreadcrumbFromPath = (pathname: string) => {
  const allItems = [...sidebarData.navMain, ...(sidebarData.navSecondary ?? [])];
  const found = allItems.find((item) => item.url === pathname);

  if (found) {
    return { section: "FCinema Staff", page: found.title };
  }

  return { section: "FCinema Staff", page: "Dashboard" };
};

export default function StaffLayout({ children }: Readonly<StaffLayoutProps>) {
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
                  <BreadcrumbPage>{breadcrumb.section}</BreadcrumbPage>
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
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
