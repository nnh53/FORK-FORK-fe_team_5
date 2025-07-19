import ClickSpark from "@/components/Reactbits/reactbit-animations/ClickSpark/ClickSpark";
import AdminTeamSection from "@/feature/views/sections/AdminTeamSection";
import CarouselSection from "@/feature/views/sections/CarouselSection";
import SpotlightSection from "@/feature/views/sections/SpotlightSection";

import { FAQ } from "@/feature/views/sections";
import CinemaExperience from "@/feature/views/sections/CinemaExperience";
import { CTASection } from "@/feature/views/sections/cta-section";
import { FeatureSection } from "@/feature/views/sections/feature-section";
import TrendingSection from "@/feature/views/sections/TrendingSection";
import MovieSelection from "../store/MovieSelection";
import "./styles/HomePage.css";

const HomePage = () => {
  return (
    <div>
      <ClickSpark sparkColor="#8B4513" sparkSize={20} sparkRadius={40} sparkCount={8} duration={400}>
        <div className="home-page">
          <CarouselSection />
          <section id="movies">
            <MovieSelection />
          </section>
          <section id="spotlight">
            <SpotlightSection />
          </section>
          <TrendingSection />
          <FeatureSection />
          <CinemaExperience />
          <section id="faq">
            <FAQ />
          </section>
          <AdminTeamSection />
        </div>
        <CTASection />
      </ClickSpark>
    </div>
  );
};

export default HomePage;
