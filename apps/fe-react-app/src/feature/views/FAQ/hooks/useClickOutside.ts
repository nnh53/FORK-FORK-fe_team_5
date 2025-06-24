import { useEffect } from "react";

export const useClickOutside = (expandedFolder: string | null, setExpandedFolder: (folder: string | null) => void) => {
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
