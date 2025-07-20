import { queryMovie } from "@/services/movieService";
import { queryReceiptTopMovies } from "@/services/receipService";
import { Image } from "@unpic/react";
import React, { useMemo, useState } from "react";

interface TrendingMovieWithDetails {
  id: number;
  name: string;
  rank: number;
  ticketCount: number;
  totalRevenue: number;
  poster?: string;
  banner?: string;
  categories?: string[];
  rating?: number;
  duration?: number;
  releaseYear?: number;
}

const TrendingSection = () => {
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const trendingQuery = queryReceiptTopMovies("2025-01-01", "2026-01-31");

  // Lấy top 5 movies và fetch chi tiết
  const topMoviesWithDetails = useMemo(() => {
    if (!trendingQuery.data?.result) return [];

    const topMovies = trendingQuery.data.result.slice(0, 5);
    return topMovies.map((movie, index) => ({
      id: movie.movieId || 0,
      name: movie.movieName || "",
      rank: index + 1,
      ticketCount: movie.ticketCount || 0,
      totalRevenue: movie.totalRevenue || 0,
    }));
  }, [trendingQuery.data]);

  // Set default selected movie là movie đầu tiên khi data load xong
  React.useEffect(() => {
    if (topMoviesWithDetails.length > 0 && selectedMovieId === null) {
      setSelectedMovieId(topMoviesWithDetails[0].id);
    }
  }, [topMoviesWithDetails, selectedMovieId]);

  // Query chi tiết cho movie được chọn (để lấy banner background)
  const selectedMovieQuery = queryMovie(selectedMovieId || 0);
  const backgroundBanner = selectedMovieQuery.data?.result?.banner || "";
  const selectedMovieName = selectedMovieQuery.data?.result?.name || "";

  // Tạo danh sách đầy đủ 5 items (bổ sung "Đang Tranh cử" nếu thiếu)
  const displayMovies = useMemo(() => {
    const movies: (TrendingMovieWithDetails | { isPlaceholder: true; rank: number })[] = [...topMoviesWithDetails];

    // Bổ sung placeholder nếu không đủ 5 movies
    while (movies.length < 5) {
      movies.push({
        isPlaceholder: true,
        rank: movies.length + 1,
      });
    }

    return movies;
  }, [topMoviesWithDetails]);

  // Handler để thay đổi background khi click movie
  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId);
  };

  // Loading state
  if (trendingQuery.isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-black">
        <div className="text-xl text-white">Đang tải bảng xếp hạng...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Banner using @unpic/react Image */}\
      {backgroundBanner && (
        <div className="absolute">
          <Image
            src={backgroundBanner}
            alt={`${selectedMovieName} banner background`}
            layout="fullWidth"
            className="h-full w-full object-cover transition-opacity duration-500 ease-in-out"
            height={1080}
            breakpoints={[768, 1024, 1280, 1536]}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 z-10 bg-black/60" />
        </div>
      )}
      {/* Content */}
      <div className="container relative z-20 mx-auto px-6 py-16">
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
                    onClick={() => handleMovieClick(movie.id)}
                  />
                );
              })}
            </div>
          </div>

          {/* Right: Video Play Section */}
          <div className="flex items-center justify-center">
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h3 className="text-6xl font-bold text-white"></h3>
                <p className="text-xl tracking-wider text-orange-400">BY F-Cinema</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component cho movie ranking item
const MovieRankingItem = ({ movie, isSelected, onClick }: { movie: TrendingMovieWithDetails; isSelected: boolean; onClick: () => void }) => {
  const movieDetailQuery = queryMovie(movie.id);
  const movieDetail = movieDetailQuery.data?.result;

  const primaryCategory = movieDetail?.categories?.[0]?.name || "Action";
  const genres = movieDetail?.categories?.map((cat) => cat.name).join(", ") || "Action, Thriller";

  return (
    <div
      className={`flex cursor-pointer items-center space-x-6 rounded-lg border p-4 backdrop-blur-sm transition-all duration-300 ${
        isSelected ? "border-orange-400/50 bg-orange-500/20 shadow-lg shadow-orange-500/20" : "border-white/10 bg-black/40 hover:bg-black/60"
      }`}
      onClick={onClick}
    >
      {/* Movie Poster */}
      <div className="flex-shrink-0">
        <Image
          src={movieDetail?.poster || "/placeholder-movie.jpg"}
          alt={movie.name}
          layout="constrained"
          width={64}
          height={96}
          className="h-24 w-16 rounded-lg object-cover"
          loading="lazy"
        />
      </div>

      {/* Rank Number */}
      <div className={`w-12 text-center text-4xl font-bold transition-colors duration-300 ${isSelected ? "text-orange-300" : "text-orange-400"}`}>
        {movie.rank.toString().padStart(2, "0")}
      </div>

      {/* Movie Info */}
      <div className="flex-1 space-y-2">
        <h4 className="line-clamp-1 text-xl font-semibold text-white">{movie.name}</h4>
        <p className="text-sm text-gray-300">
          {primaryCategory}, {genres}
        </p>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
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
