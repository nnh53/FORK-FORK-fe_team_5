// File: MovieCard.tsx

import hotBadgeImage from "@/assets/hotBadge.webp";
import { Icon } from "@iconify/react";
import React from "react";
export interface MovieCardProps {
  id: string | number;
  posterUrl: string;
  title: string;
  genres: string[];
  duration: string;
  isHot?: boolean;
  trailerUrl: string;
  onPosterClick?: () => void;
  onTitleClick?: () => void;
  onBuyTicketClick?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ posterUrl, title, genres, duration, isHot, onPosterClick, onTitleClick, onBuyTicketClick }) => {
  return (
    <div className="flex h-[580px] w-72 flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl">
      {/* --- Phần Poster --- */}
      <button className="group relative h-96 w-full flex-shrink-0" onClick={onPosterClick} type="button">
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
        {isHot && (
          <div className="absolute right-0 top-0 z-10">
            <img src={hotBadgeImage} alt="Hot" className="h-20 w-20" />
          </div>
        )}
      </button>

      {/* --- Phần Nội dung --- */}
      <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
        {/* div flex-grow này sẽ đẩy nút Mua Vé xuống dưới */}
        <div className="min-h-0 flex-grow pt-3">
          <h3
            title={title}
            onClick={(e) => {
              e.stopPropagation();
              onTitleClick?.();
            }}
            className="mb-2 line-clamp-2 cursor-pointer overflow-hidden text-lg font-bold text-red-600 hover:text-red-700 hover:underline"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </h3>
          <p className="mb-1 line-clamp-1 text-sm text-gray-600">
            <span className="font-bold">Thể loại:</span> {genres.join(", ")}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-bold">Thời lượng:</span> {duration}
          </p>
        </div>

        {/* Nút Mua Vé */}
        <button
          onClick={onBuyTicketClick}
          className="relative mt-4 flex h-11 w-full flex-shrink-0 cursor-pointer items-center justify-center rounded-md bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-base font-bold text-white transition duration-200 hover:brightness-110"
        >
          <span className={"text-7xl"}>
            <Icon
              icon="mdi:local-activity"
              width="60"
              height="60"
              className="absolute -left-1 -top-2 text-9xl opacity-60"
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
