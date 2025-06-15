import bgTop from "@/assets/bg-top.png";
import FCinema_Logo from "@/assets/FCinema_Logo.png";
import React, { useState } from "react";
import type { FooterColumnData } from "./components/footer/components/FooterColumns.tsx";
import Footer from "./components/footer/Footer";
import type { NavItemData } from "./components/header/components/NavigationBar";
import Header from "./components/header/Header";
import type { SocialLink, User } from "./type/userLayout.ts";

const sampleNavItems: NavItemData[] = [
  {
    label: "Phim",
    path: "/phim",
    children: [
      { label: "Hành động", path: "/phim-le/hanh-dong" },
      { label: "Kinh dị", path: "/phim-le/kinh-di" },
    ],
  },
  { label: "Lịch chiếu", path: "/lich-chieu" },
];

const sampleUser: User = {
  name: "Sơn Tùng",
  avatarUrl: "https://i.pravatar.cc/150?u=sontung",
};

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = () => setCurrentUser(sampleUser);
  const handleLogout = () => setCurrentUser(null);
  const handleRegister = () => alert("Chuyển đến trang đăng ký!");

  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      <Header
        logoSrc={FCinema_Logo}
        navItems={sampleNavItems}
        user={currentUser}
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
