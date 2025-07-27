import { queryMoviesForTrending } from "@/services/movieService";
import { queryReceiptTopMovies } from "@/services/receipService";
import { Image } from "@unpic/react";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface TrendingMovieWithDetails {
  id: number;
  name: string;
  rank: number;
  ticketCount: number;
  totalRevenue: number;
  poster?: string;
  banner?: string;
  categories?: string[];
  duration?: number;
  fromDate?: string;
}

const TrendingSection = () => {
  const navigate = useNavigate();
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [lastHoveredMovieId, setLastHoveredMovieId] = useState<number | null>(null); // Changed to persist last hovered

  const trendingQuery = queryReceiptTopMovies("2025-01-01", "2026-01-31");
  const moviesQuery = queryMoviesForTrending();

  // Combine trending stats with movie details
  const topMoviesWithDetails = useMemo(() => {
    if (!trendingQuery.data?.result || !moviesQuery.data?.result) return [];

    const trendingData = trendingQuery.data.result.slice(0, 5);
    const allMovies = moviesQuery.data.result;

    return trendingData
      .map((trendingMovie, index) => {
        const movieDetail = allMovies.find((movie) => movie.id === trendingMovie.movieId);

        return {
          id: trendingMovie.movieId || 0,
          name: trendingMovie.movieName || "",
          rank: index + 1,
          ticketCount: trendingMovie.ticketCount || 0,
          totalRevenue: trendingMovie.totalRevenue || 0,
          poster: movieDetail?.poster,
          banner: movieDetail?.banner,
          categories: movieDetail?.categories?.map((c) => c.name).filter((name): name is string => Boolean(name)) || [], // Fix categories type
          duration: movieDetail?.duration,
          fromDate: movieDetail?.fromDate,
        };
      })
      .filter((movie) => movie.id > 0);
  }, [trendingQuery.data, moviesQuery.data]);

  // Set default selected movie
  React.useEffect(() => {
    if (topMoviesWithDetails.length > 0 && selectedMovieId === null) {
      setSelectedMovieId(topMoviesWithDetails[0].id);
      setLastHoveredMovieId(topMoviesWithDetails[0].id); // Also set as last hovered
    }
  }, [topMoviesWithDetails, selectedMovieId]);

  // Get banner based on last hovered or selected movie
  const currentMovieId = lastHoveredMovieId ?? selectedMovieId; // Use last hovered movie
  const selectedMovie = topMoviesWithDetails.find((movie) => movie.id === currentMovieId);
  const backgroundBanner = selectedMovie?.banner || "";

  // Create display list with placeholders
  const displayMovies = useMemo(() => {
    const movies = [...topMoviesWithDetails];
    while (movies.length < 5) {
      movies.push({
        isPlaceholder: true,
        rank: movies.length + 1,
      } as any);
    }
    return movies;
  }, [topMoviesWithDetails]);

  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId);
    navigate(`/movie/${movieId}`);
  };

  const handleMouseEnter = (movieId: number) => {
    setLastHoveredMovieId(movieId); // Update last hovered movie and persist it
  };

  const handleBookNow = () => {
    if (currentMovieId) {
      navigate(`/movie/${currentMovieId}`);
    }
  };

  // Loading state
  if (trendingQuery.isLoading || moviesQuery.isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-black">
        <div className="text-xl text-white">Đang tải bảng xếp hạng...</div>
      </div>
    );
  }

  // Error state
  if (trendingQuery.error || moviesQuery.error) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-black">
        <div className="text-xl text-red-500">Có lỗi xảy ra khi tải dữ liệu</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Banner */}
      {backgroundBanner && (
        <>
          <Image
            src={backgroundBanner}
            alt="Selected movie banner"
            layout="fullWidth"
            priority={true}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-in-out"
            height={1080}
            aspectRatio={1920 / 1080}
            breakpoints={[768, 1024, 1280, 1536]}
          />
          <div className="absolute inset-0 z-10 bg-black/60" />
        </>
      )}

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 py-16">
        <div className="grid min-h-screen grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: Movie Ranking List */}
          <div className="space-y-6">
            <div className="text-left">
              <h2 className="mb-2 text-4xl font-bold text-white">TOP MOVIES</h2>
              <p className="text-lg text-gray-300">Được bình chọn nhiều nhất</p>
            </div>

            <div className="space-y-4">
              {displayMovies.map((movie) => {
                if ("isPlaceholder" in movie) {
                  return <PlaceholderMovieItem key={movie.rank} rank={movie.rank} />;
                }
                return (
                  <MovieRankingItem
                    key={movie.id}
                    movie={movie}
                    isSelected={selectedMovieId === movie.id}
                    isHighlighted={lastHoveredMovieId === movie.id} // Check if this is the last hovered
                    onClick={() => handleMovieClick(movie.id)}
                    onMouseEnter={() => handleMouseEnter(movie.id)} // Handle hover
                  />
                );
              })}
            </div>
          </div>

          {/* Right: Video Play Section */}
          <div className="flex items-center justify-center">
            <div className="space-y-6 text-center">
              <div className="space-y-4">
                <h3 className="text-6xl font-bold text-white"></h3>
                <p className="text-xl tracking-wider text-orange-400">BY F-Cinema</p>

                {/* Book Now Button */}
                <button
                  onClick={handleBookNow}
                  className="inline-flex transform items-center justify-center rounded-lg bg-orange-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-colors duration-300 hover:scale-105 hover:bg-orange-600 hover:shadow-xl"
                >
                  Book Ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component cho movie ranking item
const MovieRankingItem = ({
  movie,
  isSelected,
  isHighlighted,
  onClick,
  onMouseEnter,
}: {
  movie: TrendingMovieWithDetails;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}) => {
  const primaryCategory = movie.categories?.[0] || "Action";
  const genres = movie.categories?.join(", ") || "Action, Thriller";

  // Determine the styling based on state
  let itemClassName = "border-white/10 bg-black/40 hover:bg-black/60";
  if (isHighlighted) {
    itemClassName = "border-orange-400/50 bg-orange-500/20 shadow-lg shadow-orange-500/20";
  } else if (isSelected) {
    itemClassName = "border-orange-400/30 bg-orange-500/10";
  }

  return (
    <div
      className={`flex cursor-pointer items-center space-x-6 rounded-lg border p-4 backdrop-blur-sm transition-all duration-300 ${itemClassName}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {/* Movie Poster */}
      <div className="flex-shrink-0">
        <Image
          src={movie.poster || "/placeholder-movie.jpg"}
          alt={movie.name}
          layout="constrained"
          width={64}
          height={96}
          className="h-24 w-16 rounded-lg object-cover"
          loading="lazy"
        />
      </div>

      {/* Rank Number */}
      <div className={`w-12 text-center text-4xl font-bold transition-colors duration-300 ${isHighlighted ? "text-orange-300" : "text-orange-400"}`}>
        {movie.rank.toString().padStart(2, "0")}
      </div>

      {/* Movie Info */}
      <div className="flex-1 space-y-2">
        <h4 className="line-clamp-1 text-xl font-semibold text-white">{movie.name}</h4>
        <p className="text-sm text-gray-300">
          {primaryCategory}, {genres}
        </p>
      </div>

      {/* Highlighted Indicator */}
      {isHighlighted && (
        <div className="flex-shrink-0">
          <div className="h-3 w-3 animate-pulse rounded-full bg-orange-400" />
        </div>
      )}
    </div>
  );
};

// Component cho placeholder items
const PlaceholderMovieItem = ({ rank }: { rank: number }) => {
  return (
    <div className="flex items-center space-x-6 rounded-lg border border-white/5 bg-black/20 p-4 opacity-50 backdrop-blur-sm">
      {/* Placeholder Poster */}
      <div className="flex h-24 w-16 items-center justify-center rounded-lg bg-gray-600">
        <div className="text-xs text-gray-400">?</div>
      </div>

      {/* Rank Number */}
      <div className="w-12 text-center text-4xl font-bold text-gray-500">{rank.toString().padStart(2, "0")}</div>

      {/* Placeholder Info */}
      <div className="flex-1 space-y-2">
        <h4 className="text-xl font-semibold text-gray-400">Đang Tranh cử</h4>
        <p className="text-sm text-gray-500">Chờ đợi kết quả bình chọn</p>
      </div>
    </div>
  );
};

export default TrendingSection;
