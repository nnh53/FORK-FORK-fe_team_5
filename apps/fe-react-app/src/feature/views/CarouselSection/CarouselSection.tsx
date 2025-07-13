import Aurora from "@/components/Reactbits/reactbit-backgrounds/Aurora/Aurora";
import { CardContent, Card as ShadcnCard } from "@/components/Shadcn/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/Shadcn/ui/carousel";
import { queryMovies, transformMoviesResponse } from "@/services/movieService";
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
            padding: "0 20px",
            maxWidth: "1800px",
            margin: "0 auto",
          }}
        >
          <Carousel
            className="w-full"
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
          >
            <CarouselContent>
              {latestMovies.map((movie) => (
                <CarouselItem key={movie.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <ShadcnCard>
                      <CardContent className="flex aspect-video flex-col items-center justify-center p-6">
                        {movie.poster && (
                          <div className="mb-4 h-48 w-full overflow-hidden rounded-lg">
                            <img
                              src={movie.poster}
                              alt={movie.name || "Movie poster"}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder-movie.jpg";
                              }}
                            />
                          </div>
                        )}
                        <h3 className="mb-2 text-center text-xl font-bold">{movie.name || "Untitled Movie"}</h3>
                        <p className="mb-2 text-center text-sm">{movie.description || "No description available"}</p>
                        <div className="mb-4 text-center text-xs text-gray-500">
                          {movie.duration ? `${movie.duration} phút` : ""}
                          {movie.ageRestrict ? ` • ${movie.ageRestrict}+` : ""}
                        </div>
                        <button className="bg-primary text-primary-foreground hover:bg-primary/90 mt-auto rounded-md px-4 py-2 transition-colors">
                          View Details
                        </button>
                      </CardContent>
                    </ShadcnCard>
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
