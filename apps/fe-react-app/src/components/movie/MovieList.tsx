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
      <div className="relative mx-auto w-4/5">
        {/* Vùng cuộn phim với click and drag */}
        <div
          ref={scrollRef}
          className="scrollbar-hide flex cursor-grab select-none snap-x snap-mandatory gap-6 space-x-4 overflow-x-auto scroll-smooth px-12 py-6"
          onMouseDown={handleMouseDown}
          onKeyDown={() => {}} // Empty handler for accessibility
        >
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
