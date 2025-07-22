import { queryMoviesForTrending } from "@/services/movieService";
import { queryReceiptTopMovies } from "@/services/receipService";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface TrendingMovieCardType {
  id: number;
  name: string;
  rank: number;
  ticketCount: number;
  totalRevenue: number;
  poster?: string;
  duration?: number;
  fromDate?: string;
}

const TrendingSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"today" | "week">("today");

  // Get trending data (ranking + stats)
  const trendingQuery = queryReceiptTopMovies("2025-01-01", "2026-01-31");

  // Get all movies data (with poster, fromDate, etc.)
  const moviesQuery = queryMoviesForTrending();

  // Combine trending stats with movie details
  const topMovies = useMemo(() => {
    if (!trendingQuery.data?.result || !moviesQuery.data?.result) return [];

    const trendingData = trendingQuery.data.result.slice(0, 10);
    const allMovies = moviesQuery.data.result;

    // Map trending data with movie details
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
          duration: movieDetail?.duration,
          fromDate: movieDetail?.fromDate,
        };
      })
      .filter((movie) => movie.id > 0); // Filter out invalid movies
  }, [trendingQuery.data, moviesQuery.data]);

  // Handler để navigate đến movie detail page
  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  // Loading state
  if (trendingQuery.isLoading || moviesQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-xl text-gray-600">Đang tải bảng xếp hạng...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (trendingQuery.error || moviesQuery.error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-xl text-red-600">Có lỗi xảy ra khi tải dữ liệu</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          {/* Title and Tabs */}
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-gray-900">Trending</h1>
            <div className="flex rounded-full border border-gray-800 bg-gray-800">
              <button
                onClick={() => setActiveTab("today")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "today" ? "bg-gradient-to-r from-green-400 to-blue-500 text-white" : "text-white hover:text-green-400"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setActiveTab("week")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "week" ? "bg-gradient-to-r from-green-400 to-blue-500 text-white" : "text-white hover:text-green-400"
                }`}
              >
                This Week
              </button>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
          {topMovies.map((movie) => (
            <TrendingMovieCard key={movie.id} movie={movie} onClick={() => handleMovieClick(movie.id)} />
          ))}
        </div>

        {/* Empty state message if no movies */}
        {topMovies.length === 0 && !trendingQuery.isLoading && !moviesQuery.isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center text-gray-500">
              <p className="text-lg">Chưa có dữ liệu trending</p>
              <p className="text-sm">Các bộ phim sẽ xuất hiện ở đây khi có đủ dữ liệu bình chọn</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Component cho movie card
const TrendingMovieCard = ({ movie, onClick }: { movie: TrendingMovieCardType; onClick: () => void }) => {
  // Format release date from schema fromDate field - now directly available
  const releaseDate = movie.fromDate
    ? new Date(movie.fromDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "TBA";

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
      onClick={onClick}
    >
      {/* Ranking Badge */}
      <div className="absolute top-2 left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs font-bold text-white">
        {movie.rank}
      </div>

      {/* Movie Poster */}
      <div className="aspect-[2/3] overflow-hidden">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <div className="text-center text-gray-400">
              <svg className="mx-auto mb-2 h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs">No Image</p>
            </div>
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="p-3">
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-blue-600">{movie.name}</h3>
        <p className="text-xs text-gray-500">{releaseDate}</p>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"></div>
    </div>
  );
};

export default TrendingSection;
