import { Card, CardContent } from "@/components/Shadcn/ui/card";
import { Clock, CreditCard, Film, Popcorn, Ticket, User } from "lucide-react";
import React from "react";

type Step = "movie" | "showtime" | "seats" | "snacks" | "customer" | "payment";

interface StepProgressProps {
  currentStep: Step;
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep }) => {
  const steps = [
    { key: "movie" as Step, label: "Chọn phim", icon: Film },
    { key: "showtime" as Step, label: "Chọn suất", icon: Clock },
    { key: "seats" as Step, label: "Chọn ghế", icon: Ticket },
    { key: "snacks" as Step, label: "Đồ ăn & Khuyến mãi", icon: Popcorn },
    { key: "customer" as Step, label: "Thông tin KH", icon: User },
    { key: "payment" as Step, label: "Thanh toán", icon: CreditCard },
  ];

  const getStepState = (stepKey: Step, index: number) => {
    const currentIndex = steps.findIndex((step) => step.key === currentStep);

    if (stepKey === currentStep) return "current";
    if (index < currentIndex) return "completed";
    return "pending";
  };

  const getStepStyles = (state: string) => {
    switch (state) {
      case "current":
        return "bg-blue-500 text-white";
      case "completed":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {steps.map(({ key, label, icon: Icon }, index) => {
            const state = getStepState(key, index);
            return (
              <div key={key} className="flex flex-col items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getStepStyles(state)}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="mt-1 text-xs">{label}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default StepProgress;
