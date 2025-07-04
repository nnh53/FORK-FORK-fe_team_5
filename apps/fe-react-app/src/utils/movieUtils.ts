import pTagImage from "@/assets/pTag.png";
import type { Movie } from "@/interfaces/movies.interface";
import type { MovieCardProps } from "../components/movie/MovieCard";

/**
 * Convert Movie from API to MovieCardProps for UI display
 */
export const convertMovieToMovieCard = (movie: Movie): MovieCardProps => {
  return {
    id: movie.id ?? 0,
    posterUrl: movie.poster ?? "",
    title: movie.name ?? "Untitled",
    genres: movie.categories ? movie.categories.map((cat) => cat.name ?? "") : ["Unknown"],
    duration: movie.duration ? `${movie.duration} phút` : "N/A",
    isHot: false, // Since we don't have rating in new Movie interface
    ageBadgeUrl: pTagImage,
    trailerUrl: movie.trailer ?? "",
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
