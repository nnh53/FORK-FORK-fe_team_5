import React, { forwardRef, useRef, useState } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { FaqFolderGroup } from "../components/FaqFolderGroup";
import { FAQ_DATA } from "../data/faqData";
import "../styles/faq.css";

interface FAQProps {
  className?: string;
}

const FAQ = forwardRef<HTMLElement, FAQProps>(({ className }, ref) => {
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePaperClick = (folderId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedFolder(expandedFolder === folderId ? null : folderId);
  };

  useClickOutside(expandedFolder, setExpandedFolder);

  const firstRowFaqs = FAQ_DATA.slice(0, 2);
  const secondRowFaqs = FAQ_DATA.slice(2, 5);

  return (
    <section id="faq" className={`faq-section ${className || ""}`} ref={ref}>
      {/* Section Header */}
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
            fontFamily: "Open Sans",
          }}
        >
          Câu Hỏi Thường Gặp
        </h2>
        <div
          className="section-line"
          style={{
            background: "linear-gradient(to right, #946b38, #392819)",
            height: "3px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="faq-content">
        {/* Left Side - Image */}
        <div className="faq-image">
          <img
            src="https://pub-78054fb93d354b70874e7689a78e2705.r2.dev/images/426b9b5a-914b-4373-b8b6-b8dd6fb82c2c-faq.webp"
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

        {/* Right Side - FAQ Interactive Component */}
        <div className="faq-component">
          <div
            ref={containerRef}
            style={{
              height: "600px",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <p style={{ marginBottom: "100px", color: "#666" }}>Nhấp vào từng thư mục để khám phá các câu hỏi khác nhau</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "40px", alignItems: "center" }}>
                {/* First Row */}
                <div style={{ display: "flex", gap: "60px", justifyContent: "center", alignItems: "center" }}>
                  <FaqFolderGroup faqItems={firstRowFaqs} expandedFolder={expandedFolder} onItemClick={handlePaperClick} />
                </div>

                {/* Second Row */}
                <div style={{ display: "flex", gap: "40px", justifyContent: "center", alignItems: "center" }}>
                  <FaqFolderGroup faqItems={secondRowFaqs} expandedFolder={expandedFolder} onItemClick={handlePaperClick} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

FAQ.displayName = "FAQ";

export default FAQ;
