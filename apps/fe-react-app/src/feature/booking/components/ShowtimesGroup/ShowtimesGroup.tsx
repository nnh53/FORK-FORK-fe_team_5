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
        className="w-full rounded-md border border-gray-300 bg-gray-50 p-1 text-center transition-all duration-200 hover:border-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2"
        disabled={isLoading || availableSeats === 0}
      >
        <p className="text-sm font-bold whitespace-nowrap text-gray-900 sm:text-base">{showtime.startTime}</p>
        <p className="text-[10px] whitespace-nowrap text-gray-500 sm:text-xs">{seatLabel}</p>
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
    <div className="mr-5 space-y-6 sm:mr-0">
      {Object.entries(sortedGroupedShowtimes).map(([format, showtimes]) => (
        <div key={format}>
          {/* CẬP NHẬT: Style lại tiêu đề định dạng (2D, 3D...) */}
          <h3 className="mb-3 text-sm font-bold text-gray-800 uppercase">{format}</h3>
          {/* CẬP NHẬT: Điều chỉnh số cột trong grid để hiển thị tốt hơn trên màn hình nhỏ */}
          <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 sm:gap-2 md:grid-cols-5 lg:grid-cols-6">
            {showtimes.map((showtime) => (
              <ShowtimeButton key={showtime.id} showtime={showtime} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowtimesGroup;
