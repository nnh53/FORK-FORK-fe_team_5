import PageTransition from "@/components/shared/PageTransition";
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import { Header } from "./components/Header";

interface UserLayoutProps {
  children?: React.ReactNode;
  background?: string; // <- Thêm background
}

const UserLayout = ({ children, background }: UserLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Header />

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
        <PageTransition>{children || <Outlet />}</PageTransition>
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
