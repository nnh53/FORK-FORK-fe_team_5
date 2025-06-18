import React, { useState } from "react";
import "./Folder.css";

interface FolderProps {
  color?: string;
  size?: number;
  items?: React.ReactNode[];
  className?: string;
  expanded?: boolean;
}

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith("#") ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const Folder: React.FC<FolderProps> = ({ color = "#F4A460", size = 1, items = [], className = "", expanded = false }) => {
  const [open, setOpen] = useState(false);
  const [paperOffset, setPaperOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const folderBackColor = darkenColor(color, 0.08);
  const paper1 = "#ffffff";

  const handleClick = () => {
    setOpen((prev) => !prev);
    if (open) {
      setPaperOffset({ x: 0, y: 0 });
    }
  };

  const handlePaperMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.15;
    const offsetY = (e.clientY - centerY) * 0.15;
    setPaperOffset({ x: offsetX, y: offsetY });
  };

  const handlePaperMouseLeave = () => {
    setPaperOffset({ x: 0, y: 0 });
  };

  const folderStyle: React.CSSProperties = {
    "--folder-color": color,
    "--folder-back-color": folderBackColor,
    "--paper-1": paper1,
  } as React.CSSProperties;

  const folderClassName = `folder ${open ? "open" : ""}`.trim();
  const scaleStyle = { transform: `scale(${size})` };

  return (
    <div style={scaleStyle} className={className}>
      <button
        className={folderClassName}
        style={{
          ...folderStyle,
          border: "none",
          padding: 0,
          background: "transparent",
          cursor: "pointer",
        }}
        onClick={handleClick}
        aria-label="Toggle folder to view content"
        type="button"
      >
        <div className="folder__back">
          {items[0] && (
            <div
              key="paper-single"
              className={`paper paper-1 ${expanded ? "paper-expanded" : ""}`}
              onMouseMove={handlePaperMouseMove}
              onMouseLeave={handlePaperMouseLeave}
              style={
                open
                  ? ({
                      "--magnet-x": `${paperOffset.x}px`,
                      "--magnet-y": `${paperOffset.y}px`,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      transform: expanded ? `translate(-50%, -80%) rotateZ(0deg) scale(1.3)` : `translate(-50%, -80%) rotateZ(0deg)`,
                      transition: "all 0.3s ease",
                      zIndex: expanded ? 10 : 2,
                    } as React.CSSProperties)
                  : {
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }
              }
            >
              {items[0]}
            </div>
          )}
          <div className="folder__front"></div>
          <div className="folder__front right"></div>
        </div>
      </button>
    </div>
  );
};

export default Folder;
