import { animated, useSpring } from '@react-spring/web';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavigateButtonProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const NavigateButton: React.FC<NavigateButtonProps> = ({ to, children, className = '' }) => {
  const navigate = useNavigate();

  // Animation props
  const animationProps = useSpring({
    from: {
      transform: 'scale(1)',
      color: 'rgb(220, 38, 38)',
    },
    to: async (next) => {
      while (true) {
        await next({
          transform: 'scale(1.05)',
          color: 'rgb(239, 68, 68)',
        });
        await next({
          transform: 'scale(1)',
          color: 'rgb(220, 38, 38)',
        });
      }
    },
    config: {
      tension: 300,
      friction: 10,
    },
    loop: { reverse: true },
  });

  const handleClick = () => {
    navigate(to);
  };

  return (
    <animated.button style={animationProps} onClick={handleClick} className={`text-sm text-red-600 hover:underline ${className}`}>
      {children}
    </animated.button>
  );
};

export default NavigateButton;

