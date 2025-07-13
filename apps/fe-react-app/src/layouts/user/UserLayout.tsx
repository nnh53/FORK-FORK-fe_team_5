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
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Header />
      <main className={`flex-grow pt-20`}>
        <PageTransition>{children || <Outlet />}</PageTransition>
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
