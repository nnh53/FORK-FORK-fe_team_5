import { ROUTES } from "@/routes/route.constants";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FCinemaLogo from "../../../../assets/FCinema_Logo.png";
import "./HeaderTest.css";

gsap.registerPlugin(ScrollTrigger);

const HeaderTest = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Animation for header on scroll
    const headerAnim = gsap.timeline({
      scrollTrigger: {
        start: "top top",
        end: "+=100",
        scrub: true,
        onUpdate: (self) => {
          if (self.progress > 0) {
            setScrolled(true);
          } else {
            setScrolled(false);
          }
        },
      },
    });

    headerAnim.to(".header-test", {
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      boxShadow: "0 5px 20px rgba(0, 0, 0, 0.3)",
      height: "70px",
      duration: 0.5,
    });

    // Logo animation
    gsap.fromTo(".logo", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, delay: 0.5 });

    // Menu items animation
    gsap.fromTo(".nav-link", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.7 });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header-test ${scrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="logo">
          <img src={FCinemaLogo} alt="F-Cinema Logo" />
          <span>F-Cinema</span>
        </div>

        <div className={`hamburger ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <ul>
            <li>
              <a href="#" className="nav-link">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Movies
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Theaters
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Offers
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Membership
              </a>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <button className="login-button">
            <Link to={ROUTES.AUTH.LOGIN}>Login</Link>
          </button>
          <button className="book-button">Book Now</button>
        </div>
      </div>
    </header>
  );
};

export default HeaderTest;
