import { ROUTES } from "@/routes/route.constants";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CardSwap, { Card } from "../../../../Reactbits/CardSwap/CardSwap";
import Carousel from "../../../../Reactbits/Carousel/Carousel";
import hotBadge from "../../../assets/hotBadge.png";
import nowShowingText from "../../../assets/nowShowingText.png";
import upComingText from "../../../assets/upComingText.png";
import FooterTest from "../components/FooterTest/FooterTest";
import HeaderTest from "../components/HeaderTest/HeaderTest";
import "./TestHomePage.css";
import WelcomePanel from "../components/WelcomePanel/WelcomePanel";

gsap.registerPlugin(ScrollTrigger);

const TestHomePage = () => {
  const heroRef = useRef<HTMLElement | null>(null);
  const carouselRef = useRef<HTMLElement | null>(null);
  const cardSwapRef = useRef<HTMLElement | null>(null);
  const featuredMoviesRef = useRef<HTMLElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  const comingSoonRef = useRef<HTMLElement | null>(null);
  const parallaxRef = useRef<HTMLElement | null>(null);

  // State for carousel width
  const [carouselWidth, setCarouselWidth] = useState(1000);

  // Handle window resize for responsive carousel
  useEffect(() => {
    const updateCarouselWidth = () => {
      const width = window.innerWidth;
      setCarouselWidth(width > 768 ? width * 0.85 : width * 0.95);
    };

    // Set initial width
    updateCarouselWidth();

    // Add resize listener
    window.addEventListener("resize", updateCarouselWidth);

    // Cleanup
    return () => window.removeEventListener("resize", updateCarouselWidth);
  }, []);

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
    );

    // Now showing text animation
    gsap.fromTo(
      ".now-showing-img",
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
      const depth = Number(layer.dataset.depth || 0);
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
    });

    // Coming soon animation
    gsap.fromTo(
      ".coming-soon-content",
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
          trigger: comingSoonRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      },
    );

    // Coming soon text animation
    gsap.fromTo(
      ".upcoming-img",
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
          trigger: comingSoonRef.current,
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
    <div className="test-home-page">
      <HeaderTest />

      {/* Hero Section */}
      <section className="hero-section panel" ref={heroRef}>
        <div className="hero-bg"></div>
        <div className="hero-content">
          <WelcomePanel />
          <h1>Experience Cinema Like Never Before</h1>
          <p>Immerse yourself in stunning visuals and captivating stories</p>
          <button className="cta-button">
            <Link to={ROUTES.BOOKING}>Book Now</Link>
          </button>
        </div>
      </section>

      {/* New Releases Carousel Section */}
      <section className="carousel-section" ref={carouselRef} id="new-releases">
        <div className="section-title">
          <h2>New Releases</h2>
          <div className="section-line"></div>
        </div>
        <div className="carousel-wrapper">
          <div
            style={{
              height: "400px",
              position: "relative",
              width: "100%",
              padding: "0 20px",
              maxWidth: "1800px",
            }}
          >
            <Carousel
              items={recentMovies}
              baseWidth={carouselWidth}
              autoplay={true}
              autoplayDelay={4000}
              pauseOnHover={true}
              loop={true}
              round={false}
            />
          </div>
        </div>
      </section>

      {/* Card Swap Section */}
      <section className="card-swap-section" ref={cardSwapRef} id="trending-movies">
        <div className="section-title">
          <h2>Trending Movies</h2>
          <div className="section-line"></div>
        </div>
        <div className="card-swap-wrapper">
          <CardSwap width={320} height={450} cardDistance={40} verticalDistance={20} delay={3000} pauseOnHover={true} skewAmount={5} easing="elastic">
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
            </Card>
          </CardSwap>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="featured-section" ref={featuredMoviesRef}>
        <div className="section-header">
          <img src={nowShowingText} alt="Now Showing" className="now-showing-img" />
          <div className="section-line"></div>
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
        <div className="parallax-layer" data-depth="0.3"></div>
        <div className="parallax-content">
          <h2>The Ultimate Movie Experience</h2>
          <p>Feel the magic of cinema</p>
        </div>
      </section>

      {/* Cinema Experience */}
      <section className="experience-section" ref={experienceRef}>
        <div className="experience-content">
          <div className="experience-text">
            <h2>Premium Cinema Experience</h2>
            <p>
              Luxury seating, state-of-the-art sound systems, and crystal-clear projection technology. Our theaters are designed to provide the
              ultimate movie-watching experience.
            </p>
            <button className="learn-button">Learn More</button>
          </div>
          <div className="experience-image"></div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="coming-soon-section" ref={comingSoonRef}>
        <div className="section-header">
          <img src={upComingText} alt="Coming Soon" className="upcoming-img" />
          <div className="section-line"></div>
        </div>
        <div className="coming-soon-content">
          <div className="coming-soon-image"></div>
          <div className="coming-soon-details">
            <h3>Blockbuster Title</h3>
            <p>Experience the most anticipated movie of the year. Coming next month to our theaters.</p>
            <button className="notify-button">Notify Me</button>
          </div>
        </div>
      </section>

      <FooterTest />
    </div>
  );
};

export default TestHomePage;
