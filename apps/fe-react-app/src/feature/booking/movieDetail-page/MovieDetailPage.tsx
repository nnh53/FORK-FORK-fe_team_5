// ✅ File: src/feature/movie/MovieDetailPage.tsx

import pTagImage from "@/assets/pTag.png";
import ShowDateSelector from "@/feature/booking/components/ShowDateSelector/ShowDateSelector";
import ShowtimesGroup from "@/feature/booking/components/ShowtimesGroup/ShowtimesGroup";
import type { SchedulePerDay } from "@/feature/booking/components/ShowtimesModal/ShowtimesModal";
import UserLayout from "@/layouts/userLayout/UserLayout";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const movieData = {
  id: "doraemon-2025",
  posterUrl: "https://files.betacorp.vn/media%2fimages%2f2024%2f05%2f23%2fdoraemon-nobita-va-ban-giao-huong-dia-cau-1716453999903.jpg",
  title: "Doraemon: Nobita và Cuộc Phiêu Lưu Vào Thế Giới Trong Tranh",
  description:
    "Thông qua món bảo bối của Doraemon, cả nhóm bạn bước thế giới trong một bức tranh với sông và núi. Doraemon và Nobita đã gặp một cô bé tên Sphia hiền lành, xinh đẹp, dễ mến...",
  director: "Yukiyo Teramoto",
  actors: "Wasabi Mizuta, Megumi Ohara, Yumi Kakazu, Subaru Kimura, Tomokazu Seki...",
  genres: ["Hoạt Hình", "Phiêu Lưu"],
  duration: "107 phút",
  language: "Tiếng Nhật",
  ageRating: "P",
  trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
};

const mockScheduleData: SchedulePerDay[] = [
  {
    date: "2025-06-13",
    showtimes: [
      { time: "14:00", availableSeats: 50, format: "2D Phụ đề" },
      {
        time: "17:00",
        availableSeats: 30,
        format: "2D Phụ đề",
      },
    ],
  },
  { date: "2025-06-14", showtimes: [{ time: "15:00", availableSeats: 45, format: "2D Phụ đề" }] },
  { date: "2025-06-15", showtimes: [{ time: "17:00", availableSeats: 12, format: "2D Phụ đề" }] },
  { date: "2025-06-16", showtimes: [{ time: "18:00", availableSeats: 60, format: "2D Phụ đề" }] },
  { date: "2025-06-17", showtimes: [{ time: "19:00", availableSeats: 25, format: "2D Phụ đề" }] },
];

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
  const [selectedDate, setSelectedDate] = useState<string | null>(mockScheduleData[0]?.date || null);
  const navigate = useNavigate();

  const scheduleForSelectedDay = mockScheduleData.find((d) => d.date === selectedDate);
  const availableDates = mockScheduleData.map((s) => s.date);

  const handleShowtimeSelection = (showtime: { time: string; format: string }) => {
    if (selectedDate) {
      navigate("/booking", {
        state: {
          movie: {
            id: movieData.id,
            posterUrl: movieData.posterUrl,
            title: movieData.title,
            genres: movieData.genres,
            duration: movieData.duration,
            ageBadgeUrl: pTagImage,
            trailerUrl: movieData.trailerUrl,
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

  const embedUrl = getYouTubeId(movieData.trailerUrl) ? `https://www.youtube.com/embed/${getYouTubeId(movieData.trailerUrl)}?autoplay=0` : "";

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
              <li className="font-semibold">{movieData.title}</li>
            </ul>
          </div>

          {/* Movie Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-3">
              <img src={movieData.posterUrl} alt={movieData.title} className="w-full h-auto rounded-lg shadow-lg" />
            </div>
            <div className="md:col-span-9">
              <h1 className="text-3xl font-bold text-red-600 mb-4">{movieData.title}</h1>
              <div className="space-y-2">
                <MovieInfoItem label="Đạo diễn" value={movieData.director} />
                <MovieInfoItem label="Diễn viên" value={movieData.actors} />
                <MovieInfoItem label="Thể loại" value={movieData.genres} />
                <MovieInfoItem label="Thời lượng" value={movieData.duration} />
                <MovieInfoItem label="Ngôn ngữ" value={movieData.language} />
                <MovieInfoItem label="Rated" value={movieData.ageRating} />
              </div>
              <p className="mt-4 text-sm text-gray-700 leading-relaxed">{movieData.description}</p>
            </div>
          </div>

          {/* Showtimes */}
          <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">LỊCH CHIẾU</h2>
            <ShowDateSelector dates={availableDates} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            <ShowtimesGroup scheduleForDay={scheduleForSelectedDay} onSelectShowtime={handleShowtimeSelection} />
          </div>

          {/* Trailer Section */}
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
        </div>
      </div>
    </UserLayout>
  );
};

export default MovieDetailPage;
