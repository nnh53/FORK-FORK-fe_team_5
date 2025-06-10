import { animated, useTransition } from '@react-spring/web';
import React, { useState } from 'react';

interface BannerTransitionProps {
  slides: string[];
  children?: React.ReactNode;
}

const BannerTransition: React.FC<BannerTransitionProps> = ({ slides, children }) => {
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
    <div className="w-1/2 bg-red-700 text-white flex flex-col justify-center p-12 relative overflow-hidden">
      {transitions((style, i) => (
        <animated.div
          key={i}
          style={{
            ...style,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(https://images.unsplash.com/${slides[i]}?w=1920&q=80&auto=format&fit=crop)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BannerTransition;
