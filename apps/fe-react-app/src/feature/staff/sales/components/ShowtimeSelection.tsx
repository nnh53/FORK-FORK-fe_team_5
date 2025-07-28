import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { useAvailableSeats } from "@/hooks/useAvailableSeats";
import type { Movie } from "@/interfaces/movies.interface";
import type { UIShowtime } from "@/interfaces/staff-sales.interface";
import { Clock } from "lucide-react";
import React from "react";

interface ShowtimeSelectionProps {
  selectedMovie: Movie;
  showtimes: UIShowtime[];
  selectedShowtime: UIShowtime | null;
  onShowtimeSelect: (showtime: UIShowtime) => void;
  onBack: () => void;
  onNext: () => void;
}

const ShowtimeSelection: React.FC<ShowtimeSelectionProps> = ({ selectedMovie, showtimes, selectedShowtime, onShowtimeSelect, onBack, onNext }) => {
  const ShowtimeItem = ({ showtime }: { showtime: UIShowtime }) => {
    const { availableSeats, isLoading } = useAvailableSeats(parseInt(showtime.id));

    return (
      <button
        onClick={() => handleShowtimeSelect(showtime)}
        className={`cursor-pointer rounded-lg border p-4 text-center transition-colors ${
          selectedShowtime?.id === showtime.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
        }`}
        type="button"
        disabled={isLoading || availableSeats === 0}
      >
        <div className="text-center">
          <div className="text-lg font-semibold">{showtime.startTime}</div>
          <div className="text-sm text-gray-500">{showtime.date}</div>
          <div className="text-sm text-gray-500">Phòng {showtime.cinemaRoomId}</div>
          <div className="text-sm text-green-600">{isLoading ? "..." : `${availableSeats} ghế trống`}</div>
        </div>
      </button>
    );
  };
  const handleShowtimeSelect = (showtime: UIShowtime) => {
    onShowtimeSelect(showtime);
    onNext();
  };

  // Filter out past showtimes and those starting within 30 minutes
  const currentTime = new Date();
  const bufferTime = 30 * 60 * 1000; // 30 minutes in milliseconds
  const cutoffTime = new Date(currentTime.getTime() + bufferTime);

  const futureShowtimes = showtimes.filter((showtime) => {
    if (!showtime.showDateTime) return false;
    const showtimeDate = new Date(showtime.showDateTime);
    return showtimeDate > cutoffTime;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Chọn Suất Chiếu - {selectedMovie.name ?? "Movie"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {futureShowtimes.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>Không có suất chiếu nào có thể đặt vé cho phim này.</p>
            <p className="mt-2 text-sm">Chỉ hiển thị các suất chiếu bắt đầu sau 30 phút từ bây giờ.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {futureShowtimes.map((showtime) => (
              <ShowtimeItem key={showtime.id} showtime={showtime} />
            ))}
          </div>
        )}
        <div className="mt-4">
          <Button variant="outline" onClick={onBack}>
            Quay lại
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShowtimeSelection;
