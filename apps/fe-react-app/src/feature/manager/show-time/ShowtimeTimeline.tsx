import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Movie } from "@/interfaces/movies.interface";
import { queryShowtimesByRoom, transformShowtimesResponse } from "@/services/showtimeService";
import { format } from "date-fns";
import { useMemo } from "react";

interface ShowtimeTimelineProps {
  readonly roomId?: string;
  readonly selectedDate?: Date;
  readonly movies: Movie[];
  readonly selectedMovieId?: string;
}

export function ShowtimeTimeline({ roomId, selectedDate, movies, selectedMovieId }: ShowtimeTimelineProps) {
  const { data, isLoading } = queryShowtimesByRoom(Number(roomId ?? 0), {
    enabled: !!roomId,
  });

  const showtimes = useMemo(() => {
    if (!data?.result) return [];
    const all = transformShowtimesResponse(data.result);
    if (!selectedDate) return all;
    const dateStr = selectedDate.toISOString().split("T")[0];
    return all.filter((st) => st.showDateTime.split("T")[0] === dateStr);
  }, [data?.result, selectedDate]);

  const getMovieName = (id: number) => movies.find((m) => m.id === id)?.name || `Movie ${id}`;

  if (!roomId) return null;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-2">
      <h4 className="font-semibold">Lịch chiếu trong ngày</h4>
      {showtimes.length === 0 ? (
        <p className="text-muted-foreground text-sm">Không có lịch chiếu</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {showtimes.map((st) => (
            <li key={st.id} className={st.movieId.toString() === selectedMovieId ? "font-medium" : ""}>
              {format(new Date(st.showDateTime), "HH:mm")} - {format(new Date(st.endDateTime), "HH:mm")} : {getMovieName(st.movieId)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
