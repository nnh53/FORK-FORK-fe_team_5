import { ROUTES } from "@/routes/route.constants";
import {
  IconHome,
  IconTicket,
  IconCalendar,
  IconLifebuoy,
  IconSend,
} from "@tabler/icons-react";

export const sidebarData = {
  user: {
    name: "Staff User",
    email: "staff@fcinema.com",
    avatar: "/assets/FCinema_Logo.webp",
  },
  navMain: [
    {
      title: "Dashboard",
      url: ROUTES.STAFF.DASHBOARD,
      icon: IconHome,
    },
    {
      title: "Bán vé trực tiếp",
      url: ROUTES.STAFF.TICKET_SALES,
      icon: IconTicket,
    },
    {
      title: "Quản lý Booking",
      url: ROUTES.STAFF.BOOKING,
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
