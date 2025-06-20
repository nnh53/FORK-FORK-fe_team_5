import { useState } from "react";

interface UseScrollVelocityOptions {
  defaultVelocity?: number;
  texts?: string[];
  className?: string;
  numCopies?: number;
  parallaxClassName?: string;
  scrollerClassName?: string;
}

export const useScrollVelocity = (options: UseScrollVelocityOptions = {}) => {
  const {
    defaultVelocity = 100,
    texts = ["F CINEMA"],
    className = "text-2xl font-bold text-white",
    numCopies = 10,
    parallaxClassName = "parallax w-full overflow-hidden whitespace-nowrap",
    scrollerClassName = "scroller flex",
  } = options;

  const [velocity] = useState(defaultVelocity);

  const scrollVelocityProps = {
    texts,
    velocity,
    className,
    numCopies,
    parallaxClassName,
    scrollerClassName,
  };

  return {
    velocity,
    scrollVelocityProps,
  };
};

