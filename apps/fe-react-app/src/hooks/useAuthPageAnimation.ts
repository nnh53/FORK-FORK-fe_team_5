import { useSpring } from "@react-spring/web";

interface UseAuthPageAnimationOptions {
  direction?: "left" | "right";
}

// Cinema-related images for background transition
const DEFAULT_SLIDES = [
  "photo-1524985069026-dd778a71c7b4",
  "photo-1489599849927-2ee91cede3ba",
  "photo-1536440136628-1c6cb5a2a869",
  "photo-1542204637-e9f12f144cca",
];

export const useAuthPageAnimation = ({ direction = "right" }: UseAuthPageAnimationOptions = {}) => {
  const pageAnimation = useSpring({
    from: {
      opacity: 0,
      transform: direction === "right" ? "translateX(50px)" : "translateX(-50px)",
    },
    to: {
      opacity: 1,
      transform: "translateX(0px)",
    },
    config: {
      tension: 280,
      friction: 20,
    },
  });

  return {
    pageAnimation,
    slides: DEFAULT_SLIDES,
  };
};
