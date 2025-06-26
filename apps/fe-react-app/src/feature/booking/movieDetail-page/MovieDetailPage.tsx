// ✅ File: src/feature/movie/MovieDetailPage.tsx

import pTagImage from "@/assets/pTag.png";
import ShowDateSelector from "@/feature/booking/components/ShowDateSelector/ShowDateSelector";
import ShowtimesGroup from "@/feature/booking/components/ShowtimesGroup/ShowtimesGroup";
import type { SchedulePerDay } from "@/feature/booking/components/ShowtimesModal/ShowtimesModal";
import { MovieGenre } from "@/interfaces/movies.interface.ts";
import UserLayout from "@/layouts/user/UserLayout";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieGenreLabel, useMovie } from "../../../services/movieService";
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
  const match = regExp.exec(url);
  return match && match[2].length === 11 ? match[2] : null;
};

// Helper to safely convert string to MovieGenre
const safeMapToMovieGenre = (type?: string): MovieGenre | undefined => {
  if (!type) return undefined;
  const typeUpper = type.toUpperCase();
  return Object.values(MovieGenre).find((genre) => genre === typeUpper);
};

const MovieDetailPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  // Use React Query to fetch movie data
  const { data: movieResponse, isLoading, error } = useMovie(Number(movieId));

  // Extract movie from response
  const movie = movieResponse?.result;

  // State for showtimes
  const [scheduleData, setScheduleData] = useState<SchedulePerDay[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showtimesLoading, setShowtimesLoading] = useState(true);
  const [showtimesError, setShowtimesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!movieId) {
        setShowtimesError("Movie ID is required");
        setShowtimesLoading(false);
        return;
      }

      try {
        setShowtimesLoading(true);

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

        setShowtimesError(null);
      } catch (err) {
        console.error("Error fetching showtimes:", err);
        setShowtimesError("Failed to load showtimes. Please try again.");
      } finally {
        setShowtimesLoading(false);
      }
    };

    fetchShowtimes();
  }, [movieId]);

  const scheduleForSelectedDay = scheduleData.find((d) => d.date === selectedDate);

  const handleShowtimeSelection = (showtime: { time: string; format: string }) => {
    if (selectedDate && movie) {
      navigate("/booking", {
        state: {
          movie: {
            id: movie.id,
            posterUrl: movie.poster,
            title: movie.name, // Use 'name' from new interface
            genres: movie.type ? [getMovieGenreLabel(safeMapToMovieGenre(movie.type) ?? MovieGenre.ACTION)] : [],
            duration: `${movie.duration ?? 0} phút`,
            ageBadgeUrl: pTagImage,
            trailerUrl: movie.trailer, // Use 'trailer' from new interface
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
  if (isLoading || showtimesLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center py-20">
          <div className="text-white text-xl">Đang tải thông tin phim...</div>
        </div>
      </UserLayout>
    );
  }

  // Error state
  if (error || showtimesError || !movie) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center py-20">
          <div className="text-red-500 text-xl">{showtimesError ?? "Không tìm thấy thông tin phim"}</div>
        </div>
      </UserLayout>
    );
  }

  const embedUrl = movie.trailer && getYouTubeId(movie.trailer) ? `https://www.youtube.com/embed/${getYouTubeId(movie.trailer)}?autoplay=0` : "";

  return (
    <UserLayout>
      <div className="bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="text-sm breadcrumbs mb-6">
            <ul>
              <li>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="hover:underline cursor-pointer bg-transparent border-none p-0 text-current"
                >
                  Trang chủ
                </button>
              </li>
              <li className="font-semibold">{movie.name}</li>
            </ul>
          </div>

          {/* Movie Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-3">
              <img src={movie.poster} alt={movie.name ?? "Movie poster"} className="w-full h-auto rounded-lg shadow-lg" />
            </div>
            <div className="md:col-span-9">
              <h1 className="text-3xl font-bold text-red-600 mb-4">{movie.name}</h1>
              <div className="space-y-2">
                <MovieInfoItem label="Đạo diễn" value={movie.director ?? "Đang cập nhật"} />
                <MovieInfoItem label="Diễn viên" value={movie.actor ?? "Đang cập nhật"} />
                <MovieInfoItem
                  label="Thể loại"
                  value={movie.type ? getMovieGenreLabel(safeMapToMovieGenre(movie.type) ?? MovieGenre.ACTION) : "Đang cập nhật"}
                />
                <MovieInfoItem label="Thời lượng" value={`${movie.duration ?? 0} phút`} />
                <MovieInfoItem label="Studio" value={movie.studio ?? "Đang cập nhật"} />
                <MovieInfoItem label="Giới hạn tuổi" value={movie.ageRestrict ? `${movie.ageRestrict}+` : "Đang cập nhật"} />
              </div>
              <p className="mt-4 text-sm text-gray-700 leading-relaxed">{movie.description ?? "Chưa có mô tả"}</p>
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
          {movie.trailer && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">TRAILER</h2>
              <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title="Trailer"
                    style={{ border: 0 }}
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
