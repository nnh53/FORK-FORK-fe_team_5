import ClickSpark from "@/components/Reactbits/reactbit-animations/ClickSpark/ClickSpark";
import Stack from "@/components/Reactbits/reactbit-components/Stack/Stack";
import CarouselSection from "@/feature/views/CarouselSection/CarouselSection";
import CinemaExperience from "@/feature/views/CinemaExperience";
import { FAQ } from "@/feature/views/FAQ";
import ParallaxSection from "@/feature/views/ParallaxSection";
import TrendingSection from "@/feature/views/TrendingSection/TrendingSection";
import { useHomePageAnimations } from "@/hooks/useHomePageAnimations";

import { CTASection } from "@/components/magicui/sections/cta-section";
import { FeatureSection } from "@/components/magicui/sections/feature-section";
import { useRef } from "react";
import "./styles/HomePage.css";

const HomePage = () => {
  const carouselRef = useRef<HTMLElement | null>(null);
  const cardSwapRef = useRef<HTMLElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  const faqRef = useRef<HTMLElement | null>(null);
  const parallaxRef = useRef<HTMLElement | null>(null);

  useHomePageAnimations({
    carouselRef,
    cardSwapRef,
    experienceRef,
    faqRef,
    parallaxRef,
  });

  return (
    <div>
      <ClickSpark sparkColor="#8B4513" sparkSize={20} sparkRadius={40} sparkCount={8} duration={400}>
        <div className="home-page">
          <CarouselSection ref={carouselRef} />
          <TrendingSection ref={cardSwapRef} />
          <ParallaxSection ref={parallaxRef} />
          <CinemaExperience ref={experienceRef} />
          <FeatureSection />
          <FAQ ref={faqRef} />
          {/* Admin Team Stack */}
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <h2 className="mb-8 text-3xl font-bold">Đội Ngũ Phát Triển</h2>
              <p className="mb-12 text-lg">Các thành viên FCinema</p>

              <div className="flex w-full items-center justify-center">
                <div className="relative" style={{ left: "-130px" }}>
                  <Stack
                    randomRotation={true}
                    sensitivity={150}
                    cardDimensions={{ width: 280, height: 350 }}
                    sendToBackOnClick={true}
                    cardsData={[
                      { id: 1, img: "/admins/cuong.jpg" },
                      { id: 2, img: "/admins/hoang.jpg" },
                      { id: 3, img: "/admins/phat.jpg" },
                      { id: 4, img: "/admins/tan.jpg" },
                    ]}
                    animationConfig={{ stiffness: 260, damping: 20 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <CTASection />
      </ClickSpark>
    </div>
  );
};

export default HomePage;
