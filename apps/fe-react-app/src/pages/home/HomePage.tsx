import ClickSpark from "@/components/Reactbits/reactbit-animations/ClickSpark/ClickSpark";
import { recentMoviesData } from "@/feature/views/CarouselSection/data/movies.data";
import { useRef } from "react";
import CarouselSection from "@/feature/views/CarouselSection/CarouselSection";
import HeroSection from "@/feature/views/HeroSection/HeroSection";
import CinemaExperience from "@/feature/views/CinemaExperience";
import { FAQ } from "@/feature/views/FAQ";
import NowShowing from "@/feature/views/NowShowing/NowShowing";
import UserLayout from "@/layouts/user/UserLayout";
import { useHomePageAnimations } from "@/hooks/useHomePageAnimations";
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
          {/* Card Swap Section */}
          <section className="card-swap-section" ref={cardSwapRef} id="trending-movies">
            <div className="section-title">
              <h2
                style={{
                  background: "linear-gradient(to right, #946b38, #392819)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  fontWeight: "800",
                }}
              >
                Trending Movies
              </h2>
              <div
                className="section-line"
                style={{
                  background: "linear-gradient(to right, #946b38, #392819)",
                  height: "3px",
                }}
              ></div>
            </div>

            <div
              className="trending-content"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "4rem",
                maxWidth: "1400px",
                margin: "0 auto",
                padding: "2rem 1rem",
              }}
            >
              {/* Left Side - Text Content */}
              <div
                className="trending-text"
                style={{
                  flex: "1",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "2rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    marginBottom: "1.5rem",
                    background: "linear-gradient(to right, #946b38, #392819)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    lineHeight: "1.2",
                  }}
                >
                  Elevate your viewing.
                </h3>
                <p
                  style={{
                    fontSize: "1.2rem",
                    color: "#666",
                    lineHeight: "1.6",
                    marginBottom: "2rem",
                  }}
                >
                  Explosive emotions, exclusively on the grand screen
                </p>
                <button
                  style={{
                    backgroundColor: "#946b38",
                    color: "white",
                    padding: "1rem 2rem",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    alignSelf: "flex-start",
                    transition: "all 0.3s ease",
                  }}
                >
                  Explore More
                </button>
              </div>

              {/* Right Side - CardSwap */}
              <div
                className="card-swap-wrapper"
                style={{
                  flex: "1",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></div>
            </div>
          </section>{" "}
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
