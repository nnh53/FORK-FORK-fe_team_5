import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, type RefObject } from "react";
import { useSmoothScroll } from "./useSmoothScroll";

gsap.registerPlugin(ScrollTrigger);

interface AnimationRefs {
  cardSwapRef: RefObject<HTMLElement | null>;
  experienceRef?: RefObject<HTMLElement | null>;
  faqRef: RefObject<HTMLElement | null>;
}

export const useHomePageAnimations = (refs: AnimationRefs) => {
  const { cardSwapRef, experienceRef, faqRef } = refs;
  useSmoothScroll();

  useEffect(() => {
    // Card Swap section animation
    gsap.fromTo(
      ".card-swap-section",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardSwapRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    );

    gsap.utils.toArray<HTMLElement>(".panel").forEach((panel) => {
      ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        pin: true,
        pinSpacing: false,
        markers: false,
      });
    });

    gsap.fromTo(
      ".faq-title",
      {
        x: 100,
        opacity: 0,
        scale: 0.5,
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "elastic.out(1, 0.3)",
        scrollTrigger: {
          trigger: faqRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [cardSwapRef, experienceRef, faqRef]);
};
