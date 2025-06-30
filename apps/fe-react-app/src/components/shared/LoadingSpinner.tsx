import { cn } from "@/utils/utils";
import React from "react";
export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const LoadingSpin = ({ size = 24, className, ...props }: ISVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

// --- Thêm component tiện dụng cho loading section ---
interface LoadingSectionProps {
  name?: string;
  className?: string;
  heightFullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSectionProps> = ({ name, className, heightFullScreen = true }) => (
  <div className={cn("flex justify-center items-center", heightFullScreen ? "h-screen" : "py-12", className)}>
    <div className="flex flex-col items-center gap-4">
      <LoadingSpin size={32} className="text-primary" />
      <p className="text-muted-foreground">Đang tải {name ? `danh sách ${name}` : "dữ liệu"}...</p>
    </div>
  </div>
);
