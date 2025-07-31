import { Icon } from "@iconify/react";
import React from "react";
export interface MovieCardProps {
  id: string | number;
  posterUrl: string;
  title: string;
  genres: string[];
  duration: string;
  trailerUrl: string;
  onPosterClick?: () => void;
  onTitleClick?: () => void;
  onBuyTicketClick?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ posterUrl, title, genres, duration, onPosterClick, onTitleClick, onBuyTicketClick }) => {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl sm:h-[520px] lg:h-[580px]">
      {/* --- Phần Poster --- */}
      <button className="group relative h-64 w-full flex-shrink-0 sm:h-80 lg:h-96" onClick={onPosterClick} type="button">
        <img
          src={posterUrl}
          alt={`Poster phim ${title}`}
          className="h-full w-full object-cover transition-all duration-300 group-hover:brightness-50"
        />
        <div className="absolute inset-0 flex cursor-pointer items-center justify-center">
          <div className="fa fa-play-circle text-6xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-90" aria-hidden="true">
            <Icon icon="mdi:play-circle" width="60" height="60" />
          </div>
        </div>
      </button>

      {/* --- Phần Nội dung --- */}
      <div className="flex min-h-0 flex-1 flex-col px-3 pb-3 sm:px-4 sm:pb-4">
        {/* div flex-grow này sẽ đẩy nút Mua Vé xuống dưới */}
        <div className="min-h-0 flex-grow pt-1.5 sm:pt-3">
          <h3
            title={title}
            onClick={(e) => {
              e.stopPropagation();
              onTitleClick?.();
            }}
            className="mb-0.5 line-clamp-2 cursor-pointer overflow-hidden text-sm font-bold text-red-600 hover:text-red-700 hover:underline sm:mb-2 sm:text-lg"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </h3>
          <p className="mb-0.5 line-clamp-1 text-xs text-gray-600 sm:mb-1 sm:text-sm">
            <span className="font-bold">Thể loại:</span> {genres.join(", ")}
          </p>
          <p className="line-clamp-1 text-xs text-gray-600 sm:text-sm">
            <span className="font-bold">Thời lượng:</span> {duration}
          </p>
        </div>

        {/* Nút Mua Vé */}
        <button
          onClick={onBuyTicketClick}
          className="relative mt-1.5 flex h-9 w-full flex-shrink-0 cursor-pointer items-center justify-center rounded-md bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-xs font-bold text-white transition duration-200 hover:brightness-110 sm:mt-4 sm:h-11 sm:text-base"
        >
          <span className="text-7xl">
            <Icon
              icon="mdi:local-activity"
              width="40"
              height="40"
              className="absolute -top-0.5 -left-1 text-5xl opacity-60 sm:-top-2 sm:h-[50px] sm:w-[50px] sm:text-9xl"
              style={{ transform: "rotate(45deg)" }}
            />
          </span>
          <span> MUA VÉ</span>
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
