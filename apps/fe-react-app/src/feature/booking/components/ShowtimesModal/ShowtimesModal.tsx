import React, { useEffect, useMemo, useState } from "react";
import Modal from "../../../../components/shared/Modal/Modal.tsx";
import ShowDateSelector from "../ShowDateSelector/ShowDateSelector.tsx";
import ShowtimesGroup from "../ShowtimesGroup/ShowtimesGroup";

export interface Showtime {
  time: string;
  availableSeats: number;
  format: string;
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
}

const ShowtimesModal: React.FC<ShowtimesModalProps> = ({ isOpen, onClose, movieTitle, cinemaName, scheduleData, onSelectShowtime }) => {
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      // Truyền class để tùy chỉnh kích thước modal
      containerClassName="w-full max-w-4xl"
    >
      {/* Phần nội dung bên trong giữ nguyên các class Tailwind */}
      <div>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 uppercase">LỊCH CHIẾU - {movieTitle}</h2>
        </div>

        <div className="p-4 sm:p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{cinemaName}</h1>
          <ShowDateSelector dates={availableDates} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          <ShowtimesGroup scheduleForDay={scheduleForSelectedDay} onSelectShowtime={handleShowtimeSelection} />
        </div>
      </div>
    </Modal>
  );
};

export default ShowtimesModal;
