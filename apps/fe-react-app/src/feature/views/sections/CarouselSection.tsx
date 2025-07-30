import type { CarouselApi } from "@/components/Shadcn/ui/carousel";
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/Shadcn/ui/carousel";
import { Pointer } from "@/components/magicui/pointer";
import { queryMoviesForCarousel, transformSpotlightsResponse } from "@/services/movieService";
import Autoplay from "embla-carousel-autoplay";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import CarouselDotNavigation from "../components/CarouselDotNavigation";
import CarouselError from "../components/CarouselError";
import CarouselLoading from "../components/CarouselLoading";
import MovieCarouselItem from "../components/MovieCarouselItem";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-empty-interface
interface CarouselSectionProps {}

const CarouselSection = forwardRef<HTMLElement, CarouselSectionProps>((_, ref) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Create autoplay plugin instance
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    }),
  );

  // Use React Query to fetch movies with unique query key for carousel
  const { data: moviesData, isLoading, error } = queryMoviesForCarousel();

  // Transform and get latest 5 movies
  const latestMovies = useMemo(() => {
    if (!moviesData?.result) return [];

    const transformedMovies = transformSpotlightsResponse(moviesData.result);
    // // Sort by id descending and take first 5
    // const sortedMovies = [...transformedMovies].sort((a, b) => (b.id || 0) - (a.id || 0));
    // return sortedMovies.slice(0, 5);
    return transformedMovies;
  }, [moviesData]);

  // Handle dot click
  const handleDotClick = useCallback(
    (index: number) => {
      if (api) {
        api.scrollTo(index);
        // Stop autoplay temporarily when user interacts
        autoplayPlugin.current.stop();
        // Restart autoplay after a delay
        setTimeout(() => {
          autoplayPlugin.current.play();
        }, 3000);
      }
    },
    [api],
  );

  // Set up carousel API and event listeners
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect(); // Set initial state

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (isLoading) {
    return <CarouselLoading ref={ref} />;
  }

  if (error) {
    return <CarouselError ref={ref} />;
  }

  return (
    <section className="relative h-screen w-full cursor-none overflow-hidden text-white" ref={ref} id="home">
      <Pointer>
        <div className="text-2xl">🐉</div>
      </Pointer>

      <Carousel
        className="h-full w-full cursor-none"
        opts={{
          loop: true,
        }}
        plugins={[autoplayPlugin.current]}
        setApi={setApi}
      >
        <CarouselContent className="h-full">
          {latestMovies.map((movie) => (
            <MovieCarouselItem key={movie.id} movie={movie} />
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="left-8 z-20 cursor-none border-white/20 bg-black/50 text-white hover:bg-black/70" />
        <CarouselNext className="right-8 z-20 cursor-none border-white/20 bg-black/50 text-white hover:bg-black/70" />
      </Carousel>

      {/* Fixed Dot Navigation */}
      <CarouselDotNavigation totalMovies={latestMovies.length} currentIndex={current} onDotClick={handleDotClick} />
    </section>
  );
});

CarouselSection.displayName = "CarouselSection";

export default CarouselSection;
