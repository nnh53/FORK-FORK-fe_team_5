import FCinemaLogo from "@/assets/FCinema_Logo.webp";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/Shadcn/ui/sidebar";
import { IconCalendar, IconHome, IconLifebuoy, IconSend, IconTicket } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { NavUser } from "./nav-user";

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
    <Sidebar collapsible="icon" {...props}>
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
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link to={item.url} className="font-medium">
                    <item.icon />
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
