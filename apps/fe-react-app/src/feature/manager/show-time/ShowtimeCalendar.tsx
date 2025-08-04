import { Button } from "@/components/Shadcn/ui/button";
import { Calendar as DatePicker } from "@/components/Shadcn/ui/calendar";
import type { FilterCriteria } from "@/components/shared/Filter";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { CinemaRoom } from "@/interfaces/cinemarooms.interface";
import type { Movie } from "@/interfaces/movies.interface";
import type { Showtime } from "@/interfaces/showtime.interface";
import { transformCinemaRoomsResponse, useCinemaRooms } from "@/services/cinemaRoomService";
import { queryMovies, transformMoviesResponse } from "@/services/movieService";
import { queryShowtimes, transformShowtimesResponse } from "@/services/showtimeService";
import type { EventInput } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import { useEffect, useMemo, useRef, useState } from "react";

const getMovieName = (id: number, moviesList: Movie[]) => moviesList.find((m) => m.id === id)?.name || `Movie ${id}`;
interface ShowtimeCalendarProps {
  readonly searchTerm?: string;
  readonly filterCriteria?: FilterCriteria[];
}

export function ShowtimeCalendar({ searchTerm = "", filterCriteria = [] }: ShowtimeCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const calendarRef = useRef<FullCalendar | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(true);

  const { data: roomsData, isLoading: roomsLoading } = useCinemaRooms();
  const { data: moviesData, isLoading: moviesLoading } = queryMovies();
  const { data: showtimesData, isLoading: showtimesLoading } = queryShowtimes();

  const rooms = useMemo<CinemaRoom[]>(() => {
    if (!roomsData?.result) return [];
    return transformCinemaRoomsResponse(roomsData.result).filter((room) => room.status === "ACTIVE");
  }, [roomsData?.result]);

  const movies = useMemo<Movie[]>(() => {
    if (!moviesData?.result) return [];
    const transformedMovies = transformMoviesResponse(moviesData.result);
    // Only show movies with ACTIVE status for consistency
    return transformedMovies.filter((movie) => movie.status === "ACTIVE");
  }, [moviesData?.result]);

  const showtimes = useMemo<Showtime[]>(() => {
    return showtimesData?.result ? transformShowtimesResponse(showtimesData.result) : [];
  }, [showtimesData?.result]);

  const filteredShowtimes = useMemo(() => {
    const dateStr = selectedDate.toICTISOString().split("T")[0];
    let result = showtimes.filter((st) => st.showDateTime.startsWith(dateStr));

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((st) => {
        const movieName = getMovieName(st.movieId, movies).toLowerCase();
        const showtimeDate = new Date(st.showDateTime).toLocaleDateString("vi-VN");
        return movieName.includes(lower) || showtimeDate.includes(lower);
      });
    }

    if (filterCriteria.length > 0) {
      result = result.filter((st) => {
        return filterCriteria.every((criteria) => {
          if (criteria.field === "status") {
            return st.status === criteria.value;
          }
          return true;
        });
      });
    }

    return result;
  }, [showtimes, selectedDate, searchTerm, filterCriteria, movies]);

  const events: EventInput[] = useMemo(() => {
    console.log("Filtered Showtimes:", filteredShowtimes);

    const result = filteredShowtimes.map((st) => ({
      id: st.id.toString(),
      resourceId: st.roomId.toString(),
      title: getMovieName(st.movieId, movies),
      start: st.showDateTime,
      end: st.endDateTime,
    }));
    console.log("Events:", result);
    // debugger;
    return result;
  }, [filteredShowtimes, movies]);

  const resources = useMemo(() => {
    return rooms.map((r) => ({ id: (r.id ?? 0).toString(), title: r.name }));
  }, [rooms]);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(selectedDate);
    }
    console.log("Selected Date Changed:", selectedDate);
    console.log("Events:", events);
  }, [events, selectedDate]);

  if (roomsLoading || moviesLoading || showtimesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex gap-4">
      <div className="shrink-0">
        <Button variant="outline" className="mb-2" onClick={() => setShowDatePicker((prev) => !prev)}>
          {showDatePicker ? "Ẩn lịch" : "Chọn ngày"}
        </Button>
        {showDatePicker && <DatePicker mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} />}
      </div>
      <div className="flex-1">
        <FullCalendar
          ref={calendarRef}
          plugins={[resourceTimeGridPlugin]}
          initialView="resourceTimeGridDay"
          initialDate={selectedDate}
          resources={resources}
          events={events}
          height="auto"
          headerToolbar={false}
        />
      </div>
    </div>
  );
}
