import React from "react";
import { FlickeringGrid } from "./flickering-grid";
import { useMediaQuery } from "@/hooks/use-media-query";

interface FooterBottomProps {
  className?: string;
  copyrightText?: string;
}

const FooterBottom: React.FC<FooterBottomProps> = ({ className = "footer-bottom", copyrightText }) => {
  const tablet = useMediaQuery("(max-width: 1024px)");
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} F-Cinema. All Rights Reserved.`;

  return (
    <section className={className}>
      <p>{copyrightText || defaultCopyright}</p>
      <div className="relative z-0 mt-24 h-48 w-full md:h-64">
        <div className="to-background absolute inset-0 z-10 bg-gradient-to-t from-transparent from-40%" />
        <div className="absolute inset-0 mx-6">
          <FlickeringGrid
            text={tablet ? "FSA HCM_25" : "REACT_05 Group5"}
            fontSize={tablet ? 70 : 90}
            className="h-full w-full"
            squareSize={2}
            gridGap={tablet ? 2 : 3}
            color="#6B7280"
            maxOpacity={0.3}
            flickerChance={0.1}
          />
        </div>
      </div>
    </section>
  );
};

export default FooterBottom;
