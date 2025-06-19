import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, type RefObject } from "react";
import { useSmoothScroll } from "./useSmoothScroll";

gsap.registerPlugin(ScrollTrigger);

interface AnimationRefs {
  heroRef: RefObject<HTMLElement | null>;
  carouselRef: RefObject<HTMLElement | null>;
  cardSwapRef: RefObject<HTMLElement | null>;
  featuredMoviesRef: RefObject<HTMLElement | null>;
  experienceRef: RefObject<HTMLElement | null>;
  faqRef: RefObject<HTMLElement | null>;
  parallaxRef: RefObject<HTMLElement | null>;
}

export const useHomePageAnimations = (refs: AnimationRefs) => {
  const { heroRef, carouselRef, cardSwapRef, featuredMoviesRef, experienceRef, faqRef, parallaxRef } = refs;

  // Use smooth scroll hook
  useSmoothScroll();

  useEffect(() => {
    // Hero section parallax and text animation
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    heroTl
      .to(".hero-bg", { yPercent: 50, ease: "none" })
      .to(".hero-content h1", { yPercent: -50, opacity: 0.5 }, 0)
      .to(".hero-content p", { yPercent: -30, opacity: 0.5 }, 0);

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

    // Create a floating badge
    gsap.to(".hot-badge", {
      y: -15,
      rotation: 5,
      duration: 2,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });

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

    // Featured movies animation with staggering
    gsap.fromTo(
      ".movie-card",
      {
        y: 100,
        opacity: 0,
        scale: 0.8,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: featuredMoviesRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    );

    // Now showing text animation
    gsap.fromTo(
      ".now-showing-title",
      {
        x: -100,
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
          trigger: featuredMoviesRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      },
    );

    // Experience section parallax
    const experienceTl = gsap.timeline({
      scrollTrigger: {
        trigger: experienceRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      },
    });

    experienceTl.fromTo(".experience-image", { y: 100 }, { y: -100 }).fromTo(".experience-text", { y: 50 }, { y: -50 }, "<");

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
  }, [heroRef, carouselRef, cardSwapRef, featuredMoviesRef, experienceRef, faqRef, parallaxRef]);
};
