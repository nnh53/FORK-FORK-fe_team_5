import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

interface UseHeaderAnimationOptions {
  logoSelector?: string;
  navLinkSelector?: string;
}

export const useHeaderAnimation = (options: UseHeaderAnimationOptions = {}) => {
  const { logoSelector = ".logo", navLinkSelector = ".nav-link" } = options;

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const scrollTrigger = ScrollTrigger.create({
      start: "top top",
      end: "+=100",
      onUpdate: (self) => {
        if (self.progress > 0) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      },
    });

    gsap.fromTo(logoSelector, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, delay: 0.5 });

    gsap.fromTo(navLinkSelector, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.7 }); // Cleanup function
    return () => {
      scrollTrigger.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [logoSelector, navLinkSelector]);

  return { scrolled };
};
