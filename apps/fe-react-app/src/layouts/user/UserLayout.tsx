import PageTransition from "@/components/shared/PageTransition";
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";

interface UserLayoutProps {
  children?: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  return (
    <div className="relative h-[50vh] w-full overflow-y-auto">
      <Header />
      <main className="w-full bg-yellow-200">
        <PageTransition>{children || <Outlet />}</PageTransition>
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
