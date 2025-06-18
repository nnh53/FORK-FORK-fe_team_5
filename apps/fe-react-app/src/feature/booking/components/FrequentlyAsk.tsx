import { useEffect, useRef, useState } from "react";
import Folder from "../../../../Reactbits/Folder/Folder";

const FrequentlyAsk = () => {
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePaperClick = (folderId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event bubbling
    setExpandedFolder(expandedFolder === folderId ? null : folderId);
  };
  // Close expanded folder when clicking anywhere
  useEffect(() => {
    const handleClickAnywhere = (event: MouseEvent) => {
      if (expandedFolder) {
        // Check if click is on any expanded paper content
        const target = event.target as HTMLElement;
        const isClickOnExpandedPaper = target.closest(".paper-expanded") || target.closest('[data-expanded="true"]');

        if (!isClickOnExpandedPaper) {
          setExpandedFolder(null);
        }
      }
    };

    if (expandedFolder) {
      document.addEventListener("mousedown", handleClickAnywhere);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickAnywhere);
    };
  }, [expandedFolder]);
  const faq1 = [
    <div
      key="faq1"
      data-expanded={expandedFolder === "folder1"}
      style={{
        padding: "4px",
        fontSize: expandedFolder === "folder1" ? "10px" : "7px",
        color: "#333",
        lineHeight: "1.2",
        wordWrap: "break-word",
        transition: "all 0.3s ease",
      }}
    >
      <strong style={{ cursor: "pointer" }} onClick={(event) => handlePaperClick("folder1", event)}>
        Cancel booking?
      </strong>
      <br />
      <span
        style={{
          fontSize: expandedFolder === "folder1" ? "9px" : "6px",
          transition: "all 0.3s ease",
        }}
      >
        {expandedFolder === "folder1" ? "Go to My Bookings section and click Cancel button to cancel your reservation" : "Click above"}
      </span>
    </div>,
  ];
  const faq2 = [
    <div
      key="faq2"
      data-expanded={expandedFolder === "folder2"}
      style={{
        padding: "4px",
        fontSize: expandedFolder === "folder2" ? "10px" : "7px",
        color: "#333",
        lineHeight: "1.2",
        wordWrap: "break-word",
        transition: "all 0.3s ease",
      }}
    >
      <strong style={{ cursor: "pointer" }} onClick={(event) => handlePaperClick("folder2", event)}>
        Refund policy?
      </strong>
      <br />
      <span
        style={{
          fontSize: expandedFolder === "folder2" ? "9px" : "6px",
          transition: "all 0.3s ease",
        }}
      >
        {expandedFolder === "folder2" ? "Refunds are processed within 24 hours after cancellation request is approved" : "Click above"}
      </span>
    </div>,
  ];
  const faq3 = [
    <div
      key="faq3"
      data-expanded={expandedFolder === "folder3"}
      style={{
        padding: "4px",
        fontSize: expandedFolder === "folder3" ? "10px" : "7px",
        color: "#333",
        lineHeight: "1.2",
        wordWrap: "break-word",
        transition: "all 0.3s ease",
      }}
    >
      <strong style={{ cursor: "pointer" }} onClick={(event) => handlePaperClick("folder3", event)}>
        Seat selection?
      </strong>
      <br />
      <span
        style={{
          fontSize: expandedFolder === "folder3" ? "9px" : "6px",
          transition: "all 0.3s ease",
        }}
      >
        {expandedFolder === "folder3" ? "You can choose your preferred seats during the booking process before payment" : "Click above"}
      </span>
    </div>,
  ];
  return (
    <div ref={containerRef} style={{ height: "600px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h3 style={{ marginBottom: "30px", color: "#5227FF" }}>Frequently Asked Questions</h3>
        <p style={{ marginBottom: "30px", color: "#666" }}>Click each folder to explore different questions</p>{" "}
        <div style={{ display: "flex", gap: "40px", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <Folder
              size={expandedFolder === "folder1" ? 2 : 1.5}
              color="#5227FF"
              className="custom-folder-1"
              items={faq1}
              expanded={expandedFolder === "folder1"}
            />
            <p style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>Booking</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <Folder
              size={expandedFolder === "folder2" ? 2 : 1.5}
              color="#FF6B35"
              className="custom-folder-2"
              items={faq2}
              expanded={expandedFolder === "folder2"}
            />
            <p style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>Refunds</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <Folder
              size={expandedFolder === "folder3" ? 2 : 1.5}
              color="#00C9A7"
              className="custom-folder-3"
              items={faq3}
              expanded={expandedFolder === "folder3"}
            />
            <p style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>Seats</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyAsk;
