import type { MovieCardProps } from "@/components/movie/MovieCard.tsx";
import MovieList from "@/components/movie/MovieList";
import SplitText from "@/components/Reactbits/reactbit-text-animations/SplitText/SplitText.tsx";
import MovieSearch from "@/components/shared/MovieSearch.tsx";
import TrailerModal from "@/feature/booking/components/TrailerModal/TrailerModal.tsx";
import type { Movie } from "@/interfaces/movies.interface.ts";
import { queryMovies, transformMovieResponse } from "@/services/movieService.ts";
import { transformShowtimesResponse } from "@/services/showtimeService.ts";
import type { MovieResponse } from "@/type-from-be";
import { convertShowtimesToSchedulePerDay } from "@/utils/showtime.utils.ts";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import createFetchClient from "openapi-fetch";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { paths } from "../../../schema-from-be";
import type { SchedulePerDay } from "../../feature/booking/components/ShowtimesModal/ShowtimesModal.tsx";
import ShowtimesModal from "../../feature/booking/components/ShowtimesModal/ShowtimesModal.tsx";
import TicketConfirmModal from "../../feature/booking/components/TicketConfirmModal/TicketConfirmModal.tsx";

interface FinalSelection {
  date: string;
  time: string;
  format: string;
  showtimeId: string;
  roomId: string;
}

function MovieSelection() {
  const navigate = useNavigate();

  // Create fetch client for manual API calls
  const fetchClient = createFetchClient<paths>({
    baseUrl: `${import.meta.env.VITE_API_URL}/movie_theater/`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add auth token to requests
  fetchClient.use({
    onRequest({ request }) {
      const token = localStorage.getItem("token");
      if (token) {
        request.headers.set("Authorization", `Bearer ${token}`);
      }
      return request;
    },
  });

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

  // Helper function to convert Movie to MovieCardProps
  const convertMovieToMovieCard = useCallback((movie: Movie): MovieCardProps => {
    return {
      id: movie.id ?? 0,
      title: movie.name ?? "Untitled",
      posterUrl: movie.poster ?? "",
      genres: movie.categories ? movie.categories.map((cat) => cat.name ?? "") : [],
      duration: movie.duration ? `${movie.duration} phút` : "N/A",
      trailerUrl: movie.trailer ?? "",
    };
  }, []);

  // Use React Query hook to fetch movies
  const { data: moviesData, isLoading, error } = queryMovies();

  // Transform API data using useMemo instead of useState + useEffect
  const movies = useMemo(() => {
    if (!moviesData?.result) return [];

    return moviesData.result.map((movieResponse: MovieResponse) => {
      const movie = transformMovieResponse(movieResponse);
      return convertMovieToMovieCard(movie);
    });
  }, [moviesData, convertMovieToMovieCard]);

  const handleBuyTicketClick = async (movie: MovieCardProps) => {
    setSelectedMovie(movie);
    setIsShowtimesModalOpen(true);
    setShowtimesLoading(true);
    setShowtimesError(null);

    try {
      // Use fetchClient to fetch showtimes manually
      const movieId = typeof movie.id === "string" ? parseInt(movie.id) : movie.id;
      const response = await fetchClient.GET("/showtimes/movie/{movieId}", {
        params: { path: { movieId } },
      });

      if (response.data?.result) {
        const transformedShowtimes = transformShowtimesResponse(response.data.result);
        // Convert to old format for utility functions
        const oldFormatShowtimes = transformedShowtimes.map((newShowtime) => {
          const showDate = new Date(newShowtime.showDateTime);
          const endDate = new Date(newShowtime.endDateTime);

          return {
            id: newShowtime.id.toString(),
            movieId: newShowtime.movieId,
            cinemaRoomId: newShowtime.roomId?.toString() ?? "1",
            date: showDate.toISOString().split("T")[0],
            startTime: showDate.toTimeString().split(" ")[0].slice(0, 5),
            endTime: endDate.toTimeString().split(" ")[0].slice(0, 5),
            format: "2D",
            availableSeats: 50,
            price: 100000,
          };
        });

        const scheduleData = convertShowtimesToSchedulePerDay(oldFormatShowtimes);
        setShowtimes(scheduleData);
      } else {
        setShowtimes([]);
      }
    } catch (err) {
      console.error("Error fetching showtimes:", err);
      setShowtimesError("Failed to load showtimes. Please try again later.");
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
    <div>
      {/* Movie Search Section */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 text-center">
          <h2 className="text-brown-500 mb-2 text-3xl font-bold">Tìm Kiếm Phim</h2>
        </div>
        <MovieSearch onMovieSelect={handleMovieSearchSelect} placeholder="Nhập tên phim để tìm kiếm..." className="mx-auto max-w-md" />
      </div>
      <SplitText
        text="NOW SHOWING"
        className="text-center text-2xl font-semibold"
        delay={100}
        duration={0.6}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
        onLetterAnimationComplete={() => {
          // Refresh ScrollTrigger to ensure Footer animations work
          setTimeout(() => ScrollTrigger.refresh(), 50);
        }}
      />
      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-white">Đang tải phim...</div>
        </div>
      )}
      {/* Error state */}
      {error && (
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-red-500">Có lỗi xảy ra khi tải danh sách phim</div>
        </div>
      )}
      {/* Movies list */}
      {!isLoading && !error && (
        <MovieList
          horizontal={true}
          movies={movies}
          cardsPerRow={4}
          onPosterClick={handlePosterClick}
          onTitleClick={handleTitleClick}
          onMovieBuyTicketClick={handleBuyTicketClick}
        />
      )}
      <SplitText
        text="UPCOMING MOVIES"
        className="text-center text-2xl font-semibold"
        delay={100}
        duration={0.6}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
        onLetterAnimationComplete={() => {
          // Refresh ScrollTrigger to ensure Footer animations work
          setTimeout(() => ScrollTrigger.refresh(), 50);
        }}
      />
      {/* Upcoming movies - for now, show same movies but could be filtered differently */}
      {!isLoading && !error && (
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
    </div>
  );
}

export default MovieSelection;
