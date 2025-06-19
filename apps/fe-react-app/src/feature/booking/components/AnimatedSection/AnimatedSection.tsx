import { forwardRef, type ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const AnimatedSection = forwardRef<HTMLElement, AnimatedSectionProps>(
  ({ children, className = "", id }, ref) => {
    return (
      <section ref={ref} className={className} id={id}>
        {children}
      </section>
    );
  }
);

AnimatedSection.displayName = "AnimatedSection";
