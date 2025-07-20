import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
}

interface UseIntersectionObserverReturn {
  elementRef: React.RefObject<HTMLDivElement | null>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = "0px",
  root = null,
  triggerOnce = true,
}: UseIntersectionObserverOptions = {}): UseIntersectionObserverReturn => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting;

        setEntry(entry);

        if (isCurrentlyIntersecting) {
          setIsIntersecting(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      {
        threshold,
        rootMargin,
        root,
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [threshold, rootMargin, root, triggerOnce]);

  // If triggerOnce is true and has already triggered, keep isIntersecting as true
  const finalIsIntersecting = triggerOnce && hasTriggered ? true : isIntersecting;

  return {
    elementRef,
    isIntersecting: finalIsIntersecting,
    entry,
  };
};
