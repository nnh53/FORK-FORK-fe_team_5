import { ROUTES } from "@/routes/route.constants";
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
      url: ROUTES.ADMIN.DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      title: "Movies",
      url: "#",
      icon: Film,
      items: [
        {
          title: "List",
          url: ROUTES.ADMIN.MOVIE,
          icon: Clapperboard,
        },
        {
          title: "Spotlight",
          url: ROUTES.ADMIN.SPOTLIGHT,
          icon: Monitor,
        },
        {
          title: "Genres",
          url: ROUTES.ADMIN.GENRES,
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
          url: ROUTES.ADMIN.CINEMA_ROOM,
          icon: Building,
        },
        {
          title: "Seat Types",
          url: ROUTES.ADMIN.SEAT_TYPES,
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
          url: ROUTES.ADMIN.SHOWTIME,
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
      url: ROUTES.ADMIN.BOOKING,
      icon: Ticket,
    },
    {
      title: "Users",
      url: "#",
      icon: User,
      items: [
        {
          title: "Members",
          url: ROUTES.ADMIN.MEMBERS,
          icon: Users,
        },
        {
          title: "Staff",
          url: ROUTES.ADMIN.STAFFS,
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
          url: ROUTES.ADMIN.COMBO,
          icon: Package,
        },
        {
          title: "Snacks",
          url: ROUTES.ADMIN.SNACKS,
          icon: Cookie,
        },
      ],
    },
    {
      title: "Promotions",
      url: ROUTES.ADMIN.PROMOTION,
      icon: Tag,
    },
  ],
};
