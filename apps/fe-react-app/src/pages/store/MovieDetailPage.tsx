// ✅ File: src/feature/movie/MovieDetailPage.tsx

import { Lens } from "@/components/magicui/lens";
import ShowDateSelector from "@/feature/booking/components/ShowDateSelector/ShowDateSelector";
import ShowtimesGroup from "@/feature/booking/components/ShowtimesGroup/ShowtimesGroup";
import type { SchedulePerDay } from "@/feature/booking/components/ShowtimesModal/ShowtimesModal";
import type { Showtime as NewShowtime } from "@/interfaces/showtime.interface";
import type { UIShowtime as OldShowtime } from "@/interfaces/staff-sales.interface";
import { queryMovie } from "@/services/movieService";
import { queryShowtimesByMovie, transformShowtimesResponse } from "@/services/showtimeService";
import { getYouTubeEmbedUrl } from "@/utils/movie.utils";
import { convertShowtimesToSchedulePerDay, getAvailableDatesFromShowtimes } from "@/utils/showtime.utils";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Convert new Showtime format to old format for utility functions
const convertToOldShowtimeFormat = (newShowtime: NewShowtime): OldShowtime => {
  const showDate = new Date(newShowtime.showDateTime);
  const endDate = new Date(newShowtime.endDateTime);

  return {
    id: newShowtime.id.toString(),
    movieId: newShowtime.movieId,
    cinemaRoomId: newShowtime.roomId?.toString() ?? "1",
    date: showDate.toICTISOString().split("T")[0], // Format: YYYY-MM-DD
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
  const { data: movieResponse, isLoading, error } = queryMovie(Number(movieId));

  // Use React Query to fetch showtimes for this movie
  const { data: showtimesResponse, isLoading: showtimesLoading, error: showtimesError } = queryShowtimesByMovie(Number(movieId));

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
      // Filter out past showtimes
      const now = new Date();
      const today = now.toICTISOString().split("T")[0]; // YYYY-MM-DD format
      const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight

      const futureShowtimes = oldFormatShowtimes.filter((showtime) => {
        const showtimeDate = showtime.date;

        // If showtime is in the future (not today), include it
        if (showtimeDate > today) {
          return true;
        }

        // If showtime is today, check if the time hasn't passed
        if (showtimeDate === today) {
          const [hours, minutes] = showtime.startTime.split(":").map(Number);
          const showtimeMinutes = hours * 60 + minutes;
          return showtimeMinutes > currentTime;
        }

        // If showtime is in the past, exclude it
        return false;
      });

      // Convert filtered showtimes to schedule format
      const schedulePerDay = convertShowtimesToSchedulePerDay(futureShowtimes);
      setScheduleData(schedulePerDay);

      // Get available dates from filtered showtimes
      const dates = getAvailableDatesFromShowtimes(futureShowtimes);
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

  const handleShowtimeSelection = (showtime: { time: string; format: string; showtimeId: string; roomId: string }) => {
    if (selectedDate && movie) {
      navigate("/booking", {
        state: {
          movie: {
            id: movie.id,
            posterUrl: movie.poster,
            title: movie.name, // Use 'name' from new interface
            genres: movie.categories ? movie.categories.map((cat) => cat.name ?? "") : [],
            duration: `${movie.duration ?? 0} phút`,
            trailerUrl: movie.trailer, // Use 'trailer' from new interface
          },
          selection: {
            date: selectedDate,
            time: showtime.time,
            format: showtime.format,
            showtimeId: showtime.showtimeId,
            roomId: showtime.roomId,
          },
          cinemaName: "FCinema",
        },
      });
    }
  };

  // Loading state
  if (isLoading || showtimesLoading) {
    return (
      <div>
        <div className="flex items-center justify-center py-20">
          <div className="text-xl text-white">Đang tải thông tin phim...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || showtimesError || !movie) {
    return (
      <div>
        <div className="flex items-center justify-center py-20">
          <div className="text-xl text-red-500">{showtimesError ? "Không tải được lịch chiếu" : "Không tìm thấy thông tin phim"}</div>
        </div>
      </div>
    );
  }

  const embedUrl = movie.trailer ? getYouTubeEmbedUrl(movie.trailer, { autoplay: false, rel: false }) : null;

  // Debug log để kiểm tra trailer URL
  console.log("Trailer URL:", movie.trailer);
  console.log("Embed URL:", embedUrl);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-100">
      {/* Hero Background Section */}
      <div className="relative min-h-[80vh] overflow-hidden py-16">
        {/* Background Image */}
        {movie.banner && <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${movie.banner})` }} />}
        {/* Fallback gradient background if no banner */}
        <div className={`absolute inset-0 ${movie.banner ? "bg-black/60" : "bg-gradient-to-r from-gray-900 via-red-900/50 to-gray-900"}`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>

        <div className="relative mx-auto max-w-7xl px-6">
          {/* Breadcrumbs */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="group flex items-center rounded-md px-3 py-2 text-gray-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v6l6-3-6-3z" />
                  </svg>
                  Trang chủ
                </button>
              </li>
              <li className="text-gray-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>
              <li className="font-medium text-white">{movie.name}</li>
            </ol>
          </nav>

          {/* Movie Main Content */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Movie Poster */}
            <div className="lg:col-span-4">
              <div className="group relative overflow-hidden rounded-2xl bg-white/20 p-3 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/25">
                <Lens>
                  <img src={movie.poster} alt={movie.name ?? "Movie poster"} className="h-auto w-full rounded-xl object-cover shadow-xl" />
                </Lens>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                {/* Floating rating badge if available */}
                {movie.ageRestrict && (
                  <div className="absolute top-6 right-6 rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white shadow-lg backdrop-blur-sm">
                    {movie.ageRestrict}+
                  </div>
                )}
              </div>
            </div>

            {/* Movie Details */}
            <div className="lg:col-span-8">
              <div className="space-y-8">
                {/* Title and Rating */}
                <div className="space-y-6">
                  <h1 className="bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-4xl font-bold text-transparent drop-shadow-2xl lg:text-6xl">
                    {movie.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4">
                    {movie.duration && (
                      <span className="rounded-full border border-white/20 bg-white/25 px-5 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md">
                        <svg className="mr-2 inline h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {movie.duration} phút
                      </span>
                    )}
                    {movie.categories && movie.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {movie.categories.slice(0, 3).map((category, index) => (
                          <span
                            key={index}
                            className="rounded-full border border-red-500/50 bg-red-600/90 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-sm"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-2xl border border-white/10 bg-black/30 p-8 shadow-2xl backdrop-blur-md">
                  <h3 className="mb-4 text-xl font-semibold text-white">Nội dung phim</h3>
                  <p className="text-lg leading-relaxed text-gray-100">{movie.description ?? "Chưa có mô tả"}</p>
                </div>

                {/* Movie Information Details - Only on Desktop */}
                <div className="hidden rounded-2xl border border-white/10 bg-black/25 p-8 shadow-2xl backdrop-blur-md lg:block">
                  <h3 className="mb-6 text-xl font-semibold text-white">Thông tin chi tiết</h3>
                  <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col">
                      <dt className="text-sm font-medium text-gray-300">Đạo diễn</dt>
                      <dd className="mt-1 text-base text-white">{movie.director ?? "Đang cập nhật"}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-sm font-medium text-gray-300">Studio</dt>
                      <dd className="mt-1 text-base text-white">{movie.studio ?? "Đang cập nhật"}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-sm font-medium text-gray-300">Diễn viên</dt>
                      <dd className="mt-1 text-base text-white">{movie.actor ?? "Đang cập nhật"}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-sm font-medium text-gray-300">Giới hạn tuổi</dt>
                      <dd className="mt-1 text-base text-white">{movie.ageRestrict ? `${movie.ageRestrict}+` : "Đang cập nhật"}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Details Section - Mobile Only */}
      <div className="bg-white py-12 lg:hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Thông tin chi tiết</h2>
            <div className="mx-auto h-0.5 w-16 bg-red-600"></div>
          </div>

          <div className="mx-auto max-w-2xl">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
              <dl className="divide-y divide-gray-100">
                <div className="flex items-center border-b border-gray-100 py-3 last:border-b-0">
                  <dt className="w-28 min-w-0 text-sm font-medium text-gray-600">Đạo diễn:</dt>
                  <dd className="flex-1 text-sm text-gray-900">{movie.director ?? "Đang cập nhật"}</dd>
                </div>
                <div className="flex items-center border-b border-gray-100 py-3 last:border-b-0">
                  <dt className="w-28 min-w-0 text-sm font-medium text-gray-600">Diễn viên:</dt>
                  <dd className="flex-1 text-sm text-gray-900">{movie.actor ?? "Đang cập nhật"}</dd>
                </div>
                <div className="flex items-center border-b border-gray-100 py-3 last:border-b-0">
                  <dt className="w-28 min-w-0 text-sm font-medium text-gray-600">Thể loại:</dt>
                  <dd className="flex-1 text-sm text-gray-900">
                    {movie.categories && movie.categories.length > 0 ? movie.categories.map((cat) => cat.name).join(", ") : "Đang cập nhật"}
                  </dd>
                </div>
                <div className="flex items-center border-b border-gray-100 py-3 last:border-b-0">
                  <dt className="w-28 min-w-0 text-sm font-medium text-gray-600">Thời lượng:</dt>
                  <dd className="flex-1 text-sm text-gray-900">{`${movie.duration ?? 0} phút`}</dd>
                </div>
                <div className="flex items-center border-b border-gray-100 py-3 last:border-b-0">
                  <dt className="w-28 min-w-0 text-sm font-medium text-gray-600">Studio:</dt>
                  <dd className="flex-1 text-sm text-gray-900">{movie.studio ?? "Đang cập nhật"}</dd>
                </div>
                <div className="flex items-center border-b border-gray-100 py-3 last:border-b-0">
                  <dt className="w-28 min-w-0 text-sm font-medium text-gray-600">Giới hạn tuổi:</dt>
                  <dd className="flex-1 text-sm text-gray-900">{movie.ageRestrict ? `${movie.ageRestrict}+` : "Đang cập nhật"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes Section */}
      <div className="bg-gradient-to-br from-gray-50 to-red-50/30 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-8">
              <h2 className="text-center text-3xl font-bold text-white">LỊCH CHIẾU</h2>
              <p className="mt-2 text-center text-red-100">Chọn ngày và giờ chiếu phù hợp</p>
            </div>
            <div className="p-8">
              {availableDates.length > 0 ? (
                <div className="space-y-8">
                  <ShowDateSelector dates={availableDates} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                  <ShowtimesGroup scheduleForDay={scheduleForSelectedDay} onSelectShowtime={handleShowtimeSelection} />
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-500">Hiện tại chưa có lịch chiếu cho phim này</p>
                  <p className="mt-2 text-sm text-gray-400">Vui lòng quay lại sau để cập nhật lịch chiếu mới nhất</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Section */}
      {movie.trailer && (
        <div className="bg-gray-900 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">TRAILER</h2>
              <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-red-500 to-red-600"></div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-black shadow-2xl">
              {embedUrl ? (
                <div className="aspect-video">
                  <iframe
                    src={embedUrl}
                    title={`Trailer - ${movie.name}`}
                    style={{ border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              ) : (
                <div className="flex min-h-[400px] items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="text-center text-white">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600/20">
                      <span role="img" aria-label="Warning" className="text-2xl">
                        ⚠️
                      </span>
                    </div>
                    <p className="mb-2 text-xl font-semibold">Không thể phát trailer</p>
                    <p className="mb-4 text-sm text-gray-300">URL không hợp lệ hoặc không phải YouTube link</p>
                    <div className="mb-6 rounded-lg bg-gray-800/50 p-3 font-mono text-xs break-all text-gray-400">{movie.trailer}</div>
                    <a
                      href={movie.trailer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-white transition-all duration-200 hover:scale-105 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Mở link gốc
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
