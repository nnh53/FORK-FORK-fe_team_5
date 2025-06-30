import ScrollFloat from "@/components/Reactbits/reactbit-animations/ScrollFloat/ScrollFloat";
import ScrollReveal from "@/components/Reactbits/reactbit-animations/ScrollReveal/ScrollReveal";
import TestNavigation from "@/components/shared/TestNavigation";
import CarouselSection from "@/feature/views/CarouselSection/CarouselSection";
import { recentMoviesData } from "@/feature/views/CarouselSection/data/movies.data";
import WelcomePanel from "@/feature/views/HeroSection/components/WelcomePanel";
import NowShowing from "@/feature/views/NowShowing/NowShowing";
import TrendingSection from "@/feature/views/TrendingSection/TrendingSection";
import UserLayout from "@/layouts/user/UserLayout";
import { useRef } from "react";

const ScrollFloatTest = () => {
  const carouselRef = useRef<HTMLElement | null>(null);
  const cardSwapRef = useRef<HTMLElement | null>(null);
  const featuredMoviesRef = useRef<HTMLElement | null>(null);

  return (
    <UserLayout>
      <TestNavigation />
      <div className="min-h-screen">
        {/* Header Section */}
        <div className="h-screen flex items-center justify-center">
          <div className="text-center space-y-8">
            <WelcomePanel />
            <div>
              <h1 className="text-4xl font-bold mb-4">ScrollFloat Component Test</h1>
              <p className="text-lg">Scroll down để xem hiệu ứng ScrollFloat</p>
            </div>
          </div>
        </div>

        {/* Test Section 1 - Usage mẫu */}
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-8">Test 1: Usage mẫu</h2>
            <ScrollFloat animationDuration={1} ease="back.inOut(2)" scrollStart="center bottom+=50%" scrollEnd="bottom bottom-=40%" stagger={0.03}>
              reactbits
            </ScrollFloat>
          </div>
        </section>

        {/* Spacer */}
        <div className="h-96"></div>

        {/* Test Section 2 - Custom text */}
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-8">Test 2: Custom Text</h2>
            <ScrollFloat
              animationDuration={1.5}
              ease="elastic.out(1, 0.3)"
              scrollStart="top bottom-=10%"
              scrollEnd="bottom top+=10%"
              stagger={0.05}
              containerClassName="text-6xl font-bold"
              textClassName="text-orange-400"
            >
              FCinema Experience
            </ScrollFloat>
          </div>
        </section>

        {/* Spacer */}
        <div className="h-96"></div>

        {/* Test Section 3 - Multiple lines */}
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-2xl font-semibold mb-8">Test 3: Multiple ScrollFloat</h2>

            <ScrollFloat
              animationDuration={0.8}
              ease="power2.out"
              scrollStart="center bottom"
              scrollEnd="center top"
              stagger={0.02}
              containerClassName="text-4xl font-bold"
              textClassName="text-blue-400"
            >
              Welcome to
            </ScrollFloat>

            <ScrollFloat
              animationDuration={1.2}
              ease="bounce.out"
              scrollStart="center bottom+=20%"
              scrollEnd="center top-=20%"
              stagger={0.04}
              containerClassName="text-5xl font-bold"
              textClassName="text-yellow-400"
            >
              Our Cinema
            </ScrollFloat>

            <ScrollFloat
              animationDuration={1}
              ease="back.out(1.7)"
              scrollStart="center bottom+=40%"
              scrollEnd="center top-=40%"
              stagger={0.03}
              containerClassName="text-3xl"
              textClassName="text-green-400"
            >
              Enjoy the Experience
            </ScrollFloat>
          </div>
        </section>

        {/* Spacer */}
        <div className="h-96"></div>

        {/* Test Section 4 - Long text */}
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-8">Test 4: Long Text</h2>
            <ScrollFloat
              animationDuration={2}
              ease="power3.inOut"
              scrollStart="top bottom-=20%"
              scrollEnd="bottom top+=20%"
              stagger={0.01}
              containerClassName="text-3xl font-semibold"
              textClassName="text-purple-400"
            >
              The Ultimate Movie Experience Awaits You
            </ScrollFloat>
          </div>
        </section>

        {/* Spacer */}
        <div className="h-96"></div>

        {/* Test Section 5 - ScrollReveal */}
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-8">Test 5: ScrollReveal Component</h2>

            {/* ScrollReveal Test 1 - Basic */}
            <div className="mb-16">
              <h3 className="text-xl font-medium mb-6">ScrollReveal Basic</h3>
              <ScrollReveal
                enableBlur={true}
                baseOpacity={0.1}
                baseRotation={3}
                blurStrength={4}
                containerClassName="text-4xl font-bold"
                textClassName="text-blue-500"
              >
                Welcome to FCinema Experience
              </ScrollReveal>
            </div>

            {/* ScrollReveal Test 2 - No Blur */}
            <div className="mb-16">
              <h3 className="text-xl font-medium mb-6">ScrollReveal Without Blur</h3>
              <ScrollReveal
                enableBlur={false}
                baseOpacity={0.2}
                baseRotation={5}
                containerClassName="text-3xl font-semibold"
                textClassName="text-green-500"
              >
                Discover the magic of cinema with advanced animations
              </ScrollReveal>
            </div>

            {/* ScrollReveal Test 3 - Custom Settings */}
            <div className="mb-16">
              <h3 className="text-xl font-medium mb-6">ScrollReveal Custom Settings</h3>
              <ScrollReveal
                enableBlur={true}
                baseOpacity={0.05}
                baseRotation={8}
                blurStrength={6}
                rotationEnd="center center"
                wordAnimationEnd="center center"
                containerClassName="text-5xl font-bold"
                textClassName="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
              >
                Ultimate Movie Experience
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Spacer */}
        <div className="h-96"></div>

        {/* Test Section 6 - Sections từ HomePage */}
        {/* New Releases Carousel Section */}
        <CarouselSection ref={carouselRef} movies={recentMoviesData} />
        {/* Trending Movies Section */}
        <TrendingSection ref={cardSwapRef} />
        {/* Featured Movies */}
        <NowShowing ref={featuredMoviesRef} />

        {/* Footer */}
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold">End of ScrollFloat Tests</h2>
            <p className="text-lg mt-4">Scroll back up để xem lại các hiệu ứng</p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ScrollFloatTest;
