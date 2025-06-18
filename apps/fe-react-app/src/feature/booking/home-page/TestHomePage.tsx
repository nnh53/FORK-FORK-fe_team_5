import { CardContent, Card as ShadcnCard } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ROUTES } from "@/routes/route.constants";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import CardSwap, { Card } from "../../../../Reactbits/CardSwap/CardSwap";
import ClickSpark from "../../../../Reactbits/ClickSpark/ClickSpark";
import hotBadge from "../../../assets/hotBadge.png";
import FooterTest from "../components/FooterTest/FooterTest";
import FrequentlyAsk from "../components/FrequentlyAsk";
import HeaderTest from "../components/HeaderTest/HeaderTest";
import WelcomePanel from "../components/WelcomePanel/WelcomePanel";
import "./TestHomePage.css";

gsap.registerPlugin(ScrollTrigger);

const TestHomePage = () => {
  const heroRef = useRef<HTMLElement | null>(null);
  const carouselRef = useRef<HTMLElement | null>(null);
  const cardSwapRef = useRef<HTMLElement | null>(null);
  const featuredMoviesRef = useRef<HTMLElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  const faqRef = useRef<HTMLElement | null>(null);
  const parallaxRef = useRef<HTMLElement | null>(null);

  // Movie data for carousel
  const recentMovies = [
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

  useEffect(() => {
    // Create smooth scroll effect
    const smoothScroll = () => {
      const currentScroll = window.pageYOffset;
      document.body.style.setProperty("--scroll", currentScroll.toString());
      requestAnimationFrame(smoothScroll);
    };
    smoothScroll();

    // Hero section parallax and text animation
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    heroTl
      .to(".hero-bg", { yPercent: 50, ease: "none" })
      .to(".hero-content h1", { yPercent: -50, opacity: 0.5 }, 0)
      .to(".hero-content p", { yPercent: -30, opacity: 0.5 }, 0);

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
          trigger: carouselRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    );

    // Card Swap section animation
    gsap.fromTo(
      ".card-swap-section",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardSwapRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    );

    // Create a floating badge
    gsap.to(".hot-badge", {
      y: -15,
      rotation: 5,
      duration: 2,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Create section transitions with pinning
    gsap.utils.toArray<HTMLElement>(".panel").forEach((panel) => {
      ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        pin: true,
        pinSpacing: false,
        markers: false,
      });
    });

    // Featured movies animation with staggering
    gsap.fromTo(
      ".movie-card",
      {
        y: 100,
        opacity: 0,
        scale: 0.8,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: featuredMoviesRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    ); // Now showing text animation
    gsap.fromTo(
      ".now-showing-title",
      {
        x: -100,
        opacity: 0,
        scale: 0.5,
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "elastic.out(1, 0.3)",
        scrollTrigger: {
          trigger: featuredMoviesRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      },
    );

    // Experience section parallax
    const experienceTl = gsap.timeline({
      scrollTrigger: {
        trigger: experienceRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      },
    });

    experienceTl.fromTo(".experience-image", { y: 100 }, { y: -100 }).fromTo(".experience-text", { y: 50 }, { y: -50 }, "<");

    // Add parallax layers
    gsap.utils.toArray<HTMLElement>(".parallax-layer").forEach((layer) => {
      const depth = Number(layer.dataset.depth || "0folder");
      const movement = -(layer.offsetHeight * depth);

      gsap.fromTo(
        layer,
        { y: 0 },
        {
          y: movement,
          ease: "none",
          scrollTrigger: {
            trigger: parallaxRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }); // FAQ section animation
    gsap.fromTo(
      ".faq-content",
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: faqRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      },
    );

    // FAQ title animation
    gsap.fromTo(
      ".faq-title",
      {
        x: 100,
        opacity: 0,
        scale: 0.5,
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "elastic.out(1, 0.3)",
        scrollTrigger: {
          trigger: faqRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      },
    );

    return () => {
      // Clean up all ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
  return (
    <ClickSpark sparkColor="#8B4513" sparkSize={20} sparkRadius={40} sparkCount={8} duration={400}>
      <div className="test-home-page">
        <HeaderTest />
        {/* Hero Section */}
        <section className="hero-section panel" ref={heroRef}>
          <div className="hero-bg"></div>
          <div className="hero-content">
            <WelcomePanel />
            <button className="cta-button">
              <Link to={ROUTES.BOOKING}>Book Now</Link>
            </button>
          </div>
        </section>
        {/* New Releases Carousel Section */}
        <section className="carousel-section" ref={carouselRef} id="new-releases">
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
                  {recentMovies.map((movie) => (
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
        </section>{" "}
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
                  <div className="card-content" style={{ backgroundImage: "url(../../../assets/bg-top.png)" }}>
                    <h3>Avengers: Endgame</h3>
                    <p>Action • Adventure • 3h 2m</p>
                    <button className="card-button">View Details</button>
                  </div>
                </Card>
                <Card>
                  <div className="card-content" style={{ backgroundImage: "url(../../../assets/brickWall.jpg)" }}>
                    <h3>The Batman</h3>
                    <p>Action • Crime • 2h 56m</p>
                    <button className="card-button">View Details</button>
                  </div>
                </Card>
                <Card>
                  <div className="card-content" style={{ backgroundImage: "url(../../../assets/bg-top.png)" }}>
                    <h3>Dune</h3>
                    <p>Sci-Fi • Adventure • 2h 35m</p>
                    <button className="card-button">View Details</button>
                  </div>
                </Card>
                <Card>
                  <div className="card-content" style={{ backgroundImage: "url(../../../assets/brickWall.jpg)" }}>
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
                <div className="movie-poster">{movie === 1 && <img src={hotBadge} alt="Hot" className="hot-badge" />}</div>
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
            <div className="experience-image"></div>
          </div>
        </section>{" "}
        {/* FAQ Section */}
        <section className="faq-section" ref={faqRef}>
          <div className="section-header">
            <h2
              className="faq-title"
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
              Frequently Asked Questions
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
            className="faq-content"
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
            {/* Left Side - Image */}
            <div
              className="faq-image"
              style={{
                flex: "1",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "2rem",
              }}
            >
              <img
                src="faq.png"
                alt="Customer Support"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  height: "400px",
                  objectFit: "cover",
                  borderRadius: "15px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.3s ease",
                }}
              />
            </div>

            {/* Right Side - FrequentlyAsk */}
            <div
              className="faq-component"
              style={{
                flex: "1",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FrequentlyAsk />
            </div>
          </div>
        </section>{" "}
        <FooterTest />
      </div>
    </ClickSpark>
  );
};

export default TestHomePage;
