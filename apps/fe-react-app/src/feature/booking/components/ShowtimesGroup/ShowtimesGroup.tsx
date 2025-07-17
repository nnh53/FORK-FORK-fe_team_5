import { useAvailableSeats } from "@/hooks/useAvailableSeats";
import type { UIShowtime } from "@/interfaces/staff-sales.interface";
import React, { useMemo } from "react";
import type { SchedulePerDay } from "../ShowtimesModal/ShowtimesModal";

interface ShowtimesGroupProps {
  scheduleForDay?: SchedulePerDay;
  onSelectShowtime: (showtime: { time: string; format: string; showtimeId: string; roomId: string }) => void;
}

const ShowtimesGroup: React.FC<ShowtimesGroupProps> = ({ scheduleForDay, onSelectShowtime }) => {
  const ShowtimeButton = ({ showtime }: { showtime: UIShowtime }) => {
    const { availableSeats, isLoading } = useAvailableSeats(parseInt(showtime.id));

    let seatLabel = "...";
    if (!isLoading) {
      seatLabel = availableSeats > 0 ? `${availableSeats} ghế trống` : "Hết vé";
    }

    return (
      <button
        onClick={() =>
          onSelectShowtime({
            time: showtime.startTime,
            format: showtime.format,
            showtimeId: showtime.id,
            roomId: showtime.cinemaRoomId,
          })
        }
        className="rounded-md border border-gray-300 bg-gray-50 p-2 text-center transition-all duration-200 hover:border-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isLoading || availableSeats === 0}
      >
        <p className="text-base font-bold text-gray-900">{showtime.startTime}</p>
        <p className="text-xs text-gray-500">{seatLabel}</p>
      </button>
    );
  };

  const groupedShowtimes = useMemo(() => {
    if (!scheduleForDay?.showtimes) return {};

    return scheduleForDay.showtimes.reduce(
      (acc, showtime) => {
        acc[showtime.format] = acc[showtime.format] || [];
        acc[showtime.format].push(showtime);
        return acc;
      },
      {} as Record<string, UIShowtime[]>,
    );
  }, [scheduleForDay]);

  // Sort showtimes for each format by startTime (00:00 to 23:59)
  const sortedGroupedShowtimes = useMemo(() => {
    const sorted: Record<string, UIShowtime[]> = {};
    Object.entries(groupedShowtimes).forEach(([format, showtimes]) => {
      sorted[format] = [...showtimes].sort((a, b) => {
        // Compare startTime strings directly (works for HH:mm format)
        return a.startTime.localeCompare(b.startTime);
      });
    });
    return sorted;
  }, [groupedShowtimes]);

  if (!scheduleForDay || scheduleForDay.showtimes.length === 0) {
    return <p className="py-8 text-center text-gray-500">Không có suất chiếu cho ngày này.</p>;
  }

  return (
    // CẬP NHẬT: Tăng khoảng cách giữa các group
    <div className="space-y-6">
      {Object.entries(sortedGroupedShowtimes).map(([format, showtimes]) => (
        <div key={format}>
          {/* CẬP NHẬT: Style lại tiêu đề định dạng (2D, 3D...) */}
          <h3 className="mb-3 text-sm font-bold uppercase text-gray-800">{format}</h3>
          {/* CẬP NHẬT: Tăng số cột trong grid */}
          <div className="grid grid-cols-4 gap-3 md:grid-cols-5 lg:grid-cols-6">
            {showtimes.map((showtime) => (
              <ShowtimeButton key={showtime.startTime} showtime={showtime} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowtimesGroup;
