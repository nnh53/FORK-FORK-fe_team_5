import bgTop from "@/assets/bg-top.png";
import brickWall from "@/assets/brickWall.jpg";
import ClickSpark from "@/components/Reactbits/reactbit-animations/ClickSpark/ClickSpark";
import CardSwap, { Card } from "@/components/Reactbits/reactbit-components/CardSwap/CardSwap";
import { ROUTES } from "@/routes/route.constants";
import { useRef } from "react";
import { Link } from "react-router-dom";
import type { MovieData } from "../../feature/views/CarouselSection/CarouselSection";
import CarouselSection from "../../feature/views/CarouselSection/CarouselSection";
import WelcomePanel from "../../feature/views/WelcomePanel/WelcomePanel";

import { useHomePageAnimations } from "../../hooks/useHomePageAnimations";
import UserLayout from "../../layouts/user/UserLayout";
import "./styles/HomePage.css";
import { FAQ } from "@/feature/views/FAQ";

const HomePage = () => {
  const heroRef = useRef<HTMLElement | null>(null);
  const carouselRef = useRef<HTMLElement | null>(null);
  const cardSwapRef = useRef<HTMLElement | null>(null);
  const featuredMoviesRef = useRef<HTMLElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  const faqRef = useRef<HTMLElement | null>(null);
  const parallaxRef = useRef<HTMLElement | null>(null);

  //Animation using hooks
  useHomePageAnimations({
    heroRef,
    carouselRef,
    cardSwapRef,
    featuredMoviesRef,
    experienceRef,
    faqRef,
    parallaxRef,
  });

  //Movie cardswap mock data tạm thời
  const recentMovies: MovieData[] = [
    {
      title: "The Marvels",
      description: "Carol Danvers teams up with Monica Rambeau and Kamala Khan in this cosmic adventure.",
      id: 1,
      icon: "tabler:movie",
    },
    {
      title: "Dune: Part Two",
      description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against those who destroyed his family.",
      id: 2,
      icon: "tabler:wind",
    },
    {
      title: "Oppenheimer",
      description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
      id: 3,
      icon: "tabler:atom",
    },
    {
      title: "Mission: Impossible - Dead Reckoning",
      description: "Ethan Hunt and his IMF team embark on their most dangerous mission yet.",
      id: 4,
      icon: "tabler:run",
    },
    {
      title: "Poor Things",
      description: "A young woman brought back to life by an unorthodox scientist embarks on a journey of self-discovery.",
      id: 5,
      icon: "tabler:heart",
    },
  ];
  return (
    <UserLayout>
      <ClickSpark sparkColor="#8B4513" sparkSize={20} sparkRadius={40} sparkCount={8} duration={400}>
        <div className="test-home-page">
          {/* Hero Section */}
          <section className="hero-section panel" ref={heroRef}>
            <div className="hero-bg"></div>
            <div className="hero-content">
              <WelcomePanel />
              <button className="cta-button">
                <Link to={ROUTES.BOOKING}>Book Now</Link>
              </button>
            </div>{" "}
          </section>
          {/* New Releases Carousel Section */}
          <CarouselSection ref={carouselRef} movies={recentMovies} />
          {/* Card Swap Section */}
          <section className="card-swap-section" ref={cardSwapRef} id="trending-movies">
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
                Trending Movies
              </h2>
              <div
                className="section-line"
                style={{
                  background: "linear-gradient(to right, #946b38, #392819)",
                  height: "3px",
                }}
              ></div>
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
                  Elevate your viewing.
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
                >
                  Explore More
                </button>
              </div>

              {/* Right Side - CardSwap */}
              <div
                className="card-swap-wrapper"
                style={{
                  flex: "1",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CardSwap
                  width={650}
                  height={500}
                  cardDistance={20}
                  verticalDistance={20}
                  delay={3000}
                  pauseOnHover={true}
                  skewAmount={5}
                  easing="elastic"
                >
                  <Card>
                    <div className="card-content" style={{ backgroundImage: `url(${bgTop})` }}>
                      <h3>Avengers: Endgame</h3>
                      <p>Action • Adventure • 3h 2m</p>
                      <button className="card-button">View Details</button>
                    </div>
                  </Card>
                  <Card>
                    <div className="card-content" style={{ backgroundImage: `url(${brickWall})` }}>
                      <h3>The Batman</h3>
                      <p>Action • Crime • 2h 56m</p>
                      <button className="card-button">View Details</button>
                    </div>
                  </Card>
                  <Card>
                    <div className="card-content" style={{ backgroundImage: `url(${bgTop})` }}>
                      <h3>Dune</h3>
                      <p>Sci-Fi • Adventure • 2h 35m</p>
                      <button className="card-button">View Details</button>
                    </div>
                  </Card>
                  <Card>
                    <div className="card-content" style={{ backgroundImage: `url(${brickWall})` }}>
                      <h3>No Time to Die</h3>
                      <p>Action • Thriller • 2h 43m</p>
                      <button className="card-button">View Details</button>
                    </div>
                  </Card>{" "}
                </CardSwap>
              </div>
            </div>
          </section>{" "}
          {/* Featured Movies */}
          <section className="featured-section" ref={featuredMoviesRef}>
            <div className="section-header">
              <h2
                className="now-showing-title"
                style={{
                  background: "linear-gradient(to right, #946b38, #392819)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  fontWeight: "800",
                  fontSize: "2.5rem",
                  marginBottom: "2rem",
                }}
              >
                Now Showing
              </h2>
              <div
                className="section-line"
                style={{
                  background: "linear-gradient(to right, #946b38, #392819)",
                  height: "3px",
                }}
              ></div>
            </div>
            <div className="movies-container">
              {[1, 2, 3, 4].map((movie) => (
                <div className="movie-card" key={movie}>
                  <div className="movie-poster">{movie === 1}</div>
                  <div className="movie-details">
                    <h3>Movie Title {movie}</h3>
                    <p>Genre • Duration</p>
                    <button className="ticket-button">Get Tickets</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* Parallax Section */}
          <section className="parallax-section" ref={parallaxRef}>
            <div className="parallax-layer" data-depth="0.1"></div>
            <div className="parallax-layer" data-depth="0.2"></div>
            <div className="parallax-layer" data-depth="0.3"></div>{" "}
            <div className="parallax-content">
              <h2
                style={{
                  background: "linear-gradient(to right, #946b38, #392819)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  fontWeight: "800",
                }}
              >
                The Ultimate Movie Experience
              </h2>
              <p>Feel the magic of cinema</p>
            </div>
          </section>
          {/* Cinema Experience */}
          <section className="experience-section" ref={experienceRef}>
            <div className="experience-content">
              {" "}
              <div className="experience-text">
                <h2
                  style={{
                    background: "linear-gradient(to right, #946b38, #392819)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    fontWeight: "800",
                  }}
                >
                  Premium Cinema Experience
                </h2>
                <p>
                  Luxury seating, state-of-the-art sound systems, and crystal-clear projection technology. Our theaters are designed to provide the
                  ultimate movie-watching experience.
                </p>
                <button className="learn-button">Learn More</button>
              </div>
              <div
                className="experience-images"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridTemplateRows: "1fr 1fr",
                  gap: "20px",
                  width: "100%",
                  maxWidth: "500px",
                  height: "400px",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <img
                    src="../images/normal-chair.png"
                    alt="Normal Chair"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0",
                      left: "0",
                      right: "0",
                      background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                      color: "white",
                      padding: "15px 10px 10px",
                      fontSize: "14px",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Normal Chair
                  </div>
                </div>

                <div
                  style={{
                    position: "relative",
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <img
                    src="../images/vip-chair.png"
                    alt="VIP Chair"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0",
                      left: "0",
                      right: "0",
                      background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                      color: "white",
                      padding: "15px 10px 10px",
                      fontSize: "14px",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    VIP Chair
                  </div>
                </div>

                <div
                  style={{
                    position: "relative",
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <img
                    src="../images/premium-chair.png"
                    alt="Premium Chair"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0",
                      left: "0",
                      right: "0",
                      background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                      color: "white",
                      padding: "15px 10px 10px",
                      fontSize: "14px",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Premium Chairz
                  </div>

                  <div
                    style={{
                      position: "relative",
                      borderRadius: "15px",
                      overflow: "hidden",
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <img
                      src="../images/couple-chair.png"
                      alt="Couple Chair"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        right: "0",
                        background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                        color: "white",
                        padding: "15px 10px 10px",
                        fontSize: "14px",
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      Couple Chair
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>{" "}          {/* FAQ Section */}
          <FAQ ref={faqRef} />
        </div>
      </ClickSpark>
    </UserLayout>
  );
};

export default HomePage;
