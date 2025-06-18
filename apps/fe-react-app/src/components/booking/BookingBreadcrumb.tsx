import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
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
    <div className={className}>
      <Breadcrumb>
        <BreadcrumbList>
          {steps.map((step, index) => (
            <React.Fragment key={step.path}>
              <BreadcrumbItem>
                {step.isActive ? (
                  <BreadcrumbPage className="font-medium text-primary">
                    {step.label}
                    {movieTitle && step.label === "Chọn ghế" && <span className="ml-2 text-muted-foreground">- {movieTitle}</span>}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={step.path} className="hover:text-primary transition-colors">
                      {step.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < steps.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BookingBreadcrumb;
