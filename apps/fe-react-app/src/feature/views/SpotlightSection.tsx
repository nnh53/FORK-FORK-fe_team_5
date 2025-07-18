import CardSwap, { Card } from "@/components/Reactbits/reactbit-components/CardSwap/CardSwap";
import { ROUTES } from "@/routes/route.constants";
import { getSpotlightMovies, type SpotlightMovie } from "@/services/spotlightService";
import { getYouTubeEmbedUrl, getYouTubeVideoId } from "@/utils/movie.utils";
import { forwardRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SpotlightSection.css";

interface SpotlightSectionProps {
  className?: string;
}

const SpotlightSection = forwardRef<HTMLElement, SpotlightSectionProps>(({ className }, ref) => {
  const navigate = useNavigate();
  const [spotlightMovies, setSpotlightMovies] = useState<SpotlightMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Track which card is currently at the front of CardSwap
  const [activeIndex, setActiveIndex] = useState(0);
  // Track screen size for responsive CardSwap settings
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

  // Responsive CardSwap settings
  const cardSwapSettings = isMobile
    ? {
        cardDistance: 30,
        verticalDistance: 10,
        delay: 8000,
        pauseOnHover: true,
        skewAmount: 0,
      }
    : {
        cardDistance: 50,
        verticalDistance: 100,
        delay: 8000,
        pauseOnHover: true,
        skewAmount: 2,
      };

  return (
    <section className={`spotlight-section ${className ?? ""}`} ref={ref} id="spotlight-movies">
      <div className="spotlight-content">
        {/* Left Side - Movie List */}
        <div className="spotlight-text">
          <h3 className="spotlight-title">Phim Gợi ý</h3>

          <ul className="spotlight-list">
            {spotlightMovies.map((movie, idx) => (
              <li key={movie.id ?? idx} className={`spotlight-item ${idx === activeIndex ? "active" : "inactive"}`}>
                <span className="spotlight-number">{String(idx + 1).padStart(2, "0")}</span>
                <span className="spotlight-name">{movie.name}</span>
              </li>
            ))}
            {spotlightMovies.length === 0 && <li style={{ color: "#666" }}>No spotlight movies</li>}
          </ul>

          <button
            className="book-now-button"
            onClick={() => {
              if (spotlightMovies.length > 0 && spotlightMovies[activeIndex]?.id) {
                navigate(ROUTES.MOVIE_DETAIL.replace(":movieId", spotlightMovies[activeIndex].id.toString()));
              } else {
                navigate(ROUTES.MOVIES_SELECTION);
              }
            }}
          >
            Book Now
          </button>
        </div>

        {/* Right Side - CardSwap */}
        <div className={`card-swap-wrapper ${isMobile ? "mobile-offset" : ""}`}>
          <div className="card-swap-container-wrapper">
            {isLoading ? (
              <div className="loading-container">
                <p className="loading-text">Loading spotlight movies...</p>
              </div>
            ) : (
              <CardSwap
                cardDistance={cardSwapSettings.cardDistance}
                verticalDistance={cardSwapSettings.verticalDistance}
                delay={cardSwapSettings.delay}
                pauseOnHover={cardSwapSettings.pauseOnHover}
                skewAmount={cardSwapSettings.skewAmount}
                onActiveIndexChange={setActiveIndex}
              >
                {spotlightMovies.map((movie: SpotlightMovie, idx: number) => (
                  <Card key={movie.id} className="card-style">
                    {(() => {
                      // Only play trailer for active card
                      if (idx === activeIndex && movie.trailer && getYouTubeEmbedUrl(movie.trailer)) {
                        const videoId = getYouTubeVideoId(movie.trailer || "");
                        const startTime = movie.id ? (movie.id % 60) + 10 : 0;
                        const embedUrl = getYouTubeEmbedUrl(movie.trailer, {
                          autoplay: true,
                          rel: false,
                          showinfo: false,
                        });

                        let finalUrl = embedUrl || "";
                        finalUrl = `${finalUrl}&start=${startTime}&mute=1&loop=1`;
                        if (videoId) {
                          finalUrl += `&playlist=${videoId}`;
                        }

                        return (
                          <div className="trailer-container">
                            <iframe
                              src={finalUrl}
                              title={`Trailer - ${movie.name}`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="trailer-iframe"
                            />
                          </div>
                        );
                      }

                      // Fallback to poster for non-active cards or if no trailer
                      if (movie.poster) {
                        return (
                          <div className="poster-container">
                            <img src={movie.poster} alt={movie.name} className="poster-image" loading="lazy" />
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </Card>
                ))}
                {spotlightMovies.length === 0 && (
                  <Card className="empty-card-style">
                    <h3 className="empty-card-title">No spotlight movies available</h3>
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
