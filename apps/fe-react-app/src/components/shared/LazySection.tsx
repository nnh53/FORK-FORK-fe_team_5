import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Suspense, type ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
  minHeight?: string;
  loadingTitle?: string;
}

// Default loading skeleton
const DefaultSkeleton = ({ height = "400px", title = "Content" }: { height?: string; title?: string }) => (
  <div className="flex animate-pulse items-center justify-center bg-gray-900/50" style={{ minHeight: height }}>
    <div className="text-center">
      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      <p className="text-lg text-white">Loading {title}...</p>
    </div>
  </div>
);

export const LazySection = ({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = "100px",
  triggerOnce = true,
  className,
  minHeight = "400px",
  loadingTitle = "Content",
}: LazySectionProps) => {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce,
  });

  const defaultFallback = fallback || <DefaultSkeleton height={minHeight} title={loadingTitle} />;

  return (
    <div ref={elementRef} className={className}>
      {isIntersecting ? <Suspense fallback={defaultFallback}>{children}</Suspense> : defaultFallback}
    </div>
  );
};

export default LazySection;
