import { animated, useSpring } from "@react-spring/web";
import React from "react";

interface AnimatedButtonProps {
  text?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  text,
  onClick,
  type = "button",
  icon,
  className,
  disabled = false,
  loading = false,
  loadingText = "Loading...",
}) => {
  const animationProps = useSpring({
    from: {
      transform: "scale(1)",
      opacity: disabled || loading ? 0.5 : 1,
    },
    to: async (next) => {
      if (disabled || loading) {
        await next({
          transform: "scale(1)",
          opacity: 0.5,
        });
      } else {
        while (true) {
          await next({
            transform: "scale(1.05)",
            opacity: 1,
          });
          await next({
            transform: "scale(1)",
            opacity: 1,
          });
        }
      }
    },
    config: {
      tension: 300,
      friction: 10,
    },
    loop: disabled || loading ? false : { reverse: true },
  });

  return (
    <animated.button
      style={animationProps}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      className={`transition-all duration-300 ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {loading ? loadingText : text}
    </animated.button>
  );
};

export default AnimatedButton;

