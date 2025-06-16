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
    <div className="flex justify-start border-b border-gray-200 mb-6">
      <div className="flex items-center space-x-4 overflow-x-auto pb-px">
        {dates.map((dateStr) => {
          const { day, month, dayOfWeek } = formatDate(dateStr);
          const isActive = selectedDate === dateStr;
          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`text-center py-3 px-4 cursor-pointer transition-colors flex-shrink-0 border-b-2
            ${isActive ? "border-red-600 text-red-600" : "border-transparent text-gray-900 hover:text-gray-900"}`}
            >
              <div className=" items-center">
                <a className={`text-4xl leading-none ${isActive ? "font-semibold" : "font-normal"}`}>{day}</a>
                <a className={`text-lg leading-none mt-1 ${isActive ? "font-bold" : "font-medium"}`}>
                  /{month} - {dayOfWeek}
                </a>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ShowDateSelector;
