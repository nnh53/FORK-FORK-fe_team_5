import {
  IconBox,
  IconCamera,
  IconChairDirector,
  IconChartBar,
  IconClock,
  IconFileAi,
  IconFileDescription,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconMovie,
  IconSearch,
  IconSettings,
  IconSpeakerphone,
  IconTicket,
  IconUserHeart,
  IconUsers,
} from "@tabler/icons-react";
import * as React from "react";
import { Link } from "react-router-dom";

import { NavDocuments } from "@/components/Shadcn/nav-documents";
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

const data = {
  user: {
    name: "admin",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconChartBar,
    },
    {
      title: "Booking",
      url: "/admin/booking",
      icon: IconListDetails,
    },
    {
      title: "Movie",
      url: "/admin/movie",
      icon: IconMovie,
    },
    {
      title: "Cinema Room",
      url: "/admin/cinema-room",
      icon: IconBox,
    },
    {
      title: "Show Time",
      url: "/admin/showtime",
      icon: IconClock,
    },
    {
      title: "Seat",
      url: "/admin/seat",
      icon: IconChairDirector,
    },
    {
      title: "Ticket",
      url: "/admin/ticket",
      icon: IconTicket,
    },
    {
      title: "Promotion",
      url: "/admin/promotion",
      icon: IconSpeakerphone,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "/admin/capture",
      items: [
        {
          title: "Active Proposals",
          url: "/admin/capture/active",
        },
        {
          title: "Archived",
          url: "/admin/capture/archived",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "/admin/proposal",
      items: [
        {
          title: "Active Proposals",
          url: "/admin/proposal/active",
        },
        {
          title: "Archived",
          url: "/admin/proposal/archived",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "/admin/prompts",
      items: [
        {
          title: "Active Proposals",
          url: "/admin/prompts/active",
        },
        {
          title: "Archived",
          url: "/admin/prompts/archived",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/admin/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/admin/search",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Members",
      url: "/admin/members",
      icon: IconUsers,
    },
    {
      name: "Staffs",
      url: "/admin/staffs",
      icon: IconUserHeart,
    },
    {
      name: "Combo",
      url: "/admin/combo",
      icon: IconBox,
    },
    {
      name: "Foods",
      url: "/admin/foods",
      icon: IconBox,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link to="/admin/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">FCinema Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
