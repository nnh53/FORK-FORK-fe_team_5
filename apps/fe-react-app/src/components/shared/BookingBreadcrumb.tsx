import React from "react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbStep {
  label: string;
  path: string;
  isActive: boolean;
}

export interface BookingBreadcrumbProps {
  movieTitle?: string;
  className?: string;
}

const BookingBreadcrumb: React.FC<BookingBreadcrumbProps> = ({ movieTitle, className }) => {
  const location = useLocation();

  const steps: BreadcrumbStep[] = [
    {
      label: "Trang chủ",
      path: "/",
      isActive: location.pathname === "/",
    },
    {
      label: "Chọn ghế",
      path: "/booking",
      isActive: location.pathname === "/booking",
    },
    {
      label: "Thanh toán",
      path: "/checkout",
      isActive: location.pathname === "/checkout",
    },
  ];

  return (
    <div className={`breadcrumbs text-sm ${className || ""}`}>
      <ul>
        {steps.map((step, index) => (
          <li key={step.path}>
            {step.isActive ? (
              <span className="font-medium text-primary">
                {step.label}
                {movieTitle && step.label === "Chọn ghế" && <span className="ml-2 text-base-content/60">- {movieTitle}</span>}
              </span>
            ) : (
              <Link to={step.path} className="hover:text-primary transition-colors">
                {step.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingBreadcrumb;
