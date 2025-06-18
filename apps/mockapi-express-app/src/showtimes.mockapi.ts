export interface Showtime {
  id: string;
  movieId: string;
  cinemaRoomId: string;
  date: string;
  startTime: string;
  endTime: string;
  format: string;
  availableSeats: number;
  price: number;
}

export const showtimesMockData: Showtime[] = [
  // Avatar: The Way of Water (movie id: "1")
  {
    id: "st-1-1",
    movieId: "1",
    cinemaRoomId: "1",
    date: "2025-06-16",
    startTime: "10:00",
    endTime: "13:12",
    format: "3D Phụ đề",
    availableSeats: 50,
    price: 120000,
  },
  {
    id: "st-1-2",
    movieId: "1",
    cinemaRoomId: "2",
    date: "2025-06-16",
    startTime: "14:30",
    endTime: "17:42",
    format: "3D Phụ đề",
    availableSeats: 30,
    price: 150000,
  },
  {
    id: "st-1-3",
    movieId: "1",
    cinemaRoomId: "1",
    date: "2025-06-16",
    startTime: "19:00",
    endTime: "22:12",
    format: "3D Phụ đề",
    availableSeats: 45,
    price: 120000,
  },
  {
    id: "st-1-4",
    movieId: "1",
    cinemaRoomId: "2",
    date: "2025-06-17",
    startTime: "15:00",
    endTime: "18:12",
    format: "3D Phụ đề",
    availableSeats: 60,
    price: 150000,
  },
  {
    id: "st-1-5",
    movieId: "1",
    cinemaRoomId: "3",
    date: "2025-06-17",
    startTime: "20:30",
    endTime: "23:42",
    format: "3D Phụ đề",
    availableSeats: 25,
    price: 180000,
  },

  // Top Gun: Maverick (movie id: "2")
  {
    id: "st-2-1",
    movieId: "2",
    cinemaRoomId: "1",
    date: "2025-06-16",
    startTime: "11:00",
    endTime: "13:11",
    format: "IMAX 2D",
    availableSeats: 40,
    price: 140000,
  },
  {
    id: "st-2-2",
    movieId: "2",
    cinemaRoomId: "2",
    date: "2025-06-16",
    startTime: "15:00",
    endTime: "17:11",
    format: "IMAX 2D",
    availableSeats: 35,
    price: 170000,
  },
  {
    id: "st-2-3",
    movieId: "2",
    cinemaRoomId: "3",
    date: "2025-06-16",
    startTime: "20:00",
    endTime: "22:11",
    format: "IMAX 2D",
    availableSeats: 20,
    price: 200000,
  },
  {
    id: "st-2-4",
    movieId: "2",
    cinemaRoomId: "1",
    date: "2025-06-17",
    startTime: "12:30",
    endTime: "14:41",
    format: "IMAX 2D",
    availableSeats: 55,
    price: 140000,
  },

  // Dune: Part Two (movie id: "3")
  {
    id: "st-3-1",
    movieId: "3",
    cinemaRoomId: "2",
    date: "2025-06-16",
    startTime: "13:30",
    endTime: "16:16",
    format: "IMAX 2D",
    availableSeats: 30,
    price: 170000,
  },
  {
    id: "st-3-2",
    movieId: "3",
    cinemaRoomId: "3",
    date: "2025-06-16",
    startTime: "18:00",
    endTime: "20:46",
    format: "IMAX 2D",
    availableSeats: 15,
    price: 200000,
  },
  {
    id: "st-3-3",
    movieId: "3",
    cinemaRoomId: "1",
    date: "2025-06-17",
    startTime: "16:30",
    endTime: "19:16",
    format: "IMAX 2D",
    availableSeats: 65,
    price: 140000,
  },

  // Spider-Man: No Way Home (movie id: "4")
  {
    id: "st-4-1",
    movieId: "4",
    cinemaRoomId: "1",
    date: "2025-06-16",
    startTime: "16:00",
    endTime: "18:28",
    format: "3D Lồng tiếng",
    availableSeats: 25,
    price: 120000,
  },
  {
    id: "st-4-2",
    movieId: "4",
    cinemaRoomId: "2",
    date: "2025-06-16",
    startTime: "19:30",
    endTime: "21:58",
    format: "3D Lồng tiếng",
    availableSeats: 40,
    price: 150000,
  },
  {
    id: "st-4-3",
    movieId: "4",
    cinemaRoomId: "3",
    date: "2025-06-17",
    startTime: "14:00",
    endTime: "16:28",
    format: "3D Lồng tiếng",
    availableSeats: 18,
    price: 180000,
  },

  // The Batman (movie id: "5")
  {
    id: "st-5-1",
    movieId: "5",
    cinemaRoomId: "3",
    date: "2025-06-16",
    startTime: "12:00",
    endTime: "14:56",
    format: "IMAX 2D",
    availableSeats: 22,
    price: 200000,
  },
  {
    id: "st-5-2",
    movieId: "5",
    cinemaRoomId: "1",
    date: "2025-06-16",
    startTime: "17:00",
    endTime: "19:56",
    format: "IMAX 2D",
    availableSeats: 38,
    price: 140000,
  },
  {
    id: "st-5-3",
    movieId: "5",
    cinemaRoomId: "2",
    date: "2025-06-17",
    startTime: "20:30",
    endTime: "23:26",
    format: "IMAX 2D",
    availableSeats: 45,
    price: 170000,
  },
];

// API functions
export const showtimesAPI = {
  getAll: () => showtimesMockData,

  getByMovieId: (movieId: string) => showtimesMockData.filter((showtime) => showtime.movieId === movieId),

  getByMovieIdAndDate: (movieId: string, date: string) =>
    showtimesMockData.filter((showtime) => showtime.movieId === movieId && showtime.date === date),

  getByDate: (date: string) => showtimesMockData.filter((showtime) => showtime.date === date),

  getById: (id: string) => showtimesMockData.find((showtime) => showtime.id === id),

  create: (showtimeData: Omit<Showtime, "id">) => {
    const newShowtime: Showtime = {
      ...showtimeData,
      id: `st-${Date.now()}`,
    };
    showtimesMockData.push(newShowtime);
    return newShowtime;
  },

  update: (id: string, showtimeData: Partial<Omit<Showtime, "id">>) => {
    const index = showtimesMockData.findIndex((showtime) => showtime.id === id);
    if (index !== -1) {
      showtimesMockData[index] = {
        ...showtimesMockData[index],
        ...showtimeData,
      };
      return showtimesMockData[index];
    }
    return null;
  },

  delete: (id: string) => {
    const index = showtimesMockData.findIndex((showtime) => showtime.id === id);
    if (index !== -1) {
      const deletedShowtime = showtimesMockData.splice(index, 1)[0];
      return deletedShowtime;
    }
    return null;
  },
};
