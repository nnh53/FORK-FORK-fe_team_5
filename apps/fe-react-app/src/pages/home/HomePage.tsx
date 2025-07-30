import ClickSpark from "@/components/Reactbits/reactbit-animations/ClickSpark/ClickSpark";
import LazySection from "@/components/shared/LazySection";
import { lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./styles/HomePage.css";

// Light components can be imported normally
import { FAQ } from "@/feature/views/sections";
import AdminTeamSection from "@/feature/views/sections/AdminTeamSection";
import CinemaExperience from "@/feature/views/sections/CinemaExperience";
import { CTASection } from "@/feature/views/sections/cta-section";
import { FeatureSection } from "@/feature/views/sections/feature-section";

// Lazy load heavy components
const CarouselSection = lazy(() => import("@/feature/views/sections/CarouselSection"));
const MovieSelection = lazy(() => import("../store/MovieSelection"));
const TrendingSection = lazy(() => import("@/feature/views/sections/TrendingSection"));

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
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div>
      <ClickSpark sparkColor="#e7000b" sparkSize={20} sparkRadius={40} sparkCount={8} duration={400}>
        <div className="home-page">
          <CarouselSection />
          <LazySection threshold={0.1} rootMargin="200px" minHeight="600px" loadingTitle="Movie Selection">
            <MovieSelection />
          </LazySection>
          <LazySection threshold={0.1} rootMargin="100px" minHeight="400px" loadingTitle="Trending Movies">
            <TrendingSection />
          </LazySection>
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
