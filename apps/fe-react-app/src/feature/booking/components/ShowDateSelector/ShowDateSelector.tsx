import React from "react";

export interface ShowDateSelectorProps {
  dates: string[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const formatDate = (dateString: string): { day: string; month: string; dayOfWeek: string } => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const dayOfWeekNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const dayOfWeek = dayOfWeekNames[date.getDay()];
  return { day, month, dayOfWeek };
};

const ShowDateSelector: React.FC<ShowDateSelectorProps> = ({ dates, selectedDate, onSelectDate }) => {
  return (
    <div className="mb-6 flex justify-start border-b border-gray-200">
      <div className="flex w-screen items-center space-x-2 overflow-x-auto pb-px sm:w-auto sm:max-w-[64vw] md:w-auto md:max-w-[94vw]">
        {dates.map((dateStr) => {
          const { day, month, dayOfWeek } = formatDate(dateStr);
          const isActive = selectedDate === dateStr;
          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`min-w-16 flex-shrink-0 cursor-pointer border-b-2 px-2 py-2 text-center transition-colors sm:px-4 sm:py-3 ${isActive ? "border-red-600 text-red-600" : "border-transparent text-gray-900 hover:text-gray-900"}`}
            >
              <div className="items-center">
                <span className={`text-2xl leading-none sm:text-4xl ${isActive ? "font-semibold" : "font-normal"} block`}>{day}</span>
                <span className={`mt-1 block text-xs leading-none sm:text-lg ${isActive ? "font-bold" : "font-medium"}`}>
                  /{month} - {dayOfWeek}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ShowDateSelector;
