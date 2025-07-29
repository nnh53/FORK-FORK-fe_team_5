import PageTransition from "@/components/shared/PageTransition";
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import { Header } from "./components/Header";

interface UserLayoutProps {
  children?: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  return (
    <div className="bg-[var(--color-base-100)]">
      <Header />
      <main>
        <PageTransition>{children || <Outlet />}</PageTransition>
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
