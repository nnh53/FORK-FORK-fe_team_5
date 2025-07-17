import BannerTransition from "@/components/shared/BannerTransition";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAuthPageAnimation } from "@/hooks/useAuthPageAnimation";
import { animated } from "@react-spring/web";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  bannerTitle: string;
  bannerSubtitle: string;
  direction?: "left" | "right";
  formPosition?: "left" | "right";
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  bannerTitle,
  bannerSubtitle,
  direction = "right",
  formPosition = "right",
}) => {
  const { pageAnimation, slides } = useAuthPageAnimation({ direction });
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const FormSection = (
    <div className={`${isDesktop ? "w-1/2" : "mt-15 w-full"} flex items-center justify-center p-8 md:p-12`}>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );

  const BannerSection = (
    <div className={`${isDesktop ? "h-screen w-1/2" : "h-87 w-full"}`}>
      <BannerTransition slides={slides}>
        <h2 className="text-3xl font-bold">{bannerTitle}</h2>
        <p className="text-lg">{bannerSubtitle}</p>
      </BannerTransition>
    </div>
  );

  // Decide content order based on screen size and form position
  const renderContent = () => {
    // On mobile, form always on top
    if (!isDesktop) {
      return (
        <div className="flex h-full flex-col items-center justify-center">
          {FormSection}
          {BannerSection}
        </div>
      );
    }

    // On desktop, respect the formPosition prop
    if (formPosition === "left") {
      return (
        <>
          {FormSection}
          {BannerSection}
        </>
      );
    } else {
      return (
        <>
          {BannerSection}
          {FormSection}
        </>
      );
    }
  };

  return (
    <animated.div style={pageAnimation} className={`${isDesktop ? "flex" : "flex flex-col"} min-h-screen`}>
      {renderContent()}
    </animated.div>
  );
};

export default AuthLayout;
