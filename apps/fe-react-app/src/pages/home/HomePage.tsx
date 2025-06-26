import ClickSpark from "@/components/Reactbits/reactbit-animations/ClickSpark/ClickSpark";
import CarouselSection from "@/feature/views/CarouselSection/CarouselSection";
import { recentMoviesData } from "@/feature/views/CarouselSection/data/movies.data";
import CinemaExperience from "@/feature/views/CinemaExperience";
import { FAQ } from "@/feature/views/FAQ";
import HeroSection from "@/feature/views/HeroSection/HeroSection";
import NowShowing from "@/feature/views/NowShowing/NowShowing";
import TrendingSection from "@/feature/views/TrendingSection/TrendingSection";
import { useHomePageAnimations } from "@/hooks/useHomePageAnimations";
import UserLayout from "@/layouts/user/UserLayout";
import { useRef } from "react";
import "./styles/HomePage.css";

const HomePage = () => {
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
