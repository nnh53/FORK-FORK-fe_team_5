import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, type RefObject } from "react";
import { useSmoothScroll } from "./useSmoothScroll";

gsap.registerPlugin(ScrollTrigger);

interface AnimationRefs {
  carouselRef: RefObject<HTMLElement | null>;
  cardSwapRef: RefObject<HTMLElement | null>;
  experienceRef: RefObject<HTMLElement | null>;
  faqRef: RefObject<HTMLElement | null>;
  parallaxRef: RefObject<HTMLElement | null>;
}

export const useHomePageAnimations = (refs: AnimationRefs) => {
  const { carouselRef, cardSwapRef, experienceRef, faqRef, parallaxRef } = refs;

  // Use smooth scroll hook
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

    // Create section transitions with pinning
    gsap.utils.toArray<HTMLElement>(".panel").forEach((panel) => {
      ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        pin: true,
        pinSpacing: false,
        markers: false,
      });
    });

    // Add parallax layers
    gsap.utils.toArray<HTMLElement>(".parallax-layer").forEach((layer) => {
      const depth = Number(layer.dataset.depth ?? "0");
      const movement = -(layer.offsetHeight * depth);

      gsap.fromTo(
        layer,
        { y: 0 },
        {
          y: movement,
          ease: "none",
          scrollTrigger: {
            trigger: parallaxRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });

    // FAQ section animation
    gsap.fromTo(
      ".faq-content",
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: faqRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      },
    );

    // FAQ title animation
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
      // Clean up all ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [carouselRef, cardSwapRef, experienceRef, faqRef, parallaxRef]);
};
