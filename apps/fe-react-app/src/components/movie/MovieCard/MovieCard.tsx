// File: MovieCard.tsx

import hotBadgeImage from "@/assets/hotBadge.png";
import { Icon } from "@iconify/react";
import React from "react";
export interface MovieCardProps {
  id: string | number;
  posterUrl: string;
  title: string;
  genres: string[];
  duration: string;
  isHot?: boolean;
  ageBadgeUrl: string;
  trailerUrl: string;
  onPosterClick?: () => void;
  onTitleClick?: () => void;
  onBuyTicketClick?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  posterUrl,
  title,
  genres,
  duration,
  isHot,
  ageBadgeUrl,
  onPosterClick,
  onTitleClick,
  onBuyTicketClick,
}) => {
  return (
    <div className="flex flex-col w-72 h-[580px] bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      {/* --- Phần Poster --- */}
      <button className="relative group w-full h-96 flex-shrink-0" onClick={onPosterClick} type="button">
        <img
          src={posterUrl}
          alt={`Poster phim ${title}`}
          className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
          <div className="fa fa-play-circle text-6xl text-white opacity-0 group-hover:opacity-90 transition-opacity duration-300" aria-hidden="true">
            <Icon icon="mdi:play-circle" width="60" height="60" />
          </div>
        </div>
        {ageBadgeUrl && (
          <div className="absolute top-3 left-3 z-10">
            <img src={ageBadgeUrl} alt="Phân loại phim" className="h-9 w-auto" />
          </div>
        )}
        {isHot && (
          <div className="absolute top-0 right-0 z-10">
            <img src={hotBadgeImage} alt="Hot" className="h-20 w-20" />
          </div>
        )}
      </button>

      {/* --- Phần Nội dung --- */}
      <div className="flex flex-col flex-1 px-4 pb-4 min-h-0">
        {/* div flex-grow này sẽ đẩy nút Mua Vé xuống dưới */}
        <div className="flex-grow pt-3 min-h-0">
          <h3
            title={title}
            onClick={(e) => {
              e.stopPropagation();
              onTitleClick?.();
            }}
            className="text-lg font-bold text-red-600 overflow-hidden hover:text-red-700 hover:underline cursor-pointer mb-2 line-clamp-2"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-1 line-clamp-1">
            <span className="font-bold">Thể loại:</span> {genres.join(", ")}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-bold">Thời lượng:</span> {duration}
          </p>
        </div>

        {/* Nút Mua Vé */}
        <button
          onClick={onBuyTicketClick}
          className="w-full h-11 bg-gradient-to-r from-red-700 via-red-600 to-red-500 hover:brightness-110 text-white font-bold rounded-md
                     transition duration-200 flex items-center justify-center text-base relative mt-4
                     cursor-pointer flex-shrink-0"
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
