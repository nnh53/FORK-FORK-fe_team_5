import FCinemaLogo from "@/assets/FCinema_Logo.png";
import { NavMain } from "@/components/Shadcn/nav-main";
import { NavSecondary } from "@/components/Shadcn/nav-secondary";
import { NavUser } from "@/components/Shadcn/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/Shadcn/ui/sidebar";
import { IconCalendar, IconCheckbox, IconHome, IconLifebuoy, IconSend, IconTicket } from "@tabler/icons-react";
import { Link } from "react-router-dom";

// This is sample data for staff sidebar.
const data = {
  user: {
    name: "Staff User",
    email: "staff@fcinema.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/staff/dashboard",
      icon: IconHome,
    },
    {
      title: "Bán vé trực tiếp",
      url: "/staff/sales",
      icon: IconTicket,
    },
    {
      title: "Quản lý Booking",
      url: "/staff/booking",
      icon: IconCalendar,
    },
    {
      title: "Check-in & Đổi điểm",
      url: "/staff/checkin",
      icon: IconCheckbox,
    },
  ],
  navSecondary: [
    {
      title: "Hỗ trợ",
      url: "/staff/help",
      icon: IconLifebuoy,
    },
    {
      title: "Feedback",
      url: "/staff/feedback",
      icon: IconSend,
    },
  ],
};

export function StaffSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          {" "}
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link to="/staff/dashboard">
                <img src={FCinemaLogo} alt="FCinema Logo" className="!size-5" />
                <span className="text-base font-semibold">FCinema Staff</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
