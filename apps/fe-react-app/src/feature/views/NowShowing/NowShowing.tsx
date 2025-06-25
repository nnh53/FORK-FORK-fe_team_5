import TiltedCard from "@/components/Reactbits/reactbit-components/TiltedCard/TiltedCard";
import { forwardRef } from "react";
import "./NowShowing.css";

interface NowShowingProps {
  className?: string;
}

interface MovieData {
  id: number;
  title: string;
  genre: string;
  duration: string;
  posterUrl: string;
}

const NowShowing = forwardRef<HTMLElement, NowShowingProps>(({ className }, ref) => {
  // Mock data cho các phim đang chiếu
  const moviesData: MovieData[] = [
    {
      id: 1,
      title: "Avengers: Endgame",
      genre: "Action • Adventure",
      duration: "3h 2m",
      posterUrl: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    },
    {
      id: 2,
      title: "The Batman",
      genre: "Action • Crime",
      duration: "2h 56m",
      posterUrl: "https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    },
    {
      id: 3,
      title: "Dune",
      genre: "Sci-Fi • Adventure",
      duration: "2h 35m",
      posterUrl: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    },
    {
      id: 4,
      title: "Spider-Man: No Way Home",
      genre: "Action • Adventure",
      duration: "2h 28m",
      posterUrl: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    },
  ];
  return (
    <section className={`featured-section ${className ?? ""}`} ref={ref}>
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
        {moviesData.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <TiltedCard
              imageSrc={movie.posterUrl}
              altText={`${movie.title} poster`}
              captionText={movie.title}
              containerHeight="600px"
              containerWidth="100%"
              imageHeight="400px"
              imageWidth="300px"
              rotateAmplitude={15}
              scaleOnHover={1.2}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <div className="movie-overlay-content">
                  <h3>{movie.title}</h3>
                  {/* <p>
                    {movie.genre} • {movie.duration}
                  </p> */}
                </div>
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
});

NowShowing.displayName = "NowShowing";

export default NowShowing;
