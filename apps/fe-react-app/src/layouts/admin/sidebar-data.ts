import {
  Building,
  Calendar,
  Cookie,
  Film,
  LayoutDashboard,
  Package,
  Settings,
  Star,
  Tag,
  Ticket,
  User,
  UserCheck,
  Users,
  Utensils,
} from "lucide-react";

export const sidebarData = {
  user: {
    name: "Admin User",
    email: "admin@fcinema.com",
    avatar: "/assets/FCinema_Logo.webp",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Movies",
      url: "/admin/movie",
      icon: Film,
      items: [
        {
          title: "Trending",
          url: "/admin/trending",
          icon: Star,
        },
      ],
    },
    {
      title: "Cinema Rooms",
      url: "/admin/cinema-room",
      icon: Building,
    },
    {
      title: "Showtimes",
      url: "/admin/showtime",
      icon: Calendar,
    },
    {
      title: "Bookings",
      url: "/admin/booking",
      icon: Ticket,
    },
    {
      title: "Users",
      url: "/admin/food",
      icon: User,
      items: [
        {
          title: "Members",
          url: "/admin/members",
          icon: Users,
        },
        {
          title: "Staff",
          url: "/admin/staffs",
          icon: UserCheck,
        },
      ],
    },
    {
      title: "Food & Beverages",
      url: "/admin/food",
      icon: Utensils,
      items: [
        {
          title: "Combos",
          url: "/admin/combo",
          icon: Package,
        },
        {
          title: "Snacks",
          url: "/admin/snacks",
          icon: Cookie,
        },
      ],
    },
    {
      title: "Promotions",
      url: "/admin/promotion",
      icon: Tag,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ],
};
