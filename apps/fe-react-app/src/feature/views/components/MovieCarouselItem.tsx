import { CarouselItem } from "@/components/Shadcn/ui/carousel";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { Movie } from "@/interfaces/movies.interface";
import { Image } from "@unpic/react";
import { Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MovieCarouselItemProps {
  movie: Movie;
}

const MovieCarouselItem = ({ movie }: MovieCarouselItemProps) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).getFullYear().toString();
  };

  // Format duration helper
  const formatDuration = (duration?: number) => {
    if (!duration) return "N/A";
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  // Format categories helper
  const formatCategories = (categories?: Array<{ name?: string }>) => {
    if (!categories || categories.length === 0) return "Unknown";
    return categories
      .map((cat) => cat.name)
      .filter(Boolean)
      .join(", ");
  };

  // Determine which image to use
  const imageSource = isMobile && movie.poster ? movie.poster : movie.banner;

  return (
    <CarouselItem key={movie.id} className="relative h-screen w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
      {/* Banner/Poster Image */}
      {imageSource && (
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <Image
            src={imageSource}
            alt={`${movie.name} ${isMobile ? "poster" : "banner"}`}
            className="absolute inset-0 h-full w-full object-cover"
            layout="constrained"
            width={1920}
            height={1080}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.65),transparent)]" />

      {/* Content Grid */}
      <div className="relative z-20 grid h-full grid-cols-12 px-8">
        <div className={`${isMobile ? "col-span-12" : "col-span-5 col-start-2"} self-start pt-[35vh]`}>
          {/* Movie Title */}
          <h1 className="text-[clamp(3rem,6vw,6rem)] leading-none font-semibold">{movie.name || "Untitled Movie"}</h1>

          {/* Movie Info */}
          <div className="mt-4 flex flex-wrap items-center gap-x-2 text-[15px] text-[#E0E0E0]">
            <span>{formatCategories(movie.categories)}</span>
            <span className="mx-2">•</span>
            <Calendar className="h-4 w-4" />
            <span>{formatDate(movie.fromDate)}</span>
            <span className="mx-2">•</span>
            <Clock className="h-4 w-4" />
            <span>{formatDuration(movie.duration)}</span>
            {movie.ageRestrict && (
              <>
                <span className="mx-2">•</span>
                <span className="rounded-full border border-[#E0E0E0] px-2 py-0.5 text-[12px] text-[#E0E0E0]">{movie.ageRestrict}+</span>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              className="h-11 w-38 rounded bg-[#FFD400] px-4 text-sm font-medium text-[#0C0B0E] transition-colors hover:bg-[#E6C000]"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              Book Tickets
            </button>
            <button
              className="h-11 w-38 rounded border border-[#FFD400] px-4 text-sm font-medium text-[#FFD400] transition-colors hover:bg-[#FFD400] hover:text-[#0C0B0E]"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              More
            </button>
          </div>
        </div>

        {/* Movie Details - Only on Desktop */}
        {!isMobile && (
          <div className="col-span-3 col-start-9 pt-[35vh]">
            <p className="leading-6 text-[#E0E0E0]">
              {/* Director/Studio */}
              {movie.director && (
                <>
                  {movie.director} : <span className="text-[#FFD400]">Director</span>
                  <br />
                </>
              )}
              {/* Studio */}
              {movie.studio && (
                <>
                  {movie.studio} : <span className="text-[#FFD400]">Studio</span>
                  <br />
                </>
              )}
              {/* Actors */}
              {movie.actor && (
                <>
                  {movie.actor} : <span className="text-[#FFD400]">Actors</span>
                </>
              )}
            </p>

            {/* Description */}
            {movie.description && <p className="mt-4 max-w-[32ch] text-sm text-[#E0E0E0]">{movie.description}</p>}
          </div>
        )}
      </div>
    </CarouselItem>
  );
};

export default MovieCarouselItem;
