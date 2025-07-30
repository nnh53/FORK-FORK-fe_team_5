import { Badge } from "@/components/Shadcn/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Movie } from "@/interfaces/movies.interface";
import { queryShowtimesByRoom, transformShowtimesResponse } from "@/services/showtimeService";
import { getShowtimeStatusColor } from "@/utils/color.utils";
import { format } from "date-fns";
import { useMemo } from "react";

interface ShowtimeTimelineProps {
  readonly roomId?: string;
  readonly selectedDate?: Date;
  readonly movies: Movie[];
  readonly selectedMovieId?: string;
  readonly roomName?: string;
}

export function ShowtimeTimeline({ roomId, selectedDate, movies, selectedMovieId, roomName }: ShowtimeTimelineProps) {
  const numericRoomId = Number(roomId ?? 0);
  const shouldFetch = numericRoomId > 0;
  const { data, isLoading } = queryShowtimesByRoom(numericRoomId, {
    enabled: shouldFetch,
  });

  const showtimes = useMemo(() => {
    if (!data?.result || !selectedDate) return [];
    const all = transformShowtimesResponse(data.result);
    const dateStr = selectedDate.toICTISOString().split("T")[0];
    return all.filter((st) => st.showDateTime.split("T")[0] === dateStr);
  }, [data?.result, selectedDate]);

  const getMovieName = (id: number) => movies.find((m) => m.id === id)?.name || `Movie ${id}`;

  if (!shouldFetch || !selectedDate) return null;

  if (isLoading) return <LoadingSpinner />;

  const header =
    selectedDate && roomName ? `Lịch chiếu trong ngày ${format(selectedDate, "dd/MM/yyyy")} của phòng chiếu ${roomName}` : "Lịch chiếu trong ngày";

  return (
    <div className="space-y-2">
      <h4 className="font-semibold">{header}</h4>
      {showtimes.length === 0 ? (
        <p className="text-muted-foreground text-sm">Không có lịch chiếu</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {showtimes.map((st) => (
            <li key={st.id} className="flex items-center justify-between rounded-md border p-2">
              <div className={st.movieId.toString() === selectedMovieId ? "font-medium" : ""}>
                <p>{getMovieName(st.movieId)}</p>
                <p className="text-muted-foreground text-xs">
                  {format(new Date(st.showDateTime), "dd/MM/yyyy HH:mm")} - {format(new Date(st.endDateTime), "HH:mm")}
                </p>
              </div>
              <Badge variant="outline" className={getShowtimeStatusColor(st.status)}>
                {st.status}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
