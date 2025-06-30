import ClickSpark from "@/components/Reactbits/reactbit-animations/ClickSpark/ClickSpark";
import ScrollFloat from "@/components/Reactbits/reactbit-animations/ScrollFloat/ScrollFloat";
import ScrollReveal from "@/components/Reactbits/reactbit-animations/ScrollReveal/ScrollReveal";
import { Button } from "@/components/Shadcn/ui/button";
import CarouselSection from "@/feature/views/CarouselSection/CarouselSection";
import { recentMoviesData } from "@/feature/views/CarouselSection/data/movies.data";
import CinemaExperience from "@/feature/views/CinemaExperience";
import { FAQ } from "@/feature/views/FAQ";
import WelcomePanel from "@/feature/views/HeroSection/components/WelcomePanel";
import NowShowing from "@/feature/views/NowShowing/NowShowing";
import TrendingSection from "@/feature/views/TrendingSection/TrendingSection";
import { useHomePageAnimations } from "@/hooks/useHomePageAnimations";
import UserLayout from "@/layouts/user/UserLayout";
import { ROUTES } from "@/routes/route.constants";
import { clearAuthData } from "@/utils/auth.utils";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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

  //Animation using hooks
  useHomePageAnimations({
    heroRef,
    carouselRef,
    cardSwapRef,
    featuredMoviesRef,
    experienceRef,
    faqRef,
    parallaxRef,
  });

  const handleLogout = () => {
    // Clear auth data from localStorage
    clearAuthData();

    // Show success message
    toast.success("Đăng xuất thành công!");

    // Redirect to login page
    navigate(ROUTES.AUTH.LOGIN || "/login");
  };

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
                  <Button
                    onClick={() => navigate(ROUTES.MOVIES_SELECTION)}
                    className="bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-800 hover:to-orange-900 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Đặt phim ngay
                  </Button>
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
          <section className="parallax-section" ref={parallaxRef}>
            <div className="parallax-layer" data-depth="0.1"></div>
            <div className="parallax-layer" data-depth="0.2"></div>
            <div className="parallax-layer" data-depth="0.3"></div>{" "}
            <div className="parallax-content">
              <h2
                style={{
                  background: "linear-gradient(to right, #946b38, #392819)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  fontWeight: "800",
                }}
              >
                The Ultimate Movie Experience
              </h2>
              <p>Feel the magic of cinema</p>

              {/* Logout Button */}
              <div className="mt-6">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Đăng Xuất
                </Button>
              </div>
            </div>{" "}
          </section>
          {/* Cinema Experience */}
          <CinemaExperience ref={experienceRef} />
          {/* FAQ Section */}
          <FAQ ref={faqRef} />
          {/* Footer */}
          <div className="h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold">End of ScrollFloat Tests</h2>
              <p className="text-lg mt-4">Scroll back up để xem lại các hiệu ứng</p>
            </div>
          </div>
        </div>
      </ClickSpark>
    </UserLayout>
  );
};

export default HomePage;
