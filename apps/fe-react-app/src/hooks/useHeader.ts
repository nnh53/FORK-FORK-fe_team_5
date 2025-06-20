import { useState } from "react";
import { useHeaderAnimation } from "./useHeaderAnimation";
import { useScrollVelocity } from "./useScrollVelocity";

interface UseHeaderOptions {
  // Header animation options
  logoSelector?: string;
  navLinkSelector?: string;

  // ScrollVelocity options
  scrollVelocityConfig?: {
    defaultVelocity?: number;
    texts?: string[];
    className?: string;
    numCopies?: number;
    parallaxClassName?: string;
    scrollerClassName?: string;
  };
}

export const useHeader = (options: UseHeaderOptions = {}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logoSelector = ".logo", navLinkSelector = ".nav-link", scrollVelocityConfig = {} } = options;
  // Use header animation hook
  const { scrolled } = useHeaderAnimation({
    logoSelector,
    navLinkSelector,
  });

  // Use scroll velocity hook
  const { scrollVelocityProps } = useScrollVelocity({
    defaultVelocity: 100,
    texts: ["F CINEMA"],
    className: "text-2xl font-bold text-white",
    numCopies: 10,
    parallaxClassName: "parallax w-full overflow-hidden whitespace-nowrap",
    scrollerClassName: "scroller flex",
    ...scrollVelocityConfig,
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return {
    isMenuOpen,
    setIsMenuOpen,
    toggleMenu,
    scrolled,
    scrollVelocityProps,
  };
};
