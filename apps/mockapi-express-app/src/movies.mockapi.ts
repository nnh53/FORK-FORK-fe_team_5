enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

enum Version {
  TWO_D = "2D",
  THREE_D = "3D",
  IMAX = "IMAX",
  FOUR_DX = "4DX",
}

interface Genre {
  id: string;
  name: string;
}

interface CinemaRoom {
  id: string;
  name: string;
}

interface Showtime {
  id: string;
  cinemaRoomId: string;
  startTime: string;
  endTime: string;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  genres?: Genre[]; // For multiple genres (checkbox)
  director: string;
  actors?: string;
  releaseYear: number;
  startShowingDate?: string;
  endShowingDate?: string;
  productionCompany: string;
  duration: number; // in minutes
  rating: number; // 1-10
  description: string;
  poster: string;
  trailerUrl?: string;
  status: Status;
  version: Version;
  showtimes?: Showtime[];
  createdAt: string;
  updatedAt: string;
}

// Mock data for genres
export const genresMockData: Genre[] = [
  { id: "1", name: "Action" },
  { id: "2", name: "Comedy" },
  { id: "3", name: "Drama" },
  { id: "4", name: "Horror" },
  { id: "5", name: "Sci-Fi" },
  { id: "6", name: "Thriller" },
  { id: "7", name: "Romance" },
  { id: "8", name: "Fantasy" },
  { id: "9", name: "Crime" },
];

// Mock data for cinema rooms
export const cinemaRoomsMockData: CinemaRoom[] = [
  { id: "1", name: "Room A" },
  { id: "2", name: "Room B" },
  { id: "3", name: "Room C" },
  { id: "4", name: "Room D" },
  { id: "5", name: "VIP Room" },
];

export const moviesMockData: Movie[] = [
  {
    id: "1",
    title: "The Shawshank Redemption",
    genre: "Drama",
    genres: [{ id: "3", name: "Drama" }],
    director: "Frank Darabont",
    actors: "Tim Robbins, Morgan Freeman, Bob Gunton",
    releaseYear: 1994,
    startShowingDate: "2024-06-01",
    endShowingDate: "2024-07-01",
    productionCompany: "Castle Rock Entertainment",
    duration: 142,
    rating: 9.3,
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster: "https://example.com/shawshank.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=6hB3S9bIaco",
    status: Status.ACTIVE,
    version: Version.TWO_D,
    showtimes: [
      { id: "1", cinemaRoomId: "1", startTime: "2024-06-01T10:00:00Z", endTime: "2024-06-01T12:22:00Z" },
      { id: "2", cinemaRoomId: "2", startTime: "2024-06-01T14:00:00Z", endTime: "2024-06-01T16:22:00Z" },
    ],
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    title: "The Godfather",
    genre: "Crime",
    genres: [{ id: "9", name: "Crime" }],
    director: "Francis Ford Coppola",
    actors: "Marlon Brando, Al Pacino, James Caan",
    releaseYear: 1972,
    startShowingDate: "2024-06-15",
    endShowingDate: "2024-07-15",
    productionCompany: "Paramount Pictures",
    duration: 175,
    rating: 9.2,
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster: "https://example.com/godfather.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=sY1S34973zA",
    status: Status.ACTIVE,
    version: Version.TWO_D,
    showtimes: [{ id: "3", cinemaRoomId: "3", startTime: "2024-06-15T11:00:00Z", endTime: "2024-06-15T13:55:00Z" }],
    createdAt: "2024-03-15T11:00:00Z",
    updatedAt: "2024-03-15T11:00:00Z",
  },
  {
    id: "3",
    title: "Pulp Fiction",
    genre: "Crime",
    genres: [{ id: "9", name: "Crime" }],
    director: "Quentin Tarantino",
    actors: "John Travolta, Uma Thurman, Samuel L. Jackson",
    releaseYear: 1994,
    startShowingDate: "2024-07-01",
    endShowingDate: "2024-08-01",
    productionCompany: "Miramax Films",
    duration: 154,
    rating: 8.9,
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster: "https://example.com/pulp-fiction.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
    status: Status.ACTIVE,
    version: Version.TWO_D,
    createdAt: "2024-03-15T12:00:00Z",
    updatedAt: "2024-03-15T12:00:00Z",
  },
  {
    id: "4",
    title: "The Dark Knight",
    genre: "Action",
    genres: [{ id: "1", name: "Action" }],
    director: "Christopher Nolan",
    actors: "Christian Bale, Heath Ledger, Aaron Eckhart",
    releaseYear: 2008,
    startShowingDate: "2024-06-10",
    endShowingDate: "2024-07-10",
    productionCompany: "Warner Bros. Pictures",
    duration: 152,
    rating: 9.0,
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster: "https://example.com/dark-knight.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    status: Status.ACTIVE,
    version: Version.IMAX,
    showtimes: [
      { id: "4", cinemaRoomId: "4", startTime: "2024-06-10T18:00:00Z", endTime: "2024-06-10T20:32:00Z" },
      { id: "5", cinemaRoomId: "5", startTime: "2024-06-10T21:00:00Z", endTime: "2024-06-10T23:32:00Z" },
    ],
    createdAt: "2024-03-15T13:00:00Z",
    updatedAt: "2024-03-15T13:00:00Z",
  },
  {
    id: "5",
    title: "Inception",
    genre: "Sci-Fi",
    genres: [{ id: "5", name: "Sci-Fi" }],
    director: "Christopher Nolan",
    actors: "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page",
    releaseYear: 2010,
    startShowingDate: "2024-07-15",
    endShowingDate: "2024-08-15",
    productionCompany: "Warner Bros. Pictures",
    duration: 148,
    rating: 8.8,
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster: "https://example.com/inception.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    status: Status.INACTIVE,
    version: Version.THREE_D,
    createdAt: "2024-03-15T14:00:00Z",
    updatedAt: "2024-03-15T14:00:00Z",
  },
];

// CRUD Operations
export const moviesAPI = {
  getAll: () => moviesMockData,

  getById: (id: string) => moviesMockData.find((movie) => movie.id === id),

  create: (movieData: Omit<Movie, "id" | "createdAt" | "updatedAt">) => {
    const newMovie: Movie = {
      ...movieData,
      id: (moviesMockData.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    moviesMockData.push(newMovie);
    return newMovie;
  },

  update: (id: string, movieData: Partial<Omit<Movie, "id" | "createdAt">>) => {
    const index = moviesMockData.findIndex((movie) => movie.id === id);
    if (index !== -1) {
      moviesMockData[index] = {
        ...moviesMockData[index],
        ...movieData,
        updatedAt: new Date().toISOString(),
      };
      return moviesMockData[index];
    }
    return null;
  },

  delete: (id: string) => {
    const index = moviesMockData.findIndex((movie) => movie.id === id);
    if (index !== -1) {
      const deletedMovie = moviesMockData.splice(index, 1)[0];
      return deletedMovie;
    }
    return null;
  },
};

// API for genres
export const genresAPI = {
  getAll: () => genresMockData,
  getById: (id: string) => genresMockData.find((genre) => genre.id === id),
};

// API for cinema rooms
export const cinemaRoomsAPI = {
  getAll: () => cinemaRoomsMockData,
  getById: (id: string) => cinemaRoomsMockData.find((room) => room.id === id),
};
