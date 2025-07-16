import { animated, useTransition } from "@react-spring/web";
import React, { useState } from "react";

interface BannerTransitionProps {
  slides?: string[];
  children?: React.ReactNode;
}

const DEFAULT_SLIDES = [
  "photo-1524985069026-dd778a71c7b4",
  "photo-1489599849927-2ee91cede3ba",
  "photo-1536440136628-1c6cb5a2a869",
  "photo-1542204637-e9f12f144cca",
];

const BannerTransition: React.FC<BannerTransitionProps> = ({ slides = DEFAULT_SLIDES, children }) => {
  const [index, setIndex] = useState(0);

  const transitions = useTransition(index, {
    key: index,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 3000 },
    onRest: (_a, _b, item) => {
      if (index === item) {
        setIndex((state) => (state + 1) % slides.length);
      }
    },
    exitBeforeEnter: true,
  });

  return (
    <div className="relative flex h-full w-full flex-col justify-center overflow-hidden bg-red-700 p-6 text-white md:p-12">
      {transitions((style, i) => (
        <animated.div
          key={i}
          style={{
            ...style,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(https://images.unsplash.com/${slides[i]}?w=1920&q=80&auto=format&fit=crop)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BannerTransition;
