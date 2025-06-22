import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog.tsx";
import React, { useEffect, useMemo, useState } from "react";
import ShowDateSelector from "../ShowDateSelector/ShowDateSelector.tsx";
import ShowtimesGroup from "../ShowtimesGroup/ShowtimesGroup";

export interface Showtime {
  time: string;
  availableSeats: number;
  format: string;
  price?: number;
  showtimeId?: string;
  cinemaRoomId?: string;
  endTime?: string;
}

export interface SchedulePerDay {
  date: string;
  showtimes: Showtime[];
}

export interface ShowtimesModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieTitle: string;
  cinemaName: string;
  scheduleData: SchedulePerDay[];
  onSelectShowtime: (selected: { date: string; time: string; format: string }) => void;
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
  const handleShowtimeSelection = (showtime: { time: string; format: string }) => {
    if (selectedDate) {
      onSelectShowtime({
        date: selectedDate,
        time: showtime.time,
        format: showtime.format,
      });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-700 uppercase">LỊCH CHIẾU - {movieTitle}</DialogTitle>
        </DialogHeader>

        <div className="p-4 sm:p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{cinemaName}</h1>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-600 text-lg">Đang tải lịch chiếu...</div>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-red-500 text-lg">{error}</div>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              <ShowDateSelector dates={availableDates} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
              <ShowtimesGroup scheduleForDay={scheduleForSelectedDay} onSelectShowtime={handleShowtimeSelection} />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowtimesModal;
