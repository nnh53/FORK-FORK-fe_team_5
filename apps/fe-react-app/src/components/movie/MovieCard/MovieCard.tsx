// File: MovieCard.tsx

import React from 'react';
import hotBadgeAsset from '../../assets/hotBadge.png';

export interface MovieCardProps {
  id: string | number;
  posterUrl: string;
  title: string;
  genres: string[];
  duration: string;
  isHot?: boolean;
  ageBadgeUrl: string;
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
    // THAY ĐỔI: Bỏ min/max width, dùng w-full để card linh hoạt theo grid cha.
    // h-full và flex-col vẫn rất quan trọng.
    <div className="flex flex-col h-full w-full bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      {/* --- Phần Poster --- */}
      <div className="relative group " onClick={onPosterClick}>
        <img
          src={posterUrl}
          alt={`Poster phim ${title}`}
          className="w-full h-[420px] object-cover transition-all duration-300 group-hover:brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
          <i
            className="fa fa-play-circle text-6xl text-white opacity-0 group-hover:opacity-90 transition-opacity duration-300"
            aria-hidden="true"
          ></i>
        </div>
        {ageBadgeUrl && (
          <div className="absolute top-3 left-3 z-10">
            <img src={ageBadgeUrl} alt="Phân loại phim" className="h-9 w-auto" />
          </div>
        )}
        {isHot && (
          <div className="absolute top-0 right-0 z-10">
            <img src={hotBadgeAsset} alt="Hot" className="h-20 w-20" />
          </div>
        )}
      </div>

      {/* --- Phần Nội dung --- */}
      <div className="flex flex-col flex-1 pe-4 px-4 pb-4 min-w-3xs max-w-3xs">
        {/* div flex-grow này sẽ đẩy nút Mua Vé xuống dưới */}
        <div className="flex-grow">
          <h3
            title={title}
            onClick={(e) => {
              e.stopPropagation();
              onTitleClick?.();
            }}
            className="text-lg sm:text-xl font-bold text-red-600 overflow-hidden hover:text-red-700 hover:underline"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </h3>
          <p className="text-sm text-gray-600 truncate">
            <span className="font-bold">Thể loại:</span> {genres.join(', ')}
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
                     cursor-pointer"
        >
          <i className="fa fa-ticket rotate-45 text-5xl opacity-40 absolute left-1" aria-hidden="true"></i>
          <span> MUA VÉ</span>
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
