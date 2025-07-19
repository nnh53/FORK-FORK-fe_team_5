import React from "react";
import type { FaqData } from "../data/faqData";

interface FaqItemProps {
  faqData: FaqData;
  isExpanded: boolean;
  onItemClick: (folderId: string, event: React.MouseEvent) => void;
}

export const FaqItem: React.FC<FaqItemProps> = ({ faqData, isExpanded, onItemClick }) => {
  return (
    <div
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
      <strong style={{ cursor: "pointer" }} onClick={(event) => onItemClick(faqData.id, event)}>
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
    </div>
  );
};
