import CardSwap, { Card } from "@/components/Reactbits/reactbit-components/CardSwap/CardSwap";
import { ROUTES } from "@/routes/route.constants";
import { getSpotlightMovies, type SpotlightMovie } from "@/services/spotlightService";
import { getYouTubeEmbedUrl, getYouTubeVideoId } from "@/utils/movie.utils";
import { forwardRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface SpotlightSectionProps {
  className?: string;
}

const SpotlightSection = forwardRef<HTMLElement, SpotlightSectionProps>(({ className }, ref) => {
  const navigate = useNavigate();
  const [spotlightMovies, setSpotlightMovies] = useState<SpotlightMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load spotlight movies from localStorage
  useEffect(() => {
    const loadSpotlightMovies = () => {
      try {
        const movies = getSpotlightMovies();
        setSpotlightMovies(movies);
      } catch (error) {
        console.error("Error loading spotlight movies:", error);
        setSpotlightMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial load
    loadSpotlightMovies();

    // Listen for spotlight updates from SpotlightManagement
    const handleSpotlightUpdate = (event: CustomEvent) => {
      setSpotlightMovies(event.detail || []);
    };

    window.addEventListener("spotlightUpdated", handleSpotlightUpdate as EventListener);

    return () => {
      window.removeEventListener("spotlightUpdated", handleSpotlightUpdate as EventListener);
    };
  }, []);

  return (
    <section className={`card-swap-section ${className ?? ""}`} ref={ref} id="spotlight-movies">
      <div
        className="spotlight-content"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4rem",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2rem 1rem",
        }}
      >
        {/* Left Side - Text Content */}
        <div
          className="spotlight-text"
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <h3
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "1.5rem",
              background: "linear-gradient(to right, #946b38, #392819)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: "1.2",
            }}
          >
            Spotlight Movies
          </h3>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#666",
              lineHeight: "1.6",
              marginBottom: "2rem",
            }}
          >
            Discover the most popular movies of the moment
          </p>
          <button
            style={{
              backgroundColor: "#946b38",
              color: "white",
              padding: "1rem 2rem",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              alignSelf: "flex-start",
              transition: "all 0.3s ease",
            }}
            onClick={() => {
              // If we have spotlight movies, navigate to the first one's detail page
              if (spotlightMovies.length > 0 && spotlightMovies[0].id) {
                navigate(ROUTES.MOVIE_DETAIL.replace(":movieId", spotlightMovies[0].id.toString()));
              } else {
                // Fallback to movies selection if no spotlight movies available
                navigate(ROUTES.MOVIES_SELECTION);
              }
            }}
          >
            Book Now
          </button>
        </div>

        {/* Right Side - CardSwap */}
        <div
          className="card-swap-wrapper"
          style={{
            flex: "1",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "2rem",
            position: "relative",
            marginBottom: "40px",
          }}
        >
          <div style={{ height: "600px", position: "relative", transform: "translateY(-50px)" }}>
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-lg">Loading spotlight movies...</p>
              </div>
            ) : (
              <CardSwap cardDistance={80} verticalDistance={90} delay={5000} pauseOnHover={false} skewAmount={0}>
                {spotlightMovies.map((movie: SpotlightMovie) => (
                  <Card
                    key={movie.id}
                    style={{
                      padding: "0",
                      borderRadius: "16px",
                      border: "1px solid #e8e5e0",
                      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "700px",
                      height: "450px",
                      overflow: "hidden",
                      cursor: "pointer",
                      // pointerEvents: "none", // Disable interactions with card
                    }}
                    onClick={() => movie.id && navigate(ROUTES.MOVIE_DETAIL.replace(":movieId", movie.id.toString()))}
                  >
                    {(() => {
                      // Media content rendering - now takes the entire card
                      if (movie.trailer && getYouTubeEmbedUrl(movie.trailer)) {
                        // Get video ID for the playlist parameter
                        const videoId = getYouTubeVideoId(movie.trailer || "");
                        // Calculate a start time based on the movie ID to show different parts of trailers
                        const startTime = movie.id ? (movie.id % 60) + 10 : 0;
                        // Create the embed URL with the appropriate parameters
                        const embedUrl = getYouTubeEmbedUrl(movie.trailer, {
                          autoplay: true,
                          rel: false,
                          showinfo: false,
                        });

                        // Construct the final URL properly
                        let finalUrl = embedUrl || "";
                        finalUrl = finalUrl + "&start=" + startTime + "&mute=1&loop=1";
                        if (videoId) {
                          finalUrl = finalUrl + "&playlist=" + videoId;
                        }

                        return (
                          <div className="relative h-full w-full overflow-hidden">
                            <iframe
                              src={finalUrl}
                              title={`Trailer - ${movie.name}`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="absolute left-0 top-0 h-full w-full border-0"
                            />
                          </div>
                        );
                      } else if (movie.poster) {
                        return (
                          <div className="h-full w-full overflow-hidden">
                            {/* <img src={movie.poster} alt={movie.name} className="h-full w-full object-cover transition-transform hover:scale-105" loading="lazy" /> */}
                            <img src={movie.poster} alt={movie.name} className="h-full w-full object-cover" loading="lazy" />
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </Card>
                ))}
                {spotlightMovies.length === 0 && (
                  <Card
                    style={{
                      padding: "1rem",
                      borderRadius: "16px",
                      border: "1px solid #e8e5e0",
                      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      width: "700px",
                      height: "450px",
                      pointerEvents: "none",
                    }}
                  >
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem", color: "#946b38" }}>No spotlight movies available</h3>
                    <p style={{ fontSize: "1rem", color: "#666" }}>Admin can add movies to spotlight from the management panel</p>
                  </Card>
                )}
              </CardSwap>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

SpotlightSection.displayName = "SpotlightSection";

export default SpotlightSection;
