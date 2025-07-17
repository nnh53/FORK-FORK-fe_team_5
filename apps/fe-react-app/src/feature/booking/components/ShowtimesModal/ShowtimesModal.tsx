import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog.tsx";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { UIShowtime } from "@/interfaces/staff-sales.interface";
import React, { useEffect, useMemo, useState } from "react";
import ShowDateSelector from "../ShowDateSelector/ShowDateSelector.tsx";
import ShowtimesGroup from "../ShowtimesGroup/ShowtimesGroup";

export interface SchedulePerDay {
  date: string;
  showtimes: UIShowtime[];
}

export interface ShowtimesModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieTitle: string;
  cinemaName: string;
  scheduleData: SchedulePerDay[];
  onSelectShowtime: (selected: { date: string; time: string; format: string; showtimeId: string; roomId: string }) => void;
  loading?: boolean;
  error?: string | null;
}

const ShowtimesModal: React.FC<ShowtimesModalProps> = ({
  isOpen,
  onClose,
  movieTitle,
  cinemaName,
  scheduleData,
  onSelectShowtime,
  loading = false,
  error = null,
}) => {
  // ... (toàn bộ logic useState, useMemo, useEffect giữ nguyên)
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const availableDates = useMemo(() => scheduleData.map((s) => s.date), [scheduleData]);

  useEffect(() => {
    if (isOpen && availableDates.length > 0) {
      setSelectedDate(availableDates[0]);
    }
  }, [isOpen, availableDates]);

  const scheduleForSelectedDay = useMemo(() => {
    return scheduleData.find((d) => d.date === selectedDate);
  }, [selectedDate, scheduleData]);
  const handleShowtimeSelection = (showtime: { time: string; format: string; showtimeId: string; roomId: string }) => {
    if (selectedDate) {
      onSelectShowtime({
        date: selectedDate,
        time: showtime.time,
        format: showtime.format,
        showtimeId: showtime.showtimeId,
        roomId: showtime.roomId,
      });
    }
  };
  // Sử dụng hook useMediaQuery để xác định kích thước màn hình
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Xác định các lớp CSS và nội dung dựa trên kích thước màn hình
  let dialogContentClass = "min-w-3xl max-h-[90vh] w-full max-w-4xl overflow-y-auto";
  if (isMobile) {
    dialogContentClass = " max-w-[95vw] p-2";
  }

  const titleSizeClass = isMobile ? "text-base" : "text-lg";

  // Xử lý tiêu đề phim nếu quá dài trên màn hình nhỏ
  let displayMovieTitle = movieTitle;
  if (isMobile && movieTitle.length > 15) {
    displayMovieTitle = `${movieTitle.substring(0, 15)}...`;
  }

  // Xác định padding cho nội dung
  let contentPaddingClass = "";
  if (isMobile) {
    contentPaddingClass = "p-2";
  }

  const headingClass = `mb-4 sm:mb-6 text-center ${isMobile ? "text-xl" : "text-3xl"} font-bold text-gray-800`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle className={`${titleSizeClass} font-semibold uppercase text-gray-700`}>LỊCH CHIẾU - {displayMovieTitle}</DialogTitle>
        </DialogHeader>

        <div className={contentPaddingClass}>
          <h1 className={headingClass}>{cinemaName}</h1>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-6 sm:py-12">
              <div className={`${isMobile ? "text-base" : "text-lg"} text-gray-600`}>Đang tải lịch chiếu...</div>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="flex items-center justify-center py-6 sm:py-12">
              <div className={`${isMobile ? "text-base" : "text-lg"} text-red-500`}>{error}</div>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <div className={isMobile ? "space-y-4" : "space-y-6"}>
              <ShowDateSelector dates={availableDates} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
              <ShowtimesGroup scheduleForDay={scheduleForSelectedDay} onSelectShowtime={handleShowtimeSelection} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowtimesModal;
