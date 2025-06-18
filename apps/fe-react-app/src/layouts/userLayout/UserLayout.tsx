import bgTop from "@/assets/bg-top.png";
import FCinema_Logo from "@/assets/FCinema_Logo.png";
import { useAuth } from "@/hooks/useAuth.ts";
import { ROUTES } from "@/routes/route.constants";
import React from "react";
import { useNavigate } from "react-router-dom";
import type { FooterColumnData } from "./components/footer/components/FooterColumns.tsx";
import Footer from "./components/footer/Footer";
import type { NavItemData } from "./components/header/components/NavigationBar";
import Header from "./components/header/Header";
import type { SocialLink, User } from "./type/userLayout.ts";

// Navigation items using ROUTES constants
const navItems: NavItemData[] = [
  {
    label: "Home",
    path: ROUTES.HOME,
  },
  {
    label: "Phim",
    path: ROUTES.HOME, // Movies are displayed on home page with search
    children: [
      { label: "Phim Đang Chiếu", path: ROUTES.HOME + "#now-showing" },
      { label: "Phim Sắp Chiếu", path: ROUTES.HOME + "#coming-soon" },
    ],
  },
  {
    label: "Đặt Vé",
    path: ROUTES.BOOKING,
  },
  {
    label: "Tài Khoản",
    path: ROUTES.ACCOUNT,
  },
];

// Dữ liệu cho Footer
const sampleSocialLinks: SocialLink[] = [
  { href: "#", iconClass: "fab fa-facebook-f" },
  { href: "#", iconClass: "fab fa-twitter" },
  { href: "#", iconClass: "fab fa-instagram" },
  { href: "#", iconClass: "fab fa-youtube" },
];

const sampleFooterColumns: FooterColumnData[] = [
  {
    type: "links",
    title: "VỀ CHÚNG TÔI",
    links: [
      { href: "#", label: "Giới thiệu" },
      { href: "#", label: "Liên hệ" },
      { href: "#", label: "Tuyển dụng" },
    ],
  },
  {
    type: "links",
    title: "ĐIỀU KHOẢN",
    links: [
      { href: "#", label: "Điều khoản sử dụng" },
      { href: "#", label: "Chính sách bảo mật" },
      {
        href: "#",
        label: "Khiếu nại",
      },
    ],
  },
  {
    type: "links",
    title: "HỖ TRỢ",
    links: [
      { href: "#", label: "Góp ý" },
      { href: "#", label: "Câu hỏi thường gặp" },
      {
        href: "#",
        label: "Hướng dẫn sử dụng",
      },
    ],
  },
  {
    type: "contact",
    title: "KẾT NỐI VỚI FCINEMA",
    address: "Đường Võ Nguyên Giáp, P. Phước Tân, TP. Biên Hòa, Đồng Nai",
    phone: "1900 1234",
    email: "support@fcinema.vn",
  },
];

interface UserLayoutProps {
  children: React.ReactNode;
  background?: string; // <- Thêm background
}

const UserLayout = ({ children, background }: UserLayoutProps) => {
  const { isLoggedIn, user: authUser, authLogout } = useAuth();
  const navigate = useNavigate();

  // Convert auth user to header user format
  const currentUser: User | null = authUser
    ? {
        name: authUser.username,
        avatarUrl: `https://i.pravatar.cc/150?u=${authUser.username}`,
      }
    : null;

  const handleLogin = () => {
    navigate(ROUTES.AUTH.LOGIN);
  };

  const handleLogout = () => {
    authLogout();
  };

  const handleRegister = () => {
    navigate(ROUTES.AUTH.REGISTER);
  };

  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      <Header
        logoSrc={FCinema_Logo}
        navItems={navItems}
        user={isLoggedIn ? currentUser : null}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
      />

      <div className="h-10"></div>

      <main
        className={`flex-grow pt-20 ${!background?.startsWith("http") ? background : ""}`}
        style={
          background?.startsWith("http")
            ? {
                backgroundImage: `url(${background})`,
                backgroundRepeat: "repeat",
              }
            : {}
        }
      >
        {children}
      </main>

      <Footer
        logoSrc={FCinema_Logo}
        bgSrc={bgTop}
        socialLinks={sampleSocialLinks}
        columns={sampleFooterColumns}
        copyrightText={`© ${new Date().getFullYear()} FCinema. All rights reserved.`}
      />
    </div>
  );
};

export default UserLayout;
