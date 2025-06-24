import React from "react";
import Footer from "./components/Footer/Footer";
import { Header } from "./components/Header";

interface UserLayoutProps {
  children: React.ReactNode;
  background?: string; // <- Thêm background
}

const UserLayout = ({ children, background }: UserLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
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
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
