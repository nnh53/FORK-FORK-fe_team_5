import { Icon } from "@iconify/react";
import React, { useRef } from "react";
import MovieCard, { type MovieCardProps } from "./MovieCard.tsx";

export interface MovieListProps {
  movies: MovieCardProps[];
  cardsPerRow?: 2 | 3 | 4 | 5 | 6;
  onMovieBuyTicketClick?: (movie: MovieCardProps) => void;
  onTitleClick?: (movie: MovieCardProps) => void;
  onPosterClick?: (movie: MovieCardProps) => void;
  horizontal?: boolean;
}

const MovieList: React.FC<MovieListProps> = ({ movies, cardsPerRow = 4, onMovieBuyTicketClick, onPosterClick, onTitleClick, horizontal = true }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const gridLayoutConfig = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
  };

  const responsiveClasses = gridLayoutConfig[cardsPerRow] || gridLayoutConfig[4];

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8; // 80% of container width for smooth partial scroll
      const currentScroll = scrollRef.current.scrollLeft;
      const targetScroll = direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount;

      // Smooth scroll with requestAnimationFrame for better performance
      const startTime = performance.now();
      const duration = 600; // Duration of scroll animation in ms

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress * (2 - progress); // Ease-out quadratic

        scrollRef.current!.scrollLeft = currentScroll + (targetScroll - currentScroll) * ease;

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }
  };

  if (!movies || movies.length === 0) {
    return <p className="p-4 text-center text-gray-500">Không có phim nào để hiển thị.</p>;
  }

  if (horizontal) {
    return (
      <div className="relative mx-auto w-4/5">
        {/* Nút cuộn trái */}
        <button
          onClick={() => handleScroll("left")}
          className="btn btn-circle absolute -left-12 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white"
        >
          <Icon icon="material-symbols-light:arrow-back-ios-new-rounded" width="60" height="60" />
        </button>

        {/* Vùng cuộn phim */}
        <div ref={scrollRef} className="scrollbar-hide flex snap-x snap-mandatory gap-6 space-x-4 overflow-x-auto scroll-smooth px-12 py-6">
          {movies.map((movie) => (
            <div key={movie.id} className="inline-flex flex-none snap-start">
              <MovieCard
                {...movie}
                onBuyTicketClick={() => onMovieBuyTicketClick?.(movie)}
                onPosterClick={() => onPosterClick?.(movie)}
                onTitleClick={() => onTitleClick?.(movie)}
              />
            </div>
          ))}
        </div>

        {/* Nút cuộn phải */}
        <button
          onClick={() => handleScroll("right")}
          className="btn btn-circle absolute -right-4 top-1/2 z-10 -translate-y-1/2 bg-white/80 p-3 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white"
        >
          <Icon icon="material-symbols-light:arrow-forward-ios-rounded" width="60" height="60" />
        </button>
      </div>
    );
  }

  // Grid mode
  return (
    <div className={`grid ${responsiveClasses} mx-auto max-w-7xl justify-items-center gap-8 p-4`}>
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
