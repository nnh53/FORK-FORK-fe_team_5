import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Draggable);

const IntroViaLogin: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);
  const ticketRef = useRef<HTMLDivElement>(null);
  const ticketStubRef = useRef<HTMLDivElement>(null);
  const tearLineRef = useRef<SVGSVGElement>(null);

  // State to track if ticket has been torn
  const [isTorn, setIsTorn] = useState(false);

  // GSAP Animations
  useEffect(() => {
    if (!headingRef.current) return;

    // Split text into spans for letter animation
    const text = headingRef.current.textContent || "";
    headingRef.current.innerHTML = "";

    text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.display = "inline-block";
      headingRef.current?.appendChild(span);
    });

    // Animate each letter
    const letters = headingRef.current.querySelectorAll("span");

    gsap.from(letters, {
      opacity: 0,
      y: 100,
      rotationX: 90,
      stagger: 0.1,
      duration: 1,
      ease: "back.out",
    });

    // Page 2 animation with ScrollTrigger
    if (page2Ref.current) {
      gsap.from(page2Ref.current.children, {
        scrollTrigger: {
          trigger: page2Ref.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
      });
    }

    // Page 3 animation with ScrollTrigger
    if (page3Ref.current) {
      gsap.from(page3Ref.current, {
        scrollTrigger: {
          trigger: page3Ref.current,
          start: "top bottom",
          end: "center center",
          scrub: 1,
        },
        y: 150,
        opacity: 0,
        duration: 1.5,
      });
    }

    // Setup ScrollTrigger for entire sections
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      markers: false, // Set to true for debugging
      pin: false,
    });
  }, []);

  // Initialize draggable ticket stub
  useEffect(() => {
    if (!ticketStubRef.current || !ticketRef.current) return;

    // Add ticket animation styles
    const style = document.createElement("style");
    style.textContent = `
      .ticket-container {
        perspective: 1000px;
        width: 320px;
        height: 160px;
        position: relative;
        margin: 0 auto;
      }

      .ticket {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #2563eb 100%);
        border-radius: 16px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        display: flex;
        overflow: hidden;
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.3s ease;
      }

      .ticket:hover {
        transform: translateY(-5px) rotateX(5deg);
        box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
      }

      .ticket-main {
        width: 75%;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-right: 2px dashed rgba(255, 255, 255, 0.5);
        position: relative;
      }

      .ticket-stub {
        width: 25%;
        background: rgba(255, 255, 255, 0.15);
        padding: 20px 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-weight: bold;
        cursor: grab;
        z-index: 10;
      }

      .ticket-stub.torn {
        cursor: pointer;
        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
        border-radius: 0 16px 16px 0;
      }

      .ticket-stub-content {
        transform: rotate(90deg);
        white-space: nowrap;
        font-size: 14px;
        color: white;
      }

      .ticket-title {
        font-size: 24px;
        font-weight: bold;
        color: white;
        margin-bottom: 10px;
      }

      .ticket-info {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
      }

      .ticket-tear-line {
        position: absolute;
        top: 0;
        right: 25%;
        height: 100%;
        z-index: 5;
        pointer-events: none;
      }

      .tear-line {
        stroke: rgba(255, 255, 255, 0.5);
        stroke-width: 2;
        stroke-dasharray: 8 4;
      }

      .tear-icon {
        position: absolute;
        top: 50%;
        right: 25%;
        transform: translate(50%, -50%);
        width: 24px;
        height: 24px;
        color: rgba(255, 255, 255, 0.8);
        z-index: 20;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .tear-icon.hidden {
        opacity: 0;
      }

      .book-now-btn {
        display: inline-block;
        padding: 12px 30px;
        background: linear-gradient(90deg, #f472b6 0%, #ec4899 100%);
        color: white;
        font-weight: bold;
        border-radius: 30px;
        text-decoration: none;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 10px 20px rgba(236, 72, 153, 0.3);
      }

      .book-now-btn.visible {
        transform: translateY(0);
        opacity: 1;
      }

      .book-now-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 25px rgba(236, 72, 153, 0.4);
      }
    `;
    document.head.appendChild(style);

    // Initialize draggable for the ticket stub
    if (!isTorn) {
      const draggable = Draggable.create(ticketStubRef.current, {
        type: "x",
        bounds: {
          minX: 0,
          maxX: 200,
        },
        onDrag: function () {
          // Calculate progress of tear (0 to 1)
          const progress = Math.min(1, this.x / 100);

          // Apply rotation to simulate tearing
          gsap.set(ticketStubRef.current, {
            rotation: progress * 5,
            boxShadow: `-${progress * 5}px 0 ${progress * 15}px rgba(0, 0, 0, ${progress * 0.2})`,
          });

          // Gradually hide the tear line
          if (tearLineRef.current) {
            gsap.set(tearLineRef.current, {
              opacity: 1 - progress,
            });
          }
        },
        onDragEnd: function () {
          // If dragged more than halfway, complete the tear
          if (this.x > 80) {
            completeTear();
          } else {
            // Otherwise, return to original position
            gsap.to(ticketStubRef.current, {
              x: 0,
              rotation: 0,
              boxShadow: "none",
              duration: 0.5,
              ease: "elastic.out(1, 0.5)",
            });

            if (tearLineRef.current) {
              gsap.to(tearLineRef.current, {
                opacity: 1,
                duration: 0.5,
              });
            }
          }
        },
      })[0];

      // Function to complete the tear animation
      const completeTear = () => {
        // Animate stub moving away
        gsap.to(ticketStubRef.current, {
          x: 150,
          rotation: 10,
          boxShadow: "-10px 0 20px rgba(0, 0, 0, 0.3)",
          duration: 0.5,
          ease: "power3.out",
          onComplete: () => {
            // Update state to show the stub has been torn
            setIsTorn(true);

            // Show the book now button
            const bookNowBtn = document.querySelector(".book-now-btn");
            if (bookNowBtn) {
              bookNowBtn.classList.add("visible");
            }

            // Stop draggable
            draggable.kill();
          },
        });

        // Hide tear line
        if (tearLineRef.current) {
          gsap.to(tearLineRef.current, {
            opacity: 0,
            duration: 0.3,
          });
        }

        // Hide tear icon
        const tearIcon = document.querySelector(".tear-icon");
        if (tearIcon) {
          tearIcon.classList.add("hidden");
        }
      };
    }

    return () => {
      // Cleanup
      style.remove();
    };
  }, [isTorn]);

  const handleBookNowClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Animate button click
    const button = e.currentTarget;
    gsap
      .timeline()
      .to(button, {
        scale: 0.95,
        duration: 0.1,
      })
      .to(button, {
        scale: 1,
        duration: 0.1,
        onComplete: () => {
          navigate("/logviareg");
        },
      });
  };

  return (
    <div ref={containerRef} className="scroll-container bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white min-h-screen">
      {/* Page 1 - Intro with Animated Text */}
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <h1
          ref={headingRef}
          className="text-7xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
        >
          WELCOME TO FCINEMA
        </h1>
        <p className="mt-8 text-xl opacity-80">Scroll down to discover more</p>
        <div className="mt-8 animate-bounce">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>

      {/* Page 2 - Features */}
      <div ref={page2Ref} className="min-h-screen flex flex-col items-center justify-center p-8">
        <h2 className="text-5xl font-bold mb-16 text-center">Discover the Magic of Cinema</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
          <div className="bg-gray-800 bg-opacity-50 p-8 rounded-xl backdrop-filter backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4 text-blue-300">Immersive Experience</h3>
            <p className="text-gray-300">
              Step into a world of stunning visuals and crystal-clear sound. Our state-of-the-art theaters are designed to transport you directly into
              the heart of the story.
            </p>
          </div>

          <div className="bg-gray-800 bg-opacity-50 p-8 rounded-xl backdrop-filter backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4 text-purple-300">Convenience First</h3>
            <p className="text-gray-300">
              Book tickets online in seconds, choose your perfect seat, and enjoy our streamlined check-in. We've eliminated all the hassle so you can
              focus on enjoying the show.
            </p>
          </div>

          <div className="bg-gray-800 bg-opacity-50 p-8 rounded-xl backdrop-filter backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4 text-pink-300">Premium Comfort</h3>
            <p className="text-gray-300">
              Sink into our luxurious reclining seats with ample legroom. Designed for maximum comfort, you might forget you're not watching from your
              living room.
            </p>
          </div>

          <div className="bg-gray-800 bg-opacity-50 p-8 rounded-xl backdrop-filter backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4 text-green-300">Memorable Moments</h3>
            <p className="text-gray-300">
              Movies are better when shared. Create lasting memories with friends and family in an atmosphere designed to enhance every emotion the
              filmmakers intended.
            </p>
          </div>
        </div>
      </div>

      {/* Page 3 - Draggable Ticket */}
      <div ref={page3Ref} className="h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-4xl font-bold mb-10 text-center">Ready for Your Next Movie Adventure?</h2>

        <div className="mb-16 flex flex-col items-center">
          {/* Movie Ticket Component */}
          <div className="ticket-container" ref={ticketRef}>
            <div className="ticket">
              <div className="ticket-main">
                <div>
                  <div className="ticket-title">FCinema Experience</div>
                  <div className="ticket-info">
                    <p>Xé bên phải để tiếp tục</p>
                    <p className="mt-3">Drag the stub to reveal the booking button</p>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <div>
                    <div className="text-white opacity-70 text-xs">DATE</div>
                    <div className="text-white text-sm">TODAY</div>
                  </div>
                  <div>
                    <div className="text-white opacity-70 text-xs">SEAT</div>
                    <div className="text-white text-sm">VIP</div>
                  </div>
                  <div>
                    <div className="text-white opacity-70 text-xs">PRICE</div>
                    <div className="text-white text-sm">SPECIAL</div>
                  </div>
                </div>
              </div>

              <div className="ticket-stub" ref={ticketStubRef} style={{ transform: isTorn ? "translateX(150px) rotate(10deg)" : "none" }}>
                <div className="ticket-stub-content">TEAR HERE</div>
              </div>

              {/* Tear Line SVG */}
              <svg ref={tearLineRef} className="ticket-tear-line" width="2" height="100%" xmlns="http://www.w3.org/2000/svg">
                <line className="tear-line" x1="1" y1="0" x2="1" y2="100%" />
              </svg>

              {/* Tear Icon */}
              <div className={`tear-icon ${isTorn ? "hidden" : ""}`}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Book Now Button (hidden initially, shown after tear) */}
          <a href="#" className={`book-now-btn mt-12 ${isTorn ? "visible" : ""}`} onClick={handleBookNowClick}>
            Đặt phim ngay
          </a>
        </div>
      </div>
    </div>
  );
};

export default IntroViaLogin;
