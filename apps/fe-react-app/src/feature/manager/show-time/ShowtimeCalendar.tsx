import FullCalendar from "@fullcalendar/react";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import type { EventInput } from "@fullcalendar/core";
import { Calendar as DatePicker } from "@/components/Shadcn/ui/calendar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { FilterCriteria } from "@/components/shared/Filter";
import type { CinemaRoom } from "@/interfaces/cinemarooms.interface";
import type { Movie } from "@/interfaces/movies.interface";
import type { Showtime } from "@/interfaces/showtime.interface";
import { transformCinemaRoomsResponse, useCinemaRooms } from "@/services/cinemaRoomService";
import { queryMovies, transformMoviesResponse } from "@/services/movieService";
import { queryShowtimes, transformShowtimesResponse } from "@/services/showtimeService";
import { useMemo, useState } from "react";

interface ShowtimeCalendarProps {
  readonly searchTerm?: string;
  readonly filterCriteria?: FilterCriteria[];
}

export function ShowtimeCalendar({ searchTerm = "", filterCriteria = [] }: ShowtimeCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: roomsData, isLoading: roomsLoading } = useCinemaRooms();
  const { data: moviesData, isLoading: moviesLoading } = queryMovies();
  const { data: showtimesData, isLoading: showtimesLoading } = queryShowtimes();

  const rooms = useMemo<CinemaRoom[]>(() => {
    return roomsData?.result ? transformCinemaRoomsResponse(roomsData.result) : [];
  }, [roomsData?.result]);

  const movies = useMemo<Movie[]>(() => {
    return moviesData?.result ? transformMoviesResponse(moviesData.result) : [];
  }, [moviesData?.result]);

  const showtimes = useMemo<Showtime[]>(() => {
    return showtimesData?.result ? transformShowtimesResponse(showtimesData.result) : [];
  }, [showtimesData?.result]);

  const getMovieName = (id: number) => movies.find((m) => m.id === id)?.name || `Movie ${id}`;

  const filteredShowtimes = useMemo(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    let result = showtimes.filter((st) => st.showDateTime.startsWith(dateStr));

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((st) => {
        const movieName = getMovieName(st.movieId).toLowerCase();
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
    return filteredShowtimes.map((st) => ({
      id: st.id.toString(),
      resourceId: st.roomId.toString(),
      title: getMovieName(st.movieId),
      start: st.showDateTime,
      end: st.endDateTime,
    }));
  }, [filteredShowtimes, movies]);

  const resources = useMemo(() => {
    return rooms.map((r) => ({ id: (r.id ?? 0).toString(), title: r.name }));
  }, [rooms]);

  if (roomsLoading || moviesLoading || showtimesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <DatePicker mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} />
      <FullCalendar
        plugins={[resourceTimeGridPlugin]}
        initialView="resourceTimeGridDay"
        headerToolbar={false}
        resources={resources}
        events={events}
        height="auto"
      />
    </div>
  );
}
