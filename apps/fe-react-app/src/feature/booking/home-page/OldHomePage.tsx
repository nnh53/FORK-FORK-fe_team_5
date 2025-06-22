import { useEffect, useState } from "react";

import MovieList from "../../../components/movie/MovieList/MovieList.tsx";
import MovieSearch from "../../../components/MovieSearch.tsx";
import Carousel from "../../../components/shared/Carousel/Carousel.tsx";
import UserLayout from "../../../layouts/user/UserLayout.tsx";
import ShowtimesModal from "../components/ShowtimesModal/ShowtimesModal.tsx";
import TicketConfirmModal from "../components/TicketConfirmModal/TicketConfirmModal.tsx";

import nowShowing from "@/assets/nowShowingText.png";
import upcoming from "@/assets/upComingText.png";
import TrailerModal from "@/feature/booking/components/TrailerModal/TrailerModal.tsx";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../../../../../mockapi-express-app/src/movies.mockapi.ts";
import type { MovieCardProps } from "../../../components/movie/MovieCard/MovieCard.tsx";
import { movieService } from "../../../services/movieService.ts";
import { showtimeService } from "../../../services/showtimeService.ts";
import { convertMoviesToMovieCards } from "../../../utils/movieUtils.ts";
import { convertShowtimesToSchedulePerDay } from "../../../utils/showtimeUtils.ts";
import type { SchedulePerDay } from "../components/ShowtimesModal/ShowtimesModal.tsx";

// 1. MOCK DATA PHIM
interface FinalSelection {
  date: string;
  time: string;
  format: string;
}

function OldHomePage() {
  const navigate = useNavigate();
  // State for movies from API
  const [movies, setMovies] = useState<MovieCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for showtimes
  const [showtimes, setShowtimes] = useState<SchedulePerDay[]>([]);
  const [showtimesLoading, setShowtimesLoading] = useState(false);
  const [showtimesError, setShowtimesError] = useState<string | null>(null);

  const movieBaner: string[] = [
    "https://weliveentertainment.com/wp-content/uploads/2025/04/minecraft-movie-banner.png",
    "https://files.betacorp.vn/media/images/2025/06/04/1702x621-13-104719-040625-85.png",
  ];

  const [isShowtimesModalOpen, setIsShowtimesModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieCardProps | null>(null);
  const [finalSelection, setFinalSelection] = useState<FinalSelection | null>(null);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [selectedTrailerUrl, setSelectedTrailerUrl] = useState("");

  // Fetch movies from API when component mounts
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const moviesData = await movieService.getAllMovies();
        const movieCards = convertMoviesToMovieCards(moviesData);
        setMovies(movieCards);
        setError(null);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);
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
          title: movie.title,
          poster: movie.poster,
          genres: movie.genre.split(",").map((g) => ({ id: g.trim(), name: g.trim() })),
          genre: movie.genre,
          director: movie.director,
          actors: movie.actors,
          releaseYear: movie.releaseYear,
          productionCompany: movie.productionCompany,
          duration: movie.duration,
          rating: movie.rating,
          description: movie.description,
          trailerUrl: movie.trailerUrl,
          startShowingDate: movie.startShowingDate,
          endShowingDate: movie.endShowingDate,
          status: movie.status,
          version: movie.version,
          showtimes: [],
          createdAt: movie.createdAt,
          updatedAt: movie.updatedAt,
        },
      },
    });
  };

  return (
    <UserLayout background={"https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg"}>
      <Carousel autoplayInterval={2000} images={movieBaner} height={"600px"} />
      {/* Movie Search Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Tìm Kiếm Phim</h2>
          <p className="text-gray-300">Tìm kiếm và đặt vé phim nhanh chóng</p>
        </div>
        <MovieSearch onMovieSelect={handleMovieSearchSelect} placeholder="Nhập tên phim để tìm kiếm..." className="max-w-md mx-auto" />
      </div>
      <div
        className="
          flex items-center justify-center
          p-2 h-48
          bg-gradient-to-r from-black/40 via-transparent to-black/40
        "
        id="now-showing"
      >
        <img src={nowShowing} className="h-24" alt="Phim sắp chiếu" />
      </div>
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-white text-lg">Đang tải phim...</div>
        </div>
      )}
      {/* Error state */}
      {error && (
        <div className="flex justify-center items-center py-12">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      )}
      {/* Movies list */}
      {!loading && !error && (
        <MovieList
          horizontal={true}
          movies={movies}
          cardsPerRow={4}
          onPosterClick={handlePosterClick}
          onTitleClick={handleTitleClick}
          onMovieBuyTicketClick={handleBuyTicketClick}
        />
      )}
      <div
        className="
          flex items-center justify-center
          p-2 h-48
          bg-gradient-to-r from-black/40 via-transparent to-black/40
        "
        id="coming-soon"
      >
        <img src={upcoming} className="h-24" alt="Phim sắp chiếu" />
      </div>
      {/* Upcoming movies - for now, show same movies but could be filtered differently */}
      {!loading && !error && (
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
          movieTitle={selectedMovie?.title || ""}
          trailerUrl={selectedTrailerUrl}
        />
      )}
    </UserLayout>
  );
}

export default OldHomePage;
