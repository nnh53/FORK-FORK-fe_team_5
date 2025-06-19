import { CardContent, Card as ShadcnCard } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { forwardRef, useEffect } from "react";
import Aurora from "../../../../../Reactbits/Aurora/Aurora";
import "./CarouselSection.css";

interface MovieData {
  title: string;
  description: string;
  id: number;
  icon: string;
}

interface CarouselSectionProps {
  movies: MovieData[];
}

const CarouselSection = forwardRef<HTMLElement, CarouselSectionProps>(({ movies }, ref) => {
  useEffect(() => {
    const currentRef = typeof ref === "object" && ref ? ref.current : null;

    // Carousel section animation
    gsap.fromTo(
      ".carousel-section",
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: currentRef,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    );

    return () => {
      // Clean up ScrollTrigger instances for this component
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === currentRef) {
          trigger.kill();
        }
      });
    };
  }, [ref]);
  return (
    <section className="carousel-section" ref={ref} id="new-releases">
      {" "}
      {/* Aurora Background */}
      <div className="aurora-background">
        <Aurora colorStops={["#F5DEB3", "#FFDEAD", "#FFE4C4"]} blend={0.5} amplitude={1.0} speed={0.5} />
      </div>
      <div className="section-title">
        <h2
          style={{
            background: "linear-gradient(to right, #946b38, #392819)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            fontWeight: "800",
          }}
        >
          New Releases
        </h2>
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
          <Carousel className="w-full">
            <CarouselContent>
              {movies.map((movie) => (
                <CarouselItem key={movie.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <ShadcnCard>
                      <CardContent className="flex flex-col items-center justify-center p-6 aspect-video">
                        <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
                        <p className="text-sm text-center">{movie.description}</p>
                        <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
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
export type { MovieData };
