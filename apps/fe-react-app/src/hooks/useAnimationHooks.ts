import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, type RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for section-based scroll animations
 */
export const useSectionAnimations = (
  trigger: RefObject<HTMLElement | null>,
  selector: string,
  animationConfig: {
    from?: gsap.TweenVars;
    to: gsap.TweenVars;
    scrollTrigger?: ScrollTrigger.Vars;
  }
) => {
  useEffect(() => {
    if (!trigger.current) return;

    const defaultScrollTrigger = {
      trigger: trigger.current,
      start: "top 80%",
      toggleActions: "play none none none",
    };

    const animation = gsap.fromTo(
      selector,
      animationConfig.from || {},
      {
        ...animationConfig.to,
        scrollTrigger: {
          ...defaultScrollTrigger,
          ...animationConfig.scrollTrigger,
        },
      }
    );

    return () => {
      animation.kill();
    };
  }, [trigger, selector, animationConfig]);
};

/**
 * Custom hook for timeline-based animations
 */
export const useTimelineAnimation = (
  trigger: RefObject<HTMLElement | null>,
  animationCallback: (tl: gsap.core.Timeline) => void,
  scrollTriggerConfig?: ScrollTrigger.Vars
) => {
  useEffect(() => {
    if (!trigger.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger.current,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
        ...scrollTriggerConfig,
      },
    });

    animationCallback(tl);

    return () => {
      tl.kill();
    };
  }, [trigger, animationCallback, scrollTriggerConfig]);
};
