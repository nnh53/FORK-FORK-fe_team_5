import nowShowing from "@/assets/nowShowingText.webp";
import upComingText from "@/assets/upComingText.webp";
import type { MovieCardProps } from "@/components/movie/MovieCard/MovieCard.tsx";
import MovieList from "@/components/movie/MovieList/MovieList.tsx";
import MovieSearch from "@/components/MovieSearch.tsx";
import TrailerModal from "@/feature/booking/components/TrailerModal/TrailerModal.tsx";
import type { Movie } from "@/interfaces/movies.interface.ts";
import UserLayout from "@/layouts/user/UserLayout.tsx";
import { transformMovieResponse, useMovies } from "@/services/movieService.ts";
import { showtimeService } from "@/services/showtimeService.ts";
import type { MovieResponse } from "@/type-from-be";
import { convertShowtimesToSchedulePerDay } from "@/utils/showtimeUtils.ts";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SchedulePerDay } from "../../feature/booking/components/ShowtimesModal/ShowtimesModal.tsx";
import ShowtimesModal from "../../feature/booking/components/ShowtimesModal/ShowtimesModal.tsx";
import TicketConfirmModal from "../../feature/booking/components/TicketConfirmModal/TicketConfirmModal.tsx";

// 1. MOCK DATA PHIM
interface FinalSelection {
  date: string;
  time: string;
  format: string;
}

function MovieSelection() {
  const navigate = useNavigate();

  // Use React Query hook to fetch movies
  const moviesQuery = useMovies();

  // State for movies from API - now derived from React Query
  const [movies, setMovies] = useState<MovieCardProps[]>([]);

  // State for showtimes
  const [showtimes, setShowtimes] = useState<SchedulePerDay[]>([]);
  const [showtimesLoading, setShowtimesLoading] = useState(false);
  const [showtimesError, setShowtimesError] = useState<string | null>(null);
  const [isShowtimesModalOpen, setIsShowtimesModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieCardProps | null>(null);
  const [finalSelection, setFinalSelection] = useState<FinalSelection | null>(null);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [selectedTrailerUrl, setSelectedTrailerUrl] = useState("");

  // Helper function to validate age restriction (13-18 as per backend requirement)
  const validateAgeRestriction = useCallback((ageRestrict?: number): boolean => {
    if (!ageRestrict) return false; // Age restriction is required in backend
    return ageRestrict >= 13 && ageRestrict <= 18;
  }, []);

  // Helper function to get age badge URL based on age restriction
  const getAgeBadgeUrl = useCallback(
    (ageRestrict?: number): string => {
      if (!ageRestrict || !validateAgeRestriction(ageRestrict)) {
        return "/badges/unknown-age.png"; // Default for invalid ages
      }

      // Return appropriate badge based on age (13-18 range)
      if (ageRestrict === 18) return "/badges/18+.png";
      if (ageRestrict >= 16) return "/badges/16+.png";
      if (ageRestrict >= 13) return "/badges/13+.png";

      return "/badges/13+.png"; // Default fallback for valid range
    },
    [validateAgeRestriction],
  );

  // Helper function to convert Movie to MovieCardProps
  const convertMovieToMovieCard = useCallback(
    (movie: Movie): MovieCardProps => {
      return {
        id: movie.id ?? 0,
        title: movie.name ?? "Untitled",
        posterUrl: movie.poster ?? "",
        genres: movie.categories ? movie.categories.map((cat) => cat.name ?? "") : [],
        duration: movie.duration ? `${movie.duration} phút` : "N/A",
        ageBadgeUrl: getAgeBadgeUrl(movie.ageRestrict),
        trailerUrl: movie.trailer ?? "",
      };
    },
    [getAgeBadgeUrl],
  );

  // Transform API data when moviesQuery data changes
  useEffect(() => {
    if (moviesQuery.data?.result) {
      const transformedMovies = moviesQuery.data.result.map((movieResponse: MovieResponse) => {
        const movie = transformMovieResponse(movieResponse);
        return convertMovieToMovieCard(movie);
      });
      setMovies(transformedMovies);
    }
  }, [moviesQuery.data, convertMovieToMovieCard]);
  const handleBuyTicketClick = async (movie: MovieCardProps) => {
    setSelectedMovie(movie);
    setIsShowtimesModalOpen(true);

    // Fetch showtimes for the selected movie
    try {
      setShowtimesLoading(true);
      setShowtimesError(null);

      const showtimesData = await showtimeService.getShowtimesByMovieId(movie.id.toString());
      const scheduleData = convertShowtimesToSchedulePerDay(showtimesData);
      setShowtimes(scheduleData);
    } catch (err) {
      console.error("Error fetching showtimes:", err);
      setShowtimesError("Failed to load showtimes. Please try again later.");
      // Keep empty array if API fails
      setShowtimes([]);
    } finally {
      setShowtimesLoading(false);
    }
  };

  const handlePosterClick = (movie: MovieCardProps) => {
    setSelectedMovie(movie);
    setSelectedTrailerUrl(movie.trailerUrl);
    setIsTrailerModalOpen(true);
    console.log(movie.trailerUrl);
  };
  const handleTitleClick = (movie: MovieCardProps) => {
    navigate(`/movie/${movie.id}`, {
      state: {
        movie: {
          id: movie.id,
          title: movie.title,
          poster: movie.posterUrl,
          genres: movie.genres.map((g) => ({ id: g, name: g })), // Convert to expected format
          genre: movie.genres[0] || "",
          director: "Đang cập nhật", // Default values since not available in MovieCardProps
          actors: "Đang cập nhật",
          releaseYear: new Date().getFullYear(),
          productionCompany: "Đang cập nhật",
          duration: parseInt(movie.duration.replace(" phút", "")),
          rating: 8.0,
          description: "Thông tin chi tiết về phim sẽ được cập nhật.",
          trailerUrl: movie.trailerUrl,
          startShowingDate: new Date().toISOString().split("T")[0],
          endShowingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "active",
          version: "2D",
          showtimes: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    });
  };
  const handleCloseShowtimesModal = () => {
    setIsShowtimesModalOpen(false);
    setSelectedMovie(null);
    // Reset showtimes state
    setShowtimes([]);
    setShowtimesError(null);
  };

  const handleFinalShowtimeSelect = (selected: FinalSelection) => {
    setFinalSelection(selected);
    setIsShowtimesModalOpen(false);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmBooking = () => {
    setIsConfirmModalOpen(false);
    navigate("/booking", {
      state: {
        movie: selectedMovie,
        selection: finalSelection,
        cinemaName: "F-CINEMA",
      },
    });
    setSelectedMovie(null);
    setFinalSelection(null);
  };
  const handleMovieSearchSelect = (movie: Movie) => {
    // Navigate to movie detail page with movie ID in URL
    navigate(`/movie/${movie.id}`, {
      state: {
        movie: {
          id: movie.id,
          name: movie.name,
          poster: movie.poster,
          categories: movie.categories,
          director: movie.director,
          actor: movie.actor,
          studio: movie.studio,
          duration: movie.duration,
          description: movie.description,
          trailer: movie.trailer,
          fromDate: movie.fromDate,
          toDate: movie.toDate,
          status: movie.status,
          ageRestrict: movie.ageRestrict,
          showtimes: movie.showtimes ?? [],
        },
      },
    });
  };

  return (
    <UserLayout>
      {/* Movie Search Section */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-3xl font-bold text-white">Tìm Kiếm Phim</h2>
          <p className="text-gray-300">Tìm kiếm và đặt vé phim nhanh chóng</p>
        </div>
        <MovieSearch onMovieSelect={handleMovieSearchSelect} placeholder="Nhập tên phim để tìm kiếm..." className="mx-auto max-w-md" />
      </div>
      <div className="flex h-48 items-center justify-center bg-gradient-to-r from-black/40 via-transparent to-black/40 p-2" id="now-showing">
        <img src={nowShowing} className="h-24" alt="Phim sắp chiếu" />
      </div>
      {/* Loading state */}
      {moviesQuery.isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-white">Đang tải phim...</div>
        </div>
      )}
      {/* Error state */}
      {moviesQuery.error && (
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-red-500">Có lỗi xảy ra khi tải danh sách phim</div>
        </div>
      )}
      {/* Movies list */}
      {!moviesQuery.isLoading && !moviesQuery.error && (
        <MovieList
          horizontal={true}
          movies={movies}
          cardsPerRow={4}
          onPosterClick={handlePosterClick}
          onTitleClick={handleTitleClick}
          onMovieBuyTicketClick={handleBuyTicketClick}
        />
      )}
      <div className="flex h-48 items-center justify-center bg-gradient-to-r from-black/40 via-transparent to-black/40 p-2" id="coming-soon">
        <img src={upComingText} className="h-24" alt="Phim sắp chiếu" />
      </div>
      {/* Upcoming movies - for now, show same movies but could be filtered differently */}
      {!moviesQuery.isLoading && !moviesQuery.error && (
        <MovieList
          horizontal={true}
          movies={movies.slice(0, 6)} // Show first 6 movies as upcoming
          cardsPerRow={4}
          onPosterClick={handlePosterClick}
          onTitleClick={handleTitleClick}
          onMovieBuyTicketClick={handleBuyTicketClick}
        />
      )}{" "}
      {selectedMovie && (
        <ShowtimesModal
          isOpen={isShowtimesModalOpen}
          onClose={handleCloseShowtimesModal}
          movieTitle={selectedMovie.title}
          cinemaName="F-CINEMA"
          scheduleData={showtimes}
          onSelectShowtime={handleFinalShowtimeSelect}
          loading={showtimesLoading}
          error={showtimesError}
        />
      )}
      {selectedMovie && finalSelection && (
        <TicketConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmBooking}
          movieTitle={selectedMovie.title}
          cinemaName="F-CINEMA"
          selectedDate={finalSelection.date}
          selectedTime={finalSelection.time}
        />
      )}
      {selectedTrailerUrl && (
        <TrailerModal
          isOpen={isTrailerModalOpen}
          onClose={() => setIsTrailerModalOpen(false)}
          movieTitle={selectedMovie?.title ?? ""}
          trailerUrl={selectedTrailerUrl}
        />
      )}
    </UserLayout>
  );
}

export default MovieSelection;
