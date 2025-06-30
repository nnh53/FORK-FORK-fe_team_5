import ClickSpark from "@/components/Reactbits/reactbit-animations/ClickSpark/ClickSpark";
import { Button } from "@/components/Shadcn/ui/button";
import CarouselSection from "@/feature/views/CarouselSection/CarouselSection";
import { recentMoviesData } from "@/feature/views/CarouselSection/data/movies.data";
import CinemaExperience from "@/feature/views/CinemaExperience";
import { FAQ } from "@/feature/views/FAQ";
import HeroSection from "@/feature/views/HeroSection/HeroSection";
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
          {/* Hero Section */}
          <HeroSection ref={heroRef} />
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
              <div className="mt-6 flex gap-4 justify-center">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Đăng Xuất
                </Button>

                {/* ScrollFloat Test Button */}
                <Button
                  onClick={() => navigate(ROUTES.SCROLL_FLOAT)}
                  variant="secondary"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Test ScrollFloat
                </Button>
              </div>
            </div>{" "}
          </section>
          {/* Cinema Experience */}
          <CinemaExperience ref={experienceRef} />
          {/* FAQ Section */}
          <FAQ ref={faqRef} />
        </div>
      </ClickSpark>
    </UserLayout>
  );
};

export default HomePage;
