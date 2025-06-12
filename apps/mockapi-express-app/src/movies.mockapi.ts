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

export interface Movie {
  id: string;
  title: string;
  genre: string;
  director: string;
  releaseYear: number;
  productionCompany: string;
  duration: number; // in minutes
  rating: number; // 1-10
  description: string;
  poster: string;
  status: Status;
  version: Version;
  createdAt: string;
  updatedAt: string;
}

export const moviesMockData: Movie[] = [
  {
    id: "1",
    title: "The Shawshank Redemption",
    genre: "Drama",
    director: "Frank Darabont",
    releaseYear: 1994,
    productionCompany: "Castle Rock Entertainment",
    duration: 142,
    rating: 9.3,
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster: "https://example.com/shawshank.jpg",
    status: Status.ACTIVE,
    version: Version.TWO_D,
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    title: "The Godfather",
    genre: "Crime",
    director: "Francis Ford Coppola",
    releaseYear: 1972,
    productionCompany: "Paramount Pictures",
    duration: 175,
    rating: 9.2,
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster: "https://example.com/godfather.jpg",
    status: Status.ACTIVE,
    version: Version.TWO_D,
    createdAt: "2024-03-15T11:00:00Z",
    updatedAt: "2024-03-15T11:00:00Z",
  },
  {
    id: "3",
    title: "Pulp Fiction",
    genre: "Crime",
    director: "Quentin Tarantino",
    releaseYear: 1994,
    productionCompany: "Miramax Films",
    duration: 154,
    rating: 8.9,
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster: "https://example.com/pulp-fiction.jpg",
    status: Status.ACTIVE,
    version: Version.TWO_D,
    createdAt: "2024-03-15T12:00:00Z",
    updatedAt: "2024-03-15T12:00:00Z",
  },
  {
    id: "4",
    title: "The Dark Knight",
    genre: "Action",
    director: "Christopher Nolan",
    releaseYear: 2008,
    productionCompany: "Warner Bros. Pictures",
    duration: 152,
    rating: 9.0,
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster: "https://example.com/dark-knight.jpg",
    status: Status.ACTIVE,
    version: Version.IMAX,
    createdAt: "2024-03-15T13:00:00Z",
    updatedAt: "2024-03-15T13:00:00Z",
  },
  {
    id: "5",
    title: "Inception",
    genre: "Sci-Fi",
    director: "Christopher Nolan",
    releaseYear: 2010,
    productionCompany: "Warner Bros. Pictures",
    duration: 148,
    rating: 8.8,
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster: "https://example.com/inception.jpg",
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
