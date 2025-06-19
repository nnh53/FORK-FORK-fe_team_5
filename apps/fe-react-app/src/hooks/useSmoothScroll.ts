import { useEffect } from "react";


//Custom hook for scroll effect
export const useSmoothScroll = () => {
  useEffect(() => {
    let animationFrameId: number;

    const smoothScroll = () => {
      const currentScroll = window.pageYOffset;
      document.body.style.setProperty("--scroll", currentScroll.toString());
      animationFrameId = requestAnimationFrame(smoothScroll);
    };

    // Start the animation loop
    animationFrameId = requestAnimationFrame(smoothScroll);

    return () => {
      // Clean up animation frame on unmount
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);
};
