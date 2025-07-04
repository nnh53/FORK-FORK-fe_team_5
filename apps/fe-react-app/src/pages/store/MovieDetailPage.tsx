// ✅ File: src/feature/movie/MovieDetailPage.tsx

import pTagImage from "@/assets/pTag.png";
import ShowDateSelector from "@/feature/booking/components/ShowDateSelector/ShowDateSelector";
import ShowtimesGroup from "@/feature/booking/components/ShowtimesGroup/ShowtimesGroup";
import type { SchedulePerDay } from "@/feature/booking/components/ShowtimesModal/ShowtimesModal";
import UserLayout from "@/layouts/user/UserLayout";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Showtime as OldShowtime } from "@/interfaces/movies.interface";
import type { Showtime as NewShowtime } from "@/interfaces/showtime.interface";
import { useMovie } from "@/services/movieService";
import { transformShowtimesResponse, useShowtimesByMovie } from "@/services/showtimeService";
import { convertShowtimesToSchedulePerDay, getAvailableDatesFromShowtimes } from "@/utils/showtimeUtils";

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

// Convert new Showtime format to old format for utility functions
const convertToOldShowtimeFormat = (newShowtime: NewShowtime): OldShowtime => {
  const showDate = new Date(newShowtime.showDateTime);
  const endDate = new Date(newShowtime.endDateTime);

  return {
    id: newShowtime.id.toString(),
    movieId: newShowtime.movieId,
    cinemaRoomId: newShowtime.roomId?.toString() ?? "1",
    date: showDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
    startTime: showDate.toTimeString().split(" ")[0].slice(0, 5), // Format: HH:MM
    endTime: endDate.toTimeString().split(" ")[0].slice(0, 5), // Format: HH:MM
    format: "2D", // Default format since it's not in new format
    availableSeats: 50, // Default available seats since it's not in new format
    price: 100000, // Default price since it's not in new format
  };
};

const MovieDetailPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  // Use React Query to fetch movie data
  const { data: movieResponse, isLoading, error } = useMovie(Number(movieId));

  // Use React Query to fetch showtimes for this movie
  const { data: showtimesResponse, isLoading: showtimesLoading, error: showtimesError } = useShowtimesByMovie(Number(movieId));

  // Extract movie from response
  const movie = movieResponse?.result;

  // Transform showtimes data using useMemo
  const showtimes = useMemo(() => {
    if (!showtimesResponse?.result) return [];
    return transformShowtimesResponse(showtimesResponse.result);
  }, [showtimesResponse]);

  // Convert to old format for utility functions
  const oldFormatShowtimes = useMemo(() => {
    return showtimes.map(convertToOldShowtimeFormat);
  }, [showtimes]);

  // State for schedule data
  const [scheduleData, setScheduleData] = useState<SchedulePerDay[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (oldFormatShowtimes.length > 0) {
      // Convert showtimes to schedule format
      const schedulePerDay = convertShowtimesToSchedulePerDay(oldFormatShowtimes);
      setScheduleData(schedulePerDay);

      // Get available dates
      const dates = getAvailableDatesFromShowtimes(oldFormatShowtimes);
      setAvailableDates(dates);

      // Set default selected date
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    } else {
      setScheduleData([]);
      setAvailableDates([]);
      setSelectedDate(null);
    }
  }, [oldFormatShowtimes]);

  const scheduleForSelectedDay = scheduleData.find((d) => d.date === selectedDate);

  const handleShowtimeSelection = (showtime: { time: string; format: string }) => {
    if (selectedDate && movie) {
      navigate("/booking", {
        state: {
          movie: {
            id: movie.id,
            posterUrl: movie.poster,
            title: movie.name, // Use 'name' from new interface
            genres: movie.categories ? movie.categories.map((cat) => cat.name ?? "") : [],
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
        <div className="flex items-center justify-center py-20">
          <div className="text-xl text-white">Đang tải thông tin phim...</div>
        </div>
      </UserLayout>
    );
  }

  // Error state
  if (error || showtimesError || !movie) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-xl text-red-500">{showtimesError ? "Không tải được lịch chiếu" : "Không tìm thấy thông tin phim"}</div>
        </div>
      </UserLayout>
    );
  }

  const embedUrl = movie.trailer && getYouTubeId(movie.trailer) ? `https://www.youtube.com/embed/${getYouTubeId(movie.trailer)}?autoplay=0` : "";

  return (
    <UserLayout>
      <div className="bg-gray-50 py-10">
        <div className="mx-auto max-w-6xl px-4">
          {/* Breadcrumbs */}
          <div className="breadcrumbs mb-6 text-sm">
            <ul>
              <li>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="cursor-pointer border-none bg-transparent p-0 text-current hover:underline"
                >
                  Trang chủ
                </button>
              </li>
              <li className="font-semibold">{movie.name}</li>
            </ul>
          </div>

          {/* Movie Details */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-3">
              <img src={movie.poster} alt={movie.name ?? "Movie poster"} className="h-auto w-full rounded-lg shadow-lg" />
            </div>
            <div className="md:col-span-9">
              <h1 className="mb-4 text-3xl font-bold text-red-600">{movie.name}</h1>
              <div className="space-y-2">
                <MovieInfoItem label="Đạo diễn" value={movie.director ?? "Đang cập nhật"} />
                <MovieInfoItem label="Diễn viên" value={movie.actor ?? "Đang cập nhật"} />
                <MovieInfoItem
                  label="Thể loại"
                  value={movie.categories && movie.categories.length > 0 ? movie.categories.map((cat) => cat.name).join(", ") : "Đang cập nhật"}
                />
                <MovieInfoItem label="Thời lượng" value={`${movie.duration ?? 0} phút`} />
                <MovieInfoItem label="Studio" value={movie.studio ?? "Đang cập nhật"} />
                <MovieInfoItem label="Giới hạn tuổi" value={movie.ageRestrict ? `${movie.ageRestrict}+` : "Đang cập nhật"} />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-700">{movie.description ?? "Chưa có mô tả"}</p>
            </div>
          </div>

          {/* Showtimes */}
          <div className="mt-12 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">LỊCH CHIẾU</h2>
            {availableDates.length > 0 ? (
              <>
                <ShowDateSelector dates={availableDates} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                <ShowtimesGroup scheduleForDay={scheduleForSelectedDay} onSelectShowtime={handleShowtimeSelection} />
              </>
            ) : (
              <div className="py-8 text-center text-gray-500">Hiện tại chưa có lịch chiếu cho phim này</div>
            )}
          </div>

          {/* Trailer Section */}
          {movie.trailer && (
            <div className="mt-12">
              <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">TRAILER</h2>
              <div className="aspect-video overflow-hidden rounded-lg bg-black shadow-lg">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title="Trailer"
                    style={{ border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  ></iframe>
                ) : (
                  <div className="py-20 text-center text-white">Không thể phát trailer.</div>
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
