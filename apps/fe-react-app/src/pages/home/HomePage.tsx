import ClickSpark from "@/components/Reactbits/reactbit-animations/ClickSpark/ClickSpark";
import Magnet from "@/components/Reactbits/reactbit-animations/Magnet/Magnet";
import ScrollFloat from "@/components/Reactbits/reactbit-animations/ScrollFloat/ScrollFloat";
import ScrollReveal from "@/components/Reactbits/reactbit-animations/ScrollReveal/ScrollReveal";
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
        <div className="test-home-page">
          {/* Header Section */}
          <div className="h-screen flex items-center justify-center">
            <div className="text-center space-y-8">
              <WelcomePanel />
              <div>
                <p className="text-lg">Scroll xuống</p>
              </div>
            </div>
          </div>
          {/* Hero Section with ScrollFloat */}
          <section className="py-20 px-8">
            <div className="max-w-6xl mx-auto text-center">
              <ScrollFloat
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.03}
                containerClassName="text-base font-medium whitespace-nowrap"
              >
                Modern Theater
              </ScrollFloat>
            </div>
          </section>

          {/* Spacer */}
          <div className="h-96"></div>

          {/* Multiple lines */}
          <section className="py-20 px-8">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <ScrollFloat
                animationDuration={0.8}
                ease="power2.out"
                scrollStart="center bottom"
                scrollEnd="center top"
                stagger={0.02}
                containerClassName="text-4xl font-bold"
                textClassName="text-blue-00"
              >
                The Best
              </ScrollFloat>

              <ScrollFloat
                animationDuration={0.8}
                ease="power2.out"
                scrollStart="center bottom+=20%"
                scrollEnd="center top-=20%"
                stagger={0.02}
                containerClassName="text-5xl font-bold"
                textClassName="text-yellow-00"
              >
                Facilities
              </ScrollFloat>
            </div>
          </section>
          <div className="h-96"></div>
          <section className="py-20 px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-16">
                <ScrollReveal enableBlur={true} baseOpacity={0.1} baseRotation={3} blurStrength={4} containerClassName="text-4xl font-bold">
                  Trải nghiệm những dịch vụ sang trọng
                </ScrollReveal>
              </div>
              {/* ScrollReveal Test 2 - No Blur */}
              <div className="mb-16">
                <ScrollReveal enableBlur={false} baseOpacity={0.2} baseRotation={5} containerClassName="text-3xl font-semibold">
                  Cơ sở vật chất hiện đại
                </ScrollReveal>
              </div>

              {/* ScrollReveal Test 3 - Custom Settings */}
              <div className="mb-16">
                <h3 className="text-xl font-medium mb-6">Cùng với</h3>
                <ScrollReveal
                  enableBlur={true}
                  baseOpacity={0.05}
                  baseRotation={8}
                  blurStrength={6}
                  rotationEnd="center center"
                  wordAnimationEnd="center center"
                  containerClassName="text-5xl font-bold"
                >
                  Phòng Chiếu Chuẩn Quốc Tế
                </ScrollReveal>

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
                      className="bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-800 hover:to-orange-900 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Đặt phim ngay
                    </Button>{" "}
                  </Magnet>
                </div>
              </div>
            </div>
          </section>
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
          {/* Admin Team Stack */}
          <div className="h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-8">Đội Ngũ Phát Triển</h2>
              <p className="text-lg mb-12">Các thành viên FCinema</p>

              <div className="flex justify-center items-center w-full">
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
