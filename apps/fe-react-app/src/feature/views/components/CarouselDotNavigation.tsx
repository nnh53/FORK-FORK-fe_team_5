import { useMediaQuery } from "@/hooks/use-media-query";

interface CarouselDotNavigationProps {
  totalMovies: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}

const CarouselDotNavigation = ({ totalMovies, currentIndex, onDotClick }: CarouselDotNavigationProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Don't render on mobile
  if (isMobile) return null;

  return (
    <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 transform">
      <div className="flex gap-3">
        {Array.from({ length: totalMovies }).map((_, i) => (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            className={`size-3 rounded-full transition-all duration-300 hover:scale-125 cursor-none ${
              i === currentIndex ? "bg-white shadow-lg" : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselDotNavigation;
