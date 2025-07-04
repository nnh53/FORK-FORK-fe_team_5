import ClickSpark from "@/components/Reactbits/reactbit-animations/ClickSpark/ClickSpark";
import Magnet from "@/components/Reactbits/reactbit-animations/Magnet/Magnet";
import Stack from "@/components/Reactbits/reactbit-components/Stack/Stack";
import { Button } from "@/components/Shadcn/ui/button";
import CarouselSection from "@/feature/views/CarouselSection/CarouselSection";
import { recentMoviesData } from "@/feature/views/CarouselSection/data/movies.data";
import CinemaExperience from "@/feature/views/CinemaExperience";
import { FAQ } from "@/feature/views/FAQ";
import WelcomePanel from "@/feature/views/HeroSection/components/WelcomePanel";
import NowShowing from "@/feature/views/NowShowing/NowShowing";
import ParallaxSection from "@/feature/views/ParallaxSection";
import TrendingSection from "@/feature/views/TrendingSection/TrendingSection";
import { useHomePageAnimations } from "@/hooks/useHomePageAnimations";
import UserLayout from "@/layouts/user/UserLayout";
import { ROUTES } from "@/routes/route.constants";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement | null>(null);
  const carouselRef = useRef<HTMLElement | null>(null);
  const cardSwapRef = useRef<HTMLElement | null>(null);
  const featuredMoviesRef = useRef<HTMLElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  const faqRef = useRef<HTMLElement | null>(null);
  const parallaxRef = useRef<HTMLElement | null>(null);

  useHomePageAnimations({
    heroRef,
    carouselRef,
    cardSwapRef,
    featuredMoviesRef,
    experienceRef,
    faqRef,
    parallaxRef,
  });

  return (
    <UserLayout>
      <ClickSpark sparkColor="#8B4513" sparkSize={20} sparkRadius={40} sparkCount={8} duration={400}>
        <div className="home-page">
          {/* Header Section */}
          <div className="flex h-screen items-center justify-center">
            <div className="space-y-8 text-center">
              <WelcomePanel />
              <div>
                <p className="text-lg">Scroll xuống</p>
              </div>
            </div>
          </div>

          {/* New Releases Carousel Section */}
          <CarouselSection ref={carouselRef} movies={recentMoviesData} />
          {/* Trending Movies Section */}
          <TrendingSection ref={cardSwapRef} />
          {/* Featured Movies */}
          <NowShowing ref={featuredMoviesRef} />
          {/* Parallax Section */}
          <ParallaxSection ref={parallaxRef} />
          {/* Cinema Experience */}
          <CinemaExperience ref={experienceRef} />
          {/* FAQ Section */}
          <FAQ ref={faqRef} />
          {/* Button Thử ngay */}
          <div className="mt-8">
            <Magnet
              padding={50}
              disabled={false}
              magnetStrength={3}
              activeTransition="transform 0.2s ease-out"
              inactiveTransition="transform 0.4s ease-in-out"
            >
              <Button
                onClick={() => navigate(ROUTES.MOVIES_SELECTION)}
                className="transform rounded-lg bg-gradient-to-r from-amber-700 to-orange-800 px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-amber-800 hover:to-orange-900"
              >
                Đặt phim ngay
              </Button>{" "}
            </Magnet>
          </div>
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
      </ClickSpark>
    </UserLayout>
  );
};

export default HomePage;
