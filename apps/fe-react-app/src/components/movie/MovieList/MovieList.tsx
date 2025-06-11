import React from 'react';
import MovieCard, { type MovieCardProps } from '../MovieCard/MovieCard.tsx';

export interface MovieListProps {
  movies: MovieCardProps[];
  cardsPerRow?: 2 | 3 | 4 | 5 | 6; // THÊM MỚI: Prop để xử lý sự kiện click nút mua vé
  onMovieBuyTicketClick?: (movie: MovieCardProps) => void;
}

const MovieList: React.FC<MovieListProps> = ({ movies, cardsPerRow = 4, onMovieBuyTicketClick }) => {
  const gridLayoutConfig = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  };

  const responsiveClasses = gridLayoutConfig[cardsPerRow] || gridLayoutConfig[4];
  const gridContainerClasses = `grid ${responsiveClasses} gap-8 justify-items-center p-4 max-w-7xl mx-auto`;

  if (!movies || movies.length === 0) {
    return <p className="p-4 text-center text-gray-500">Không có phim nào để hiển thị.</p>;
  }

  return (
    <div className={gridContainerClasses}>
      {' '}
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          {...movie} // CẬP NHẬT: Gán sự kiện click vào prop của MovieCard // Khi nút "Mua vé" trong card được click, nó sẽ gọi hàm onMovieBuyTicketClick // và truyền toàn bộ thông tin của phim đó lên.
          onBuyTicketClick={() => onMovieBuyTicketClick?.(movie)}
        />
      ))}{' '}
    </div>
  );
};

export default MovieList;
