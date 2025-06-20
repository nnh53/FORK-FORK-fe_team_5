import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

interface UseHeaderAnimationOptions {
  headerSelector?: string;
  logoSelector?: string;
  navLinkSelector?: string;
  scrolledHeight?: string;
}

export const useHeaderAnimation = (options: UseHeaderAnimationOptions = {}) => {
  const { headerSelector = ".header-test", logoSelector = ".logo", navLinkSelector = ".nav-link", scrolledHeight = "120px" } = options;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Animation for header on scroll
    const headerAnim = gsap.timeline({
      scrollTrigger: {
        start: "top top",
        end: "+=100",
        scrub: true,
        onUpdate: (self) => {
          if (self.progress > 0) {
            setScrolled(true);
          } else {
            setScrolled(false);
          }
        },
      },
    });

    headerAnim.to(headerSelector, {
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      boxShadow: "0 5px 20px rgba(0, 0, 0, 0.3)",
      height: scrolledHeight,
      duration: 0.5,
    });

    // Logo animation
    gsap.fromTo(logoSelector, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, delay: 0.5 });

    // Menu items animation
    gsap.fromTo(navLinkSelector, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.7 });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [headerSelector, logoSelector, navLinkSelector, scrolledHeight]);

  return { scrolled };
};

