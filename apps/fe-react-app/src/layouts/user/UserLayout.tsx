import React from "react";
import FooterTest from "../../feature/booking/components/FooterTest/FooterTest";
import HeaderTest from "../../feature/booking/components/HeaderTest/HeaderTest";

interface UserLayoutProps {
  children: React.ReactNode;
  background?: string; // <- Thêm background
}

const UserLayout = ({ children, background }: UserLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      <HeaderTest />

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

      <FooterTest />
    </div>
  );
};

export default UserLayout;
