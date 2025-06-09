import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
const NavigateButton = ({ text, to, icon, className }: { text?: string; to: string; icon?: React.ReactNode; className?: string }) => {
  const navigate = useNavigate();
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
  return (
    <animated.button style={animationProps} onClick={() => navigate(to)} className={`text-sm text-red-600 hover:underline ${className}`}>
      {icon && <span className="mr-2">{icon}</span>} {/* Render icon if provided */}
      {text}
    </animated.button>
  );
};

export default NavigateButton;
