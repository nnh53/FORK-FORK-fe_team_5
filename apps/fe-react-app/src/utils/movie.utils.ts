import pTagImage from "@/assets/pTag.png";
import type { Movie } from "@/interfaces/movies.interface";
import type { MovieCardProps } from "../components/movie/MovieCard";

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

export const convertMoviesToMovieCards = (movies: Movie[]): MovieCardProps[] => {
  return movies.map(convertMovieToMovieCard);
};

export function getYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  url = url.trim();

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:gaming\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(url);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Create YouTube embed URL from video ID
 * @param videoId YouTube video ID
 * @param options Embed options
 * @returns YouTube embed URL
 */
export function createYouTubeEmbedUrl(
  videoId: string,
  options: {
    autoplay?: boolean;
    rel?: boolean;
    modestbranding?: boolean;
    showinfo?: boolean;
  } = {},
): string {
  const params = new URLSearchParams();

  if (options.autoplay) params.set("autoplay", "1");
  if (options.rel === false) params.set("rel", "0");
  if (options.modestbranding) params.set("modestbranding", "1");
  if (options.showinfo === false) params.set("showinfo", "0");

  const paramString = params.toString();
  const baseUrl = `https://www.youtube.com/embed/${videoId}`;
  return paramString ? `${baseUrl}?${paramString}` : baseUrl;
}

/**
 * Get YouTube embed URL from any YouTube URL
 * @param url YouTube URL
 * @param options Embed options
 * @returns YouTube embed URL or null if invalid
 */
export function getYouTubeEmbedUrl(
  url: string,
  options: {
    autoplay?: boolean;
    rel?: boolean;
    modestbranding?: boolean;
    showinfo?: boolean;
  } = {},
): string | null {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  return createYouTubeEmbedUrl(videoId, options);
}
