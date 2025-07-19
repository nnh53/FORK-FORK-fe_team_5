import Folder from "@/components/Reactbits/reactbit-components/Folder/Folder";
import React from "react";
import type { FaqData } from "../data/faqData";
import { FaqItem } from "./FaqItem";

interface FaqFolderGroupProps {
  faqItems: FaqData[];
  expandedFolder: string | null;
  onItemClick: (folderId: string, event: React.MouseEvent) => void;
}

export const FaqFolderGroup: React.FC<FaqFolderGroupProps> = ({ faqItems, expandedFolder, onItemClick }) => {
  const createFaqItem = (faqData: FaqData) => {
    const isExpanded = expandedFolder === faqData.id;
    return [<FaqItem key={faqData.id} faqData={faqData} isExpanded={isExpanded} onItemClick={onItemClick} />];
  };

  return (
    <>
      {faqItems.map((faq) => (
        <div key={faq.id} style={{ textAlign: "center" }}>
          <Folder
            size={expandedFolder === faq.id ? 2 : 1.2}
            color={faq.color}
            className={`custom-${faq.id}`}
            items={createFaqItem(faq)}
            expanded={expandedFolder === faq.id}
          />
          <p style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>{faq.label}</p>
        </div>
      ))}
    </>
  );
};
