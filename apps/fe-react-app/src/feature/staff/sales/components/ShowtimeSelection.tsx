import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import type { Movie } from "@/interfaces/movies.interface";
import { Clock } from "lucide-react";
import React from "react";
import type { UIShowtime } from "../types";

interface ShowtimeSelectionProps {
  selectedMovie: Movie;
  showtimes: UIShowtime[];
  selectedShowtime: UIShowtime | null;
  onShowtimeSelect: (showtime: UIShowtime) => void;
  onBack: () => void;
  onNext: () => void;
}

const ShowtimeSelection: React.FC<ShowtimeSelectionProps> = ({ selectedMovie, showtimes, selectedShowtime, onShowtimeSelect, onBack, onNext }) => {
  const handleShowtimeSelect = (showtime: UIShowtime) => {
    onShowtimeSelect(showtime);
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Chọn Suất Chiếu - {selectedMovie.name ?? "Movie"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {showtimes.map((showtime) => (
            <button
              key={showtime.id}
              onClick={() => handleShowtimeSelect(showtime)}
              className={`cursor-pointer rounded-lg border p-4 text-center transition-colors ${
                selectedShowtime?.id === showtime.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
              }`}
              type="button"
            >
              <div className="text-center">
                <div className="text-lg font-semibold">{showtime.startTime}</div>
                <div className="text-sm text-gray-500">{showtime.date}</div>
                <div className="text-sm text-gray-500">Phòng {showtime.cinemaRoomId}</div>
                <div className="text-sm text-green-600">{showtime.availableSeats} ghế trống</div>
              </div>
            </button>
          ))}
        </div>
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
