import React, { useEffect, useRef, useState } from "react";
import MovieCard, { type MovieCardProps } from "./MovieCard.tsx";

export interface MovieListProps {
  movies: MovieCardProps[];
  cardsPerRow?: 2 | 3 | 4 | 5 | 6;
  onMovieBuyTicketClick?: (movie: MovieCardProps) => void;
  onTitleClick?: (movie: MovieCardProps) => void;
  onPosterClick?: (movie: MovieCardProps) => void;
  horizontal?: boolean;
  showScrollButtons?: boolean;
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  cardsPerRow = 4,
  onMovieBuyTicketClick,
  onPosterClick,
  onTitleClick,
  horizontal = true,
  showScrollButtons = true,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const gridLayoutConfig = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
  };

  const responsiveClasses = gridLayoutConfig[cardsPerRow] || gridLayoutConfig[4];

  // Scroll button functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Check scroll position to show/hide buttons
  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Handle scroll event
  const handleScroll = () => {
    checkScrollPosition();
  };

  // Check initial scroll position
  useEffect(() => {
    checkScrollPosition();
  }, [movies]);

  // Handle mouse drag scrolling
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = scrollRef.current;
    if (!slider) return;

    let isDown = true;
    const startX = e.pageX - slider.offsetLeft;
    const scrollLeft = slider.scrollLeft;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      slider.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      isDown = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      slider.style.cursor = "grab";
    };

    slider.style.cursor = "grabbing";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  if (!movies || movies.length === 0) {
    return <p className="p-4 text-center text-gray-500">Không có phim nào để hiển thị.</p>;
  }

  if (horizontal) {
    return (
      <div className="relative mx-auto w-full">
        {/* Left Scroll Button */}
        {showScrollButtons && showLeftButton && (
          <button
            onClick={scrollLeft}
            className="absolute top-1/2 left-2 z-10 hidden h-12 w-12 -translate-y-1/2 transform items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-black/90 lg:flex"
            aria-label="Scroll left"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Scroll Button */}
        {showScrollButtons && showRightButton && (
          <button
            onClick={scrollRight}
            className="absolute top-1/2 right-2 z-10 hidden h-12 w-12 -translate-y-1/2 transform items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-black/90 lg:flex"
            aria-label="Scroll right"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Vùng cuộn phim với click and drag */}
        <div
          ref={scrollRef}
          className="scrollbar-hide flex cursor-grab snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-6 py-4 select-none sm:gap-4 sm:px-8 sm:py-6 md:gap-6 lg:px-12"
          onMouseDown={handleMouseDown}
          onScroll={handleScroll}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="inline-flex w-36 flex-none snap-start sm:w-48 md:w-56 lg:w-64 xl:w-72">
              <MovieCard
                {...movie}
                onBuyTicketClick={() => onMovieBuyTicketClick?.(movie)}
                onPosterClick={() => onPosterClick?.(movie)}
                onTitleClick={() => onTitleClick?.(movie)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Grid mode
  return (
    <div className={`grid ${responsiveClasses} mx-auto max-w-7xl justify-items-center gap-4 p-6 sm:gap-6 sm:p-6 lg:gap-8 lg:p-8`}>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          {...movie}
          onBuyTicketClick={() => onMovieBuyTicketClick?.(movie)}
          onPosterClick={() => onPosterClick?.(movie)}
          onTitleClick={() => onTitleClick?.(movie)}
        />
      ))}
    </div>
  );
};

export default MovieList;
