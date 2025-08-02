import { LineShadowText } from "@/components/magicui/line-shadow-text";
import CardSwap, { Card } from "@/components/Reactbits/reactbit-components/CardSwap/CardSwap";
import { queryMoviesForTrending } from "@/services/movieService";
import { queryReceiptTopMovies } from "@/services/receiptService";
import { getYouTubeEmbedUrl, getYouTubeVideoId } from "@/utils/movie.utils";
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
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredMovieId, setHoveredMovieId] = useState<number | null>(null); // Changed to persist last hovered

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
          trailer: movieDetail?.trailer,
        };
      })
      .filter((movie) => movie.id > 0);
  }, [trendingQuery.data, moviesQuery.data]);

  const cardSwapSettings = isMobile
    ? {
        cardDistance: 30,
        verticalDistance: 10,
        delay: 8000,
        pauseOnHover: true,
        skewAmount: 0,
      }
    : {
        cardDistance: 50,
        verticalDistance: 100,
        delay: 8000,
        pauseOnHover: true,
        skewAmount: 2,
      };
  // Set default selected movie

  React.useEffect(() => {
    if (topMoviesWithDetails.length > 0 && selectedMovieId === null) {
      // setSelectedMovieId(topMoviesWithDetails[0].id);
      setLastHoveredMovieId(topMoviesWithDetails[0].id);
      setHoveredMovieId(topMoviesWithDetails[0].id);
      // Also set as last hovered
    }
  }, [topMoviesWithDetails, selectedMovieId]);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
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

  const handleMouseHover = (movieId: number) => {
    setLastHoveredMovieId(movieId);
    setHoveredMovieId(movieId);
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
    <section id="trending">
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
                <h2 className="mb-2 text-4xl font-bold text-white">
                  <LineShadowText className="italic" shadowColor="white">
                    TOP
                  </LineShadowText>{" "}
                  <LineShadowText className="italic" shadowColor="white">
                    MOVIES
                  </LineShadowText>
                </h2>
                <p className="text-lg text-gray-300">Best Sellers</p>
              </div>

              <div className="space-y-4">
                {displayMovies.map((movie) => {
                  if ("isPlaceholder" in movie) {
                    return <PlaceholderMovieItem key={movie.rank} rank={movie.rank} />;
                  }
                  return (
                    <MovieRankingItem
                      data-testid="movie-item"
                      key={movie.id}
                      movie={movie}
                      isSelected={selectedMovieId === movie.id}
                      isHighlighted={lastHoveredMovieId === movie.id} // Check if this is the last hovered
                      onClick={() => handleMovieClick(movie.id)}
                      onMouseHover={() => handleMouseHover(movie.id)} // Handle hover
                    />
                  );
                })}
              </div>
            </div>

            {/* Right: Video Play Section */}
            <div className="hidden items-center justify-center lg:flex">
              <CardSwap
                cardDistance={cardSwapSettings.cardDistance}
                verticalDistance={cardSwapSettings.verticalDistance}
                delay={cardSwapSettings.delay}
                pauseOnHover={cardSwapSettings.pauseOnHover}
                skewAmount={cardSwapSettings.skewAmount}
                activeIndex={displayMovies.findIndex((movie) => movie.id === hoveredMovieId)}
                // onActiveIndexChange={setHoveredMovieId}
              >
                {displayMovies.map((movie) => (
                  <Card key={movie.id} className="card-style h-100 w-100">
                    {(() => {
                      // Only play trailer for active card
                      if (hoveredMovieId === movie.id && movie.trailer && getYouTubeEmbedUrl(movie.trailer)) {
                        const videoId = getYouTubeVideoId(movie.trailer || "");
                        const startTime = movie.id ? (movie.id % 60) + 10 : 0;
                        const embedUrl = getYouTubeEmbedUrl(movie.trailer, {
                          autoplay: true,
                          rel: false,
                          showinfo: false,
                        });

                        let finalUrl = embedUrl || "";
                        finalUrl = `${finalUrl}&start=${startTime}&mute=1&loop=1`;
                        if (videoId) {
                          finalUrl += `&playlist=${videoId}`;
                        }

                        return (
                          <div className="trailer-container h-full w-full">
                            <iframe
                              src={finalUrl}
                              title={`Trailer - ${movie.name}`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="trailer-iframe h-full w-full"
                            />
                          </div>
                        );
                      }

                      // Fallback to poster for non-active cards or if no trailer
                      if (movie.poster) {
                        return (
                          <div className="poster-container">
                            <img src={movie.poster} alt={movie.name} className="poster-image" loading="lazy" />
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </Card>
                ))}
                {displayMovies.length === 0 && (
                  <Card className="empty-card-style">
                    <h3 className="empty-card-title">No spotlight movies available</h3>
                  </Card>
                )}
              </CardSwap>
              {/* </div> */}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Component cho movie ranking item
const MovieRankingItem = ({
  movie,
  isSelected,
  isHighlighted,
  onClick,
  // onMouseEnter,
  onMouseHover,
}: {
  movie: TrendingMovieWithDetails;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: () => void;
  // onMouseEnter: () => void;
  onMouseHover: () => void;
}) => {
  const primaryCategory = movie.categories?.[0] || "Action";
  const genres = movie.categories?.join(", ") || "Action, Thriller";

  // Determine the styling based on state
  let itemClassName = "border-white/10 bg-black/40 hover:bg-black/60";
  if (isHighlighted) {
    itemClassName = "border-red-400/50 bg-red-500/20 shadow-lg shadow-red-500/20";
  } else if (isSelected) {
    itemClassName = "border-red-400/30 bg-red-500/10";
  }

  return (
    <section id="trending">
      <div
        className={`flex cursor-pointer items-center space-x-6 rounded-lg border p-4 backdrop-blur-sm transition-all duration-300 ${itemClassName}`}
        onClick={onClick}
        // onMouseEnter={onMouseEnter}
        onMouseOver={onMouseHover}
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
        <div className={`w-12 text-center text-4xl font-bold transition-colors duration-300 ${isHighlighted ? "text-red-300" : "text-red-400"}`}>
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
            <div className="h-3 w-3 animate-pulse rounded-full bg-red-400" />
          </div>
        )}
      </div>
    </section>
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
