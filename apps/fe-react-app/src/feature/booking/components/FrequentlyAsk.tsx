import { useEffect, useRef, useState } from "react";
import Folder from "../../../../Reactbits/Folder/Folder";

interface FaqData {
  id: string;
  title: string;
  content: string;
  label: string;
  color: string;
}

const FAQ_DATA: FaqData[] = [
  {
    id: "folder1",
    title: "Cancel booking?",
    content: "Go to My Bookings section and click Cancel button to cancel your reservation",
    label: "Booking",
    color: "#D2691E",
  },
  {
    id: "folder2",
    title: "Refund policy?",
    content: "Refunds are processed within 24 hours after cancellation request is approved",
    label: "Refunds",
    color: "#D4791F",
  },
  {
    id: "folder3",
    title: "Seat selection?",
    content: "You can choose your preferred seats during the booking process before payment",
    label: "Seats",
    color: "#D78B1F",
  },
  {
    id: "folder4",
    title: "Payment methods?",
    content: "We accept all major credit cards, PayPal, and digital wallets for secure payment",
    label: "Payment",
    color: "#D99D1F",
  },
  {
    id: "folder5",
    title: "Movie schedules?",
    content: "Movie schedules are updated daily. Check our website for the latest showtimes and availability",
    label: "Schedules",
    color: "#DAA520",
  },
];

const useClickOutside = (expandedFolder: string | null, setExpandedFolder: (folder: string | null) => void) => {
  useEffect(() => {
    const handleClickAnywhere = (event: MouseEvent) => {
      if (expandedFolder) {
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
  }, [expandedFolder, setExpandedFolder]);
};

const createFaqItem = (faqData: FaqData, expandedFolder: string | null, handlePaperClick: (folderId: string, event: React.MouseEvent) => void) => {
  const isExpanded = expandedFolder === faqData.id;

  return [
    <div
      key={faqData.id}
      data-expanded={isExpanded}
      style={{
        padding: "4px",
        fontSize: isExpanded ? "10px" : "7px",
        color: "#333",
        lineHeight: "1.2",
        wordWrap: "break-word",
        transition: "all 0.3s ease",
      }}
    >
      <strong style={{ cursor: "pointer" }} onClick={(event) => handlePaperClick(faqData.id, event)}>
        {faqData.title}
      </strong>
      <br />
      <span
        style={{
          fontSize: isExpanded ? "9px" : "6px",
          transition: "all 0.3s ease",
        }}
      >
        {isExpanded ? faqData.content : "Click above"}
      </span>
    </div>,
  ];
};

const renderFolderGroup = (
  faqItems: FaqData[],
  expandedFolder: string | null,
  handlePaperClick: (folderId: string, event: React.MouseEvent) => void,
) => {
  return faqItems.map((faq) => (
    <div key={faq.id} style={{ textAlign: "center" }}>
      <Folder
        size={expandedFolder === faq.id ? 2 : 1.2}
        color={faq.color}
        className={`custom-${faq.id}`}
        items={createFaqItem(faq, expandedFolder, handlePaperClick)}
        expanded={expandedFolder === faq.id}
      />
      <p style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>{faq.label}</p>
    </div>
  ));
};

const FrequentlyAsk = () => {
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
    <div ref={containerRef} style={{ height: "600px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ marginBottom: "100px", color: "#666" }}>Click each folder to explore different questions</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "60px", justifyContent: "center", alignItems: "center" }}>
            {renderFolderGroup(firstRowFaqs, expandedFolder, handlePaperClick)}
          </div>

          <div style={{ display: "flex", gap: "40px", justifyContent: "center", alignItems: "center" }}>
            {renderFolderGroup(secondRowFaqs, expandedFolder, handlePaperClick)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyAsk;
