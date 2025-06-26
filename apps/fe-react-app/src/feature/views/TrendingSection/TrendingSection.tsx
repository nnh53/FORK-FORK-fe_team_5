import CardSwap, { Card } from "@/components/Reactbits/reactbit-components/CardSwap/CardSwap";
import { forwardRef } from "react";

interface TrendingSectionProps {
  className?: string;
}

const TrendingSection = forwardRef<HTMLElement, TrendingSectionProps>(({ className }, ref) => {
  return (
    <section className={`card-swap-section ${className ?? ""}`} ref={ref} id="trending-movies">
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
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "2rem",
            position: "relative",
            marginBottom: "40px",
          }}
        >
          <div style={{ height: "600px", position: "relative", transform: "translateY(-50px)" }}>
            <CardSwap cardDistance={60} verticalDistance={70} delay={3000} pauseOnHover={false}>
              <Card
                style={{
                  backgroundColor: "#faf8f3",
                  color: "#333",
                  padding: "2rem",
                  borderRadius: "12px",
                  border: "1px solid #e8e5e0",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem", color: "#946b38" }}>Trending Movie 1</h3>
                <p style={{ fontSize: "1rem", lineHeight: "1.5", color: "#666" }}>Experience the latest blockbuster with stunning visuals</p>
              </Card>
              <Card
                style={{
                  backgroundColor: "#faf8f3",
                  color: "#333",
                  padding: "2rem",
                  borderRadius: "12px",
                  border: "1px solid #e8e5e0",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem", color: "#946b38" }}>Trending Movie 2</h3>
                <p style={{ fontSize: "1rem", lineHeight: "1.5", color: "#666" }}>Action-packed adventure that will keep you on edge</p>
              </Card>
              <Card
                style={{
                  backgroundColor: "#faf8f3",
                  color: "#333",
                  padding: "2rem",
                  borderRadius: "12px",
                  border: "1px solid #e8e5e0",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem", color: "#946b38" }}>Trending Movie 3</h3>
                <p style={{ fontSize: "1rem", lineHeight: "1.5", color: "#666" }}>Drama and emotion in perfect harmony</p>
              </Card>
              <Card
                style={{
                  backgroundColor: "#faf8f3",
                  color: "#333",
                  padding: "2rem",
                  borderRadius: "12px",
                  border: "1px solid #e8e5e0",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem", color: "#946b38" }}>Trending Movie 4</h3>
                <p style={{ fontSize: "1rem", lineHeight: "1.5", color: "#666" }}>Comedy that brings joy and laughter</p>
              </Card>
            </CardSwap>
          </div>
        </div>
      </div>
    </section>
  );
});

TrendingSection.displayName = "TrendingSection";

export default TrendingSection;
