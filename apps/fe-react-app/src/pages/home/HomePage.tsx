import ClickSpark from "@/components/Reactbits/reactbit-animations/ClickSpark/ClickSpark";
import LazySection from "@/components/shared/LazySection";
import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./styles/HomePage.css";

// Light components can be imported normally
import { FAQ } from "@/feature/views/sections";
import AdminTeamSection from "@/feature/views/sections/AdminTeamSection";
import CinemaExperience from "@/feature/views/sections/CinemaExperience";
import { CTASection } from "@/feature/views/sections/cta-section";
import { FeatureSection } from "@/feature/views/sections/feature-section";
import { HeroSection } from "@/feature/views/sections/hero-section";

// Lazy load heavy components
const CarouselSection = lazy(() => import("@/feature/views/sections/CarouselSection"));
const MovieSelection = lazy(() => import("../store/MovieSelection"));
const SpotlightSection = lazy(() => import("@/feature/views/sections/SpotlightSection"));
const TrendingSection = lazy(() => import("@/feature/views/sections/TrendingSection"));

// Loading component for hero section
const HeroSkeleton = () => (
  <div className="flex animate-pulse items-center justify-center bg-gray-900/50" style={{ minHeight: "500px" }}>
    <div className="text-center">
      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      <p className="text-lg text-white">Loading Hero Carousel...</p>
    </div>
  </div>
);

const HomePage = () => {
  const location = useLocation();

  // Handle scrolling to section when navigated from other pages
  useEffect(() => {
    const scrollToSection = location.state?.scrollToSection;
    if (scrollToSection) {
      // Use setTimeout to ensure DOM is ready and sections are rendered
      const timer = setTimeout(() => {
        const element = document.getElementById(scrollToSection);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 500); // Increased timeout to ensure lazy-loaded sections are ready

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div>
      <ClickSpark sparkColor="#8B4513" sparkSize={20} sparkRadius={40} sparkCount={8} duration={400}>
        <div className="home-page">
          <HeroSection />
          {/* CarouselSection - Load immediately as it's above the fold */}
          <Suspense fallback={<HeroSkeleton />}>
            <CarouselSection />
          </Suspense>
          {/* MovieSelection - Load when in viewport */}
          <section id="movies">
            <LazySection threshold={0.1} rootMargin="200px" minHeight="600px" loadingTitle="Movie Selection">
              <MovieSelection />
            </LazySection>
          </section>
          {/* SpotlightSection - Load when in viewport */}
          <LazySection threshold={0.1} rootMargin="150px" minHeight="500px" loadingTitle="Spotlight Movies">
            <SpotlightSection />
          </LazySection>
          {/* TrendingSection - Load when in viewport
          <LazySection threshold={0.1} rootMargin="150px" minHeight="600px" loadingTitle="Trending Movies"> */}
          <TrendingSection />
          {/* Light sections - can load normally */}
          <FeatureSection />
          <CinemaExperience />
          <FAQ />
          <AdminTeamSection />
        </div>
        <CTASection />
      </ClickSpark>
    </div>
  );
};

export default HomePage;
