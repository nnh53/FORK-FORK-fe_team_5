import { useState } from 'react';

import UserLayout from '../../../layouts/userLayout/UserLayout.tsx';
import Carousel from '../../../components/shared/Carousel/Carousel.tsx';
import MovieList from '../../../components/movie/MovieList/MovieList.tsx';
import ShowtimesModal from '../components/ShowtimesModal/ShowtimesModal.tsx';
import TicketConfirmModal from '../components/TicketConfirmModal/TicketConfirmModal.tsx';

import type { SchedulePerDay } from '../components/ShowtimesModal/ShowtimesModal.tsx';
import type { MovieCardProps } from '../../../components/movie/MovieCard/MovieCard.tsx';
import { useNavigate } from 'react-router-dom';

// 1. MOCK DATA PHIM
const mockMovies: MovieCardProps[] = [
  {
    id: '1',
    posterUrl: 'https://files.betacorp.vn/media%2fimages%2f2025%2f05%2f18%2fbeta%2D400x633%2D192849%2D180525%2D39.png',
    title: 'Dune: Part Two',
    genres: ['Hành động', 'Khoa học viễn tưởng'],
    duration: '165 phút',
    isHot: true,
    ageBadgeUrl: '/src/assets/p.png',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
  },
  {
    id: '2',
    posterUrl: 'https://files.betacorp.vn/media%2fimages%2f2025%2f05%2f18%2fbeta%2D400x633%2D192849%2D180525%2D39.png',
    title: 'Anyone But You',
    genres: ['Tình cảm', 'Hài hước'],
    duration: '103 phút',
    isHot: false,
    ageBadgeUrl: '/src/assets/p.png',
    trailerUrl: 'https://www.youtube.com/watch?v=EkqY-Z0TyHM',
  },
  {
    id: '3',
    posterUrl: 'https://files.betacorp.vn/media%2fimages%2f2025%2f05%2f18%2fbeta%2D400x633%2D192849%2D180525%2D39.png',
    title: 'The Marvels',
    genres: ['Hành động', 'Khoa học viễn tưởng'],
    duration: '105 phút',
    isHot: false,
    ageBadgeUrl: '/src/assets/p.png',
    trailerUrl: 'https://www.youtube.com/watch?v=wS_qbDztgVY',
  },
  {
    id: '4',
    posterUrl: 'https://files.betacorp.vn/media%2fimages%2f2025%2f05%2f18%2fbeta%2D400x633%2D192849%2D180525%2D39.png',
    title: 'Love Again',
    genres: ['Tình cảm', 'Hài hước'],
    duration: '104 phút',
    isHot: false,
    ageBadgeUrl: '/src/assets/p.png',
    trailerUrl: 'https://www.youtube.com/watch?v=2QL7mNGt3CA',
  },
  {
    id: '5',
    posterUrl: 'https://files.betacorp.vn/media%2fimages%2f2025%2f05%2f18%2fbeta%2D400x633%2D192849%2D180525%2D39.png',
    title: 'Transformers: Rise of the Beasts',
    genres: ['Hành động', 'Khoa học viễn tưởng'],
    duration: '127 phút',
    isHot: false,
    ageBadgeUrl: '/src/assets/p.png',
    trailerUrl: 'https://www.youtube.com/watch?v=itnqEauWQZM',
  },
  {
    id: '6',
    posterUrl: 'https://files.betacorp.vn/media%2fimages%2f2025%2f05%2f18%2fbeta%2D400x633%2D192849%2D180525%2D39.png',
    title: 'No Hard Feelings',
    genres: ['Tình cảm', 'Hài hước'],
    duration: '103 phút',
    isHot: true,
    ageBadgeUrl: '/src/assets/p.png',
    trailerUrl: 'https://www.youtube.com/watch?v=P15S6ND8kbQ',
  },
  {
    id: '7',
    posterUrl: 'https://files.betacorp.vn/media%2fimages%2f2025%2f05%2f18%2fbeta%2D400x633%2D192849%2D180525%2D39.png',
    title: 'Avatar: The Way of Water',
    genres: ['Hành động', 'Khoa học viễn tưởng'],
    duration: '192 phút',
    isHot: false,
    ageBadgeUrl: '/src/assets/p.png',
    trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
  },
  {
    id: '8',
    posterUrl: 'https://files.betacorp.vn/media%2fimages%2f2025%2f05%2f18%2fbeta%2D400x633%2D192849%2D180525%2D39.png',
    title: 'Your Place or Mine',
    genres: ['Tình cảm', 'Hài hước'],
    duration: '109 phút',
    isHot: false,
    ageBadgeUrl: '/src/assets/p.png',
    trailerUrl: 'https://www.youtube.com/watch?v=Y8DAi0H-V1I',
  },
  {
    id: '9',
    posterUrl: 'https://files.betacorp.vn/media%2fimages%2f2025%2f05%2f18%2fbeta%2D400x633%2D192849%2D180525%2D39.png',
    title: 'The Creator',
    genres: ['Hành động', 'Khoa học viễn tưởng'],
    duration: '133 phút',
    isHot: false,
    ageBadgeUrl: '/src/assets/p.png',
    trailerUrl: 'https://www.youtube.com/watch?v=ex3C1-5Dhb8',
  },
  {
    id: '10',
    posterUrl: 'https://files.betacorp.vn/media%2fimages%2f2025%2f05%2f18%2fbeta%2D400x633%2D192849%2D180525%2D39.png',
    title: 'The Perfect Find',
    genres: ['Tình cảm', 'Hài hước'],
    duration: '99 phút',
    isHot: false,
    ageBadgeUrl: '/src/assets/p.png',
    trailerUrl: 'https://www.youtube.com/watch?v=DRNRNks2CE0',
  },
  {
    id: '11',
    posterUrl: 'https://files.betacorp.vn/media%2fimages%2f2025%2f05%2f18%2fbeta%2D400x633%2D192849%2D180525%2D39.png',
    title: 'The Matrix Resurrections',
    genres: ['Hành động', 'Khoa học viễn tưởng'],
    duration: '148 phút',
    isHot: true,
    ageBadgeUrl: '/src/assets/p.png',
    trailerUrl: 'https://www.youtube.com/watch?v=9ix7TUGVYIo',
  },
  {
    id: '12',
    posterUrl: 'https://files.betacorp.vn/media%2fimages%2f2025%2f05%2f18%2fbeta%2D400x633%2D192849%2D180525%2D39.png',
    title: 'Ticket to Paradise',
    genres: ['Tình cảm', 'Hài hước'],
    duration: '104 phút',
    isHot: false,
    ageBadgeUrl: '/src/assets/p.png',
    trailerUrl: 'https://www.youtube.com/watch?v=hkP4tVTdsz8',
  },
  {
    id: '13',
    posterUrl: 'https://files.betacorp.vn/media%2fimages%2f2025%2f05%2f18%2fbeta%2D400x633%2D192849%2D180525%2D39.png',
    title: 'Ready Player One',
    genres: ['Hành động', 'Khoa học viễn tưởng'],
    duration: '140 phút',
    isHot: false,
    ageBadgeUrl: '/src/assets/p.png',
    trailerUrl: 'https://www.youtube.com/watch?v=cSp1dM2Vj48',
  },
  {
    id: '14',
    posterUrl: 'https://files.betacorp.vn/media%2fimages%2f2025%2f05%2f18%2fbeta%2D400x633%2D192849%2D180525%2D39.png',
    title: 'Marry Me',
    genres: ['Tình cảm', 'Hài hước'],
    duration: '112 phút',
    isHot: false,
    ageBadgeUrl: '/src/assets/p.png',
    trailerUrl: 'https://www.youtube.com/watch?v=Ebv9_rNb5Ig',
  },
];

// 2. MOCK DATA LỊCH CHIẾU
const mockScheduleData: SchedulePerDay[] = [
  {
    date: '2025-06-09',
    showtimes: [
      { time: '09:30', availableSeats: 50, format: '2D Phụ đề' },
      { time: '11:45', availableSeats: 30, format: '2D Phụ đề' },
      { time: '14:00', availableSeats: 45, format: '2D Phụ đề' },
      { time: '16:15', availableSeats: 12, format: '3D Lồng tiếng' },
      { time: '19:00', availableSeats: 60, format: '3D Lồng tiếng' },
      { time: '21:30', availableSeats: 25, format: 'IMAX 3D' },
    ],
  },
  {
    date: '2025-06-10',
    showtimes: [
      { time: '10:00', availableSeats: 55, format: '2D Phụ đề' },
      { time: '13:15', availableSeats: 20, format: '2D Phụ đề' },
      { time: '17:00', availableSeats: 3, format: '3D Lồng tiếng' },
      { time: '20:45', availableSeats: 40, format: 'IMAX 3D' },
    ],
  },
  {
    date: '2025-06-11',
    showtimes: [
      { time: '09:00', availableSeats: 0, format: '2D Phụ đề' },
      { time: '12:00', availableSeats: 18, format: '2D Phụ đề' },
      { time: '15:30', availableSeats: 33, format: '3D Lồng tiếng' },
      { time: '20:00', availableSeats: 28, format: 'IMAX 3D' },
    ],
  },
];

interface FinalSelection {
  date: string;
  time: string;
  format: string;
}

function HomePage() {
  const navigate = useNavigate();

  const movieBaner: string[] = [
    'https://weliveentertainment.com/wp-content/uploads/2025/04/minecraft-movie-banner.png',
    'https://files.betacorp.vn/media/images/2025/06/04/1702x621-13-104719-040625-85.png',
  ];

  const [isShowtimesModalOpen, setIsShowtimesModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieCardProps | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [finalSelection, setFinalSelection] = useState<FinalSelection | null>(null);

  const handleBuyTicketClick = (movie: MovieCardProps) => {
    setSelectedMovie(movie);
    setIsShowtimesModalOpen(true);
  };

  const handleCloseShowtimesModal = () => {
    setIsShowtimesModalOpen(false);
    setSelectedMovie(null);
  };

  const handleFinalShowtimeSelect = (selected: FinalSelection) => {
    setFinalSelection(selected);
    setIsShowtimesModalOpen(false);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmBooking = () => {
    setIsConfirmModalOpen(false); // Đóng modal xác nhận

    // Điều hướng đến trang chọn ghế và truyền dữ liệu qua state
    navigate('/booking', {
      state: {
        movie: selectedMovie,
        selection: finalSelection,
        cinemaName: 'F-CINEMA', // Có thể truyền thêm các thông tin khác
      },
    });

    // Reset state sau khi điều hướng để chuẩn bị cho lần đặt vé tiếp theo
    setSelectedMovie(null);
    setFinalSelection(null);
  };

  return (
    <UserLayout background={'https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg'}>
      <Carousel autoplayInterval={2000} images={movieBaner} height={'600px'} />
      <div className="flex w-full items-center my-12" aria-hidden="true">
        <div className="h-px flex-grow bg-amber-50"></div>

        <h2 className="px-6 text-center text-4xl md:text-5xl font-bold tracking-wider">PHIM MỚI</h2>

        <div className="h-px flex-grow bg-amber-50"></div>
      </div>
      <MovieList horizontal={true} movies={mockMovies} cardsPerRow={4} onMovieBuyTicketClick={handleBuyTicketClick} />

      <div className="flex w-full items-center my-12" aria-hidden="true">
        <div className="h-px flex-grow bg-amber-50"></div>

        <h2 className="px-6 text-center text-4xl md:text-5xl font-bold tracking-wider">PHIM SẮP CHIẾU</h2>

        <div className="h-px flex-grow bg-amber-50"></div>
      </div>
      <MovieList horizontal={true} movies={mockMovies} cardsPerRow={4} onMovieBuyTicketClick={handleBuyTicketClick} />

      {selectedMovie && (
        <ShowtimesModal
          isOpen={isShowtimesModalOpen}
          onClose={handleCloseShowtimesModal}
          movieTitle={selectedMovie.title}
          cinemaName="F-CINEMA"
          scheduleData={mockScheduleData}
          onSelectShowtime={handleFinalShowtimeSelect}
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
    </UserLayout>
  );
}

export default HomePage;
