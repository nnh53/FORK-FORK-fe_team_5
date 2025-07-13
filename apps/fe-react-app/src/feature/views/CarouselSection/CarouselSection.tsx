import Aurora from "@/components/Reactbits/reactbit-backgrounds/Aurora/Aurora";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/Shadcn/ui/carousel";
import { queryMovies, transformMoviesResponse } from "@/services/movieService";
import { Image } from "@unpic/react";
import Autoplay from "embla-carousel-autoplay";
import { forwardRef, useMemo } from "react";
import "./CarouselSection.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CarouselSectionProps {}

const CarouselSection = forwardRef<HTMLElement, CarouselSectionProps>((_, ref) => {
  // Use React Query to fetch movies with unique query key for carousel
  const { data: moviesData, isLoading, error } = queryMovies();

  // Transform and get latest 5 movies
  const latestMovies = useMemo(() => {
    if (!moviesData?.result) return [];

    const transformedMovies = transformMoviesResponse(moviesData.result);
    // Sort by id descending and take first 5
    const sortedMovies = [...transformedMovies].sort((a, b) => (b.id || 0) - (a.id || 0));
    return sortedMovies.slice(0, 5);
  }, [moviesData]);

  if (isLoading) {
    return (
      <section className="carousel-section" ref={ref} id="new-releases">
        <div className="aurora-background">
          <Aurora colorStops={["#F5DEB3", "#FFDEAD", "#FFE4C4"]} blend={0.5} amplitude={1.0} speed={0.5} />
        </div>
        <div className="flex h-64 items-center justify-center">
          <div className="text-lg">Loading movies...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="carousel-section" ref={ref} id="new-releases">
        <div className="aurora-background">
          <Aurora colorStops={["#F5DEB3", "#FFDEAD", "#FFE4C4"]} blend={0.5} amplitude={1.0} speed={0.5} />
        </div>
        <div className="flex h-64 items-center justify-center">
          <div className="text-lg text-red-500">Failed to load movies</div>
        </div>
      </section>
    );
  }
  return (
    <section className="carousel-section" ref={ref} id="new-releases">
      {" "}
      {/* Aurora Background */}
      <div className="aurora-background">
        <Aurora colorStops={["#F5DEB3", "#FFDEAD", "#FFE4C4"]} blend={0.5} amplitude={1.0} speed={0.5} />
      </div>
      <div className="section-title">
        <div
          className="section-line"
          style={{
            background: "linear-gradient(to right, #946b38, #392819)",
            height: "3px",
          }}
        ></div>
      </div>
      <div className="carousel-wrapper">
        <div
          style={{
            padding: "0 60px",
            maxWidth: "100%",
            margin: "0 auto",
          }}
        >
          <Carousel
            className="mx-auto w-full max-w-4xl"
            opts={{
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
          >
            <CarouselContent>
              {latestMovies.map((movie) => (
                <CarouselItem key={movie.id} className="relative overflow-hidden rounded-lg">
                  {movie.poster && (
                    <div className="flex h-96 w-full items-center justify-center overflow-hidden rounded-lg bg-black">
                      <Image
                        src={movie.poster}
                        alt={movie.name || "Movie poster"}
                        className="max-h-full max-w-full object-contain"
                        layout="fullWidth"
                        height={400}
                        priority
                        background="auto"
                        loading="eager"
                      />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="mb-2 text-center text-lg font-bold text-white">{movie.name || "Untitled Movie"}</h3>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
});

CarouselSection.displayName = "CarouselSection";

export default CarouselSection;
