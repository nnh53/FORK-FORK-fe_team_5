import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import "./WelcomePanel.css";

const WelcomePanel = () => {
  const welcomeTextRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentWelcomeTextRef = welcomeTextRef.current;

    if (currentWelcomeTextRef) {
      const welcomeLetters = currentWelcomeTextRef.querySelectorAll(".letter");

      // Clear any existing animations
      gsap.set(welcomeLetters, { autoAlpha: 0, y: 0, rotationX: 0 });

      // Create timeline for welcome text animation
      const welcomeTl = gsap.timeline({ delay: 0.5 });

      // W - from left, flipping up
      welcomeTl.fromTo(
        welcomeLetters[0],
        { autoAlpha: 0, x: -50, rotationX: -90 },
        { autoAlpha: 1, x: 0, rotationX: 0, duration: 0.7, ease: "back.out" },
      );

      // E - from top
      welcomeTl.fromTo(welcomeLetters[1], { autoAlpha: 0, y: -50 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");

      // L - following E
      welcomeTl.fromTo(welcomeLetters[2], { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.25");

      // C - appearing from behind L
      welcomeTl.fromTo(
        welcomeLetters[3],
        { autoAlpha: 0, scale: 0.5, transformOrigin: "left center" },
        { autoAlpha: 1, scale: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" },
        "-=0.2",
      );

      // O - appearing from C
      welcomeTl.fromTo(
        welcomeLetters[4],
        { autoAlpha: 0, scale: 0.5, transformOrigin: "left center" },
        { autoAlpha: 1, scale: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" },
        "-=0.3",
      );

      // M - following O
      welcomeTl.fromTo(welcomeLetters[5], { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" }, "-=0.2");

      // E - last letter
      welcomeTl.fromTo(welcomeLetters[6], { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");

      // Space
      welcomeTl.fromTo(welcomeLetters[7], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, "-=0.1");

      // T - from top
      welcomeTl.fromTo(welcomeLetters[8], { autoAlpha: 0, y: -50 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, "+=0.1");

      // O - from bottom
      welcomeTl.fromTo(welcomeLetters[9], { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");

      // Space
      welcomeTl.fromTo(welcomeLetters[10], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, "-=0.1");

      // F - from left, flipping up (like W)
      welcomeTl.fromTo(
        welcomeLetters[11],
        { autoAlpha: 0, x: -50, rotationX: -90 },
        { autoAlpha: 1, x: 0, rotationX: 0, duration: 0.7, ease: "back.out" },
        "+=0.1",
      );

      // Hyphen - like F
      welcomeTl.fromTo(
        welcomeLetters[12],
        { autoAlpha: 0, x: -30, rotationX: -90 },
        { autoAlpha: 1, x: 0, rotationX: 0, duration: 0.5, ease: "back.out" },
        "-=0.4",
      );

      // C - fade in from right
      welcomeTl.fromTo(welcomeLetters[13], { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power2.out" }, "+=0.1");

      // I - fade in from right
      welcomeTl.fromTo(welcomeLetters[14], { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power2.out" }, "-=0.2");

      // N - fade in from right
      welcomeTl.fromTo(welcomeLetters[15], { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power2.out" }, "-=0.2");

      // E - fade in from right
      welcomeTl.fromTo(welcomeLetters[16], { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power2.out" }, "-=0.2");

      // M - fade in from right
      welcomeTl.fromTo(welcomeLetters[17], { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power2.out" }, "-=0.2");

      // A - special animation from large to normal size
      welcomeTl.fromTo(
        welcomeLetters[18],
        { autoAlpha: 0, scale: 30, transformOrigin: "center center" },
        { autoAlpha: 1, scale: 1, duration: 3, ease: "power4.out" },
        "-=0.2",
      );
    }

    return () => {
      // Cleanup animation if component unmounts
      if (currentWelcomeTextRef) {
        gsap.killTweensOf(currentWelcomeTextRef.querySelectorAll(".letter"));
      }
    };
  }, []);

  return (
    <div className="welcome-panel">
      <div className="welcome-text" ref={welcomeTextRef}>
        <span className="letter">W</span>
        <span className="letter">e</span>
        <span className="letter">l</span>
        <span className="letter">c</span>
        <span className="letter">o</span>
        <span className="letter">m</span>
        <span className="letter">e</span>
        <span className="letter space"> </span>
        <span className="letter">t</span>
        <span className="letter">o</span>
        <span className="letter space"> </span>
        <span className="letter">F</span>
        <span className="letter hyphen">-</span>
        <span className="letter">C</span>
        <span className="letter">i</span>
        <span className="letter">n</span>
        <span className="letter">e</span>
        <span className="letter">m</span>
        <span className="letter special-a">a</span>
      </div>
    </div>
  );
};

export default WelcomePanel;
