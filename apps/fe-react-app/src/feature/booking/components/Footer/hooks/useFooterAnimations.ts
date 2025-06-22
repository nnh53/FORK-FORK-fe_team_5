import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export const useFooterAnimations = () => {
  const footerRef = useRef<HTMLElement | null>(null);
  const flowingMenuRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Main footer animation
    if (footerRef.current) {
      gsap.fromTo(
        footerRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Animate footer columns
    gsap.fromTo(
      ".footer-column",
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
      },
    );

    // Animate social links
    gsap.fromTo(
      ".social-icon",
      {
        scale: 0,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        delay: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom-=50",
          toggleActions: "play none none none",
        },
      },
    );

    // Animate FlowingMenu
    if (flowingMenuRef.current) {
      gsap.fromTo(
        flowingMenuRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1,
          delay: 0.5,
          scrollTrigger: {
            trigger: flowingMenuRef.current,
            start: "top bottom",
            toggleActions: "play none none none",
          },
        },
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return {
    footerRef,
    flowingMenuRef,
  };
};
