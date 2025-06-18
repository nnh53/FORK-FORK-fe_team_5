// ✅ File: src/feature/movie/MovieDetailPage.tsx

import pTagImage from "@/assets/pTag.png";
import ShowDateSelector from "@/feature/booking/components/ShowDateSelector/ShowDateSelector";
import ShowtimesGroup from "@/feature/booking/components/ShowtimesGroup/ShowtimesGroup";
import type { SchedulePerDay } from "@/feature/booking/components/ShowtimesModal/ShowtimesModal";
import UserLayout from "@/layouts/userLayout/UserLayout";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Movie } from "../../../../../mockapi-express-app/src/movies.mockapi";
import { movieService } from "../../../services/movieService";
import { showtimeService } from "../../../services/showtimeService";
import { convertShowtimesToSchedulePerDay, getAvailableDatesFromShowtimes } from "../../../utils/showtimeUtils";

const MovieInfoItem = ({ label, value }: { label: string; value: string | string[] }) => (
  <div className="flex text-sm">
    <p className="w-28 font-semibold text-gray-600">{label}:</p>
    <p className="flex-1 text-gray-800">{Array.isArray(value) ? value.join(", ") : value}</p>
  </div>
);

const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const MovieDetailPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  // State for movie data and showtimes
  const [movie, setMovie] = useState<Movie | null>(null);
  const [scheduleData, setScheduleData] = useState<SchedulePerDay[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieAndShowtimes = async () => {
      if (!movieId) {
        setError("Movie ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Always fetch movie data from API to ensure consistency
        const movieData = await movieService.getMovieById(movieId);
        setMovie(movieData);

        // Fetch showtimes for this movie
        const showtimesData = await showtimeService.getShowtimesByMovieId(movieId);

        // Convert showtimes to schedule format
        const schedulePerDay = convertShowtimesToSchedulePerDay(showtimesData);
        setScheduleData(schedulePerDay);

        // Get available dates
        const dates = getAvailableDatesFromShowtimes(showtimesData);
        setAvailableDates(dates);

        // Set default selected date
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching movie data:", err);
        setError("Failed to load movie details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovieAndShowtimes();
  }, [movieId]);

  const scheduleForSelectedDay = scheduleData.find((d) => d.date === selectedDate);

  const handleShowtimeSelection = (showtime: { time: string; format: string }) => {
    if (selectedDate && movie) {
      navigate("/booking", {
        state: {
          movie: {
            id: movie.id,
            posterUrl: movie.poster,
            title: movie.title,
            genres: movie.genres ? movie.genres.map((g) => g.name) : [movie.genre],
            duration: `${movie.duration} phút`,
            ageBadgeUrl: pTagImage,
            trailerUrl: movie.trailerUrl,
          },
          selection: {
            date: selectedDate,
            time: showtime.time,
            format: showtime.format,
          },
          cinemaName: "FCinema",
        },
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <UserLayout background={"https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg"}>
        <div className="flex justify-center items-center py-20">
          <div className="text-white text-xl">Đang tải thông tin phim...</div>
        </div>
      </UserLayout>
    );
  }

  // Error state
  if (error || !movie) {
    return (
      <UserLayout background={"https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg"}>
        <div className="flex justify-center items-center py-20">
          <div className="text-red-500 text-xl">{error || "Không tìm thấy thông tin phim"}</div>
        </div>
      </UserLayout>
    );
  }

  const embedUrl =
    movie.trailerUrl && getYouTubeId(movie.trailerUrl) ? `https://www.youtube.com/embed/${getYouTubeId(movie.trailerUrl)}?autoplay=0` : "";

  return (
    <UserLayout background={"https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg"}>
      <div className="bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="text-sm breadcrumbs mb-6">
            <ul>
              <li>
                <a onClick={() => navigate("/")} className="hover:underline cursor-pointer">
                  Trang chủ
                </a>
              </li>
              <li className="font-semibold">{movie.title}</li>
            </ul>
          </div>

          {/* Movie Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-3">
              <img src={movie.poster} alt={movie.title} className="w-full h-auto rounded-lg shadow-lg" />
            </div>
            <div className="md:col-span-9">
              <h1 className="text-3xl font-bold text-red-600 mb-4">{movie.title}</h1>
              <div className="space-y-2">
                <MovieInfoItem label="Đạo diễn" value={movie.director} />
                <MovieInfoItem label="Diễn viên" value={movie.actors || "Đang cập nhật"} />
                <MovieInfoItem label="Thể loại" value={movie.genres ? movie.genres.map((g) => g.name) : [movie.genre]} />
                <MovieInfoItem label="Thời lượng" value={`${movie.duration} phút`} />
                <MovieInfoItem label="Năm sản xuất" value={movie.releaseYear.toString()} />
                <MovieInfoItem label="Đánh giá" value={`${movie.rating}/10`} />
              </div>
              <p className="mt-4 text-sm text-gray-700 leading-relaxed">{movie.description}</p>
            </div>
          </div>

          {/* Showtimes */}
          <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">LỊCH CHIẾU</h2>
            {availableDates.length > 0 ? (
              <>
                <ShowDateSelector dates={availableDates} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                <ShowtimesGroup scheduleForDay={scheduleForSelectedDay} onSelectShowtime={handleShowtimeSelection} />
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">Hiện tại chưa có lịch chiếu cho phim này</div>
            )}
          </div>

          {/* Trailer Section */}
          {movie.trailerUrl && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">TRAILER</h2>
              <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title="Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <div className="text-center text-white py-20">Không thể phát trailer.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default MovieDetailPage;
