import AuthLogo from "@/components/auth/AuthLogo";
import BannerTransition from "@/components/shared/BannerTransition";
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

  const FormSection = (
    <div className="w-1/2 flex items-center justify-center p-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <AuthLogo />
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );

  const BannerSection = (
    <BannerTransition slides={slides}>
      <h2 className="text-3xl font-bold">{bannerTitle}</h2>
      <p className="text-lg">{bannerSubtitle}</p>
    </BannerTransition>
  );

  return (
    <animated.div style={pageAnimation} className="flex h-screen">
      {formPosition === "left" ? (
        <>
          {FormSection}
          {BannerSection}
        </>
      ) : (
        <>
          {BannerSection}
          {FormSection}
        </>
      )}
    </animated.div>
  );
};

export default AuthLayout;
