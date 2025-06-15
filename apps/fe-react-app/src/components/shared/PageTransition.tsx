import { useAutoAnimate } from "@formkit/auto-animate/react";
import React, { type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [parent] = useAutoAnimate();
  return <div ref={parent}>{children}</div>;
};

export default PageTransition;
