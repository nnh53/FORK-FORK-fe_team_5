import ClickSpark from "@/components/Reactbits/reactbit-animations/ClickSpark/ClickSpark";
import AdminTeamSection from "@/feature/views/AdminTeamSection";
import CarouselSection from "@/feature/views/CarouselSection/CarouselSection";
import CinemaExperience from "@/feature/views/CinemaExperience";
import { FAQ } from "@/feature/views/FAQ";
import SpotlightSection from "@/feature/views/SpotlightSection";
import { useHomePageAnimations } from "@/hooks/useHomePageAnimations";

import { CTASection } from "@/components/magicui/sections/cta-section";
import { FeatureSection } from "@/components/magicui/sections/feature-section";
import TrendingSection from "@/feature/views/TrendingSection";
import { useRef } from "react";
import MovieSelection from "../store/MovieSelection";
import "./styles/HomePage.css";

const HomePage = () => {
  const cardSwapRef = useRef<HTMLElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  const faqRef = useRef<HTMLElement | null>(null);

  useHomePageAnimations({
    cardSwapRef,
    experienceRef,
    faqRef,
  });

  return (
    <div>
      <ClickSpark sparkColor="#8B4513" sparkSize={20} sparkRadius={40} sparkCount={8} duration={400}>
        <div className="home-page">
          <section id="home">
            <CarouselSection />
          </section>
          <section id="movies">
            <MovieSelection />
          </section>
          <TrendingSection />
          <section id="spotlight">
            <SpotlightSection ref={cardSwapRef} />
          </section>
          <FeatureSection />
          <section id="chairs">
            <CinemaExperience ref={experienceRef} />
          </section>
          <section id="faq">
            <FAQ ref={faqRef} />
          </section>
          <AdminTeamSection />
        </div>
        <CTASection />
      </ClickSpark>
    </div>
  );
};

export default HomePage;
