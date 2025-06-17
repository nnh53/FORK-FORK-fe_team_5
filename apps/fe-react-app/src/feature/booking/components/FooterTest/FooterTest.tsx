import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import FlowingMenu from "../../../../../Reactbits/FlowingMenu/FlowingMenu";
import FCinemaLogo from "../../../../assets/FCinema_Logo.png";
import "./FooterTest.css";

gsap.registerPlugin(ScrollTrigger);

const FooterTest = () => {
  const footerRef = useRef<HTMLElement | null>(null);
  const flowingMenuRef = useRef<HTMLDivElement | null>(null);

  // Định nghĩa menuItems cho FlowingMenu
  const menuItems = [
    {
      link: "#",
      text: "F-Cinema",
      image: "https://picsum.photos/600/400?random=1",
    },
    {
      link: "#",
      text: "Group 5",
      image: "https://picsum.photos/600/400?random=2",
    },
  ];

  useEffect(() => {
    // Reveal footer animation
    gsap.fromTo(
      footerRef.current,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom",
          toggleActions: "play none none none",
        },
      },
    );

    // Animate footer columns
    gsap.fromTo(
      ".footer-column",
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
      },
    );

    // Animate social links
    gsap.fromTo(
      ".social-icon",
      {
        scale: 0,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        delay: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom-=50",
          toggleActions: "play none none none",
        },
      },
    );

    // Animate FlowingMenu
    gsap.fromTo(
      flowingMenuRef.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
        delay: 0.5,
        scrollTrigger: {
          trigger: flowingMenuRef.current,
          start: "top bottom",
          toggleActions: "play none none none",
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <footer className="footer-test" ref={footerRef}>
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-column">
              <div className="footer-logo">
                <img src={FCinemaLogo} alt="F-Cinema Logo" />
                <h3>F-Cinema</h3>
              </div>
              <p>Experience cinema like never before with the latest blockbusters and timeless classics in state-of-the-art theaters.</p>
              <div className="social-links">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook-f">F</i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter">T</i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-instagram">I</i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-youtube">Y</i>
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Movies</a>
                </li>
                <li>
                  <a href="#">Theaters</a>
                </li>
                <li>
                  <a href="#">Offers</a>
                </li>
                <li>
                  <a href="#">Gift Cards</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                <li>
                  <a href="#">FAQs</a>
                </li>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Newsletter</h4>
              <p>Subscribe to our newsletter for the latest movie updates and exclusive offers.</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email address" />
                <button>Subscribe</button>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} F-Cinema. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* FlowingMenu section */}
      <div className="flowing-menu-container" ref={flowingMenuRef} style={{ height: "300px", position: "relative" }}>
        <FlowingMenu items={menuItems} />
      </div>
    </>
  );
};

export default FooterTest;
