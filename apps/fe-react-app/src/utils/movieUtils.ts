import pTagImage from "@/assets/pTag.png";
import type { Movie } from "../../../mockapi-express-app/src/movies.mockapi";
import type { MovieCardProps } from "../components/movie/MovieCard/MovieCard";

/**
 * Convert Movie from API to MovieCardProps for UI display
 */
export const convertMovieToMovieCard = (movie: Movie): MovieCardProps => {
  return {
    id: movie.id,
    posterUrl: movie.poster,
    title: movie.title,
    genres: movie.genres ? movie.genres.map((g) => g.name) : [movie.genre],
    duration: `${movie.duration} phút`,
    isHot: movie.rating >= 8.0, // Consider movies with rating >= 8.0 as "hot"
    ageBadgeUrl: pTagImage, // Using imported pTag image
    trailerUrl: movie.trailerUrl || "",
    onPosterClick: undefined,
    onTitleClick: undefined,
    onBuyTicketClick: undefined,
  };
};

/**
 * Convert array of Movies to array of MovieCardProps
 */
export const convertMoviesToMovieCards = (movies: Movie[]): MovieCardProps[] => {
  return movies.map(convertMovieToMovieCard);
};
