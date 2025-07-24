import {
  Armchair,
  Building,
  CalendarClock,
  Clapperboard,
  ClockPlus,
  Cookie,
  FileClock,
  Film,
  LayoutDashboard,
  Monitor,
  Package,
  Settings,
  SquareStack,
  // Star,
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
      url: "#",
      icon: Film,
      items: [
        {
          title: "List",
          url: "/admin/movie",
          icon: Clapperboard,
        },
        {
          title: "Spotlight",
          url: "/admin/spotlight",
          icon: Monitor,
        },
        {
          title: "Genres",
          url: "/admin/genres",
          icon: SquareStack,
        },
      ],
    },
    {
      title: "Cinema Rooms",
      url: "#",
      icon: Building,
      items: [
        {
          title: "Rooms",
          url: "/admin/cinema-room",
          icon: Building,
        },
        {
          title: "Seat Types",
          url: "/admin/seat-types",
          icon: Armchair,
        },
      ],
    },
    {
      title: "Showtimes",
      url: "#",
      icon: CalendarClock,
      items: [
        {
          title: "List",
          url: "/admin/showtime",
          icon: ClockPlus,
        },
        {
          title: "Showtime in mov",
          url: "#",
          icon: FileClock,
        },
      ],
    },
    {
      title: "Bookings",
      url: "/admin/booking",
      icon: Ticket,
    },
    {
      title: "Users",
      url: "#",
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
      url: "#",
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
