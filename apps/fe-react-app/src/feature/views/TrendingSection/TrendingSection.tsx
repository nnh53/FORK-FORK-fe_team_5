import CardSwap, { Card } from "@/components/Reactbits/reactbit-components/CardSwap/CardSwap";
import { AuthContext } from "@/contexts/AuthContext";
import { ROUTES } from "@/routes/route.constants";
import { queryMovies, transformMoviesResponse } from "@/services/movieService";
import { getYouTubeEmbedUrl, getYouTubeVideoId } from "@/utils/movie.utils";
import { forwardRef, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface TrendingSectionProps {
  className?: string;
}

const TrendingSection = forwardRef<HTMLElement, TrendingSectionProps>(({ className }, ref) => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const isAdmin = authContext?.user?.roles?.includes("ADMIN");

  const { data: moviesData, isLoading } = queryMovies();

  // Transform and get first 4 movies for trending
  const trendingMovies = useMemo(() => {
    if (!moviesData?.result) return [];

    const transformedMovies = transformMoviesResponse(moviesData.result);
    // Take the first 4 movies for the trending section
    return transformedMovies.slice(0, 4);
  }, [moviesData]);

  const handleAdminNavigation = () => {
    navigate(ROUTES.ADMIN.TRENDING);
  };

  return (
    <section className={`card-swap-section ${className ?? ""}`} ref={ref} id="trending-movies">
      <div className="section-title">
        <div className="flex items-center justify-between">
          {isAdmin && (
            <button
              onClick={handleAdminNavigation}
              className="rounded-md bg-gray-800 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-700"
            >
              Back to Admin
            </button>
          )}
        </div>
      </div>

      <div
        className="trending-content"
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
          className="trending-text"
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
            Trending Movies
          </h3>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#666",
              lineHeight: "1.6",
              marginBottom: "2rem",
            }}
          >
            Explosive emotions, exclusively on the grand screen
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
              // If we have trending movies, navigate to the first one's detail page
              if (trendingMovies.length > 0 && trendingMovies[0].id) {
                navigate(ROUTES.MOVIE_DETAIL.replace(":movieId", trendingMovies[0].id.toString()));
              } else {
                // Fallback to movies selection if no trending movies available
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
                <p className="text-lg">Loading trending movies...</p>
              </div>
            ) : (
              <CardSwap cardDistance={80} verticalDistance={90} delay={5000} pauseOnHover={false} skewAmount={0}>
                {trendingMovies.map((movie) => (
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
                {trendingMovies.length === 0 && (
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
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem", color: "#946b38" }}>No trending movies found</h3>
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

TrendingSection.displayName = "TrendingSection";

export default TrendingSection;
