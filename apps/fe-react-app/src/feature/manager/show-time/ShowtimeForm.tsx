"use client";

import { Alert, AlertDescription } from "@/components/Shadcn/ui/alert";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { CinemaRoom } from "@/interfaces/cinemarooms.interface";
import type { Movie } from "@/interfaces/movies.interface";
import type { Showtime, ShowtimeFormData } from "@/interfaces/showtime.interface";
import { transformCinemaRoomsResponse, useCinemaRooms } from "@/services/cinemaRoomService";
import { transformMoviesResponse, useMovies } from "@/services/movieService";
import { prepareCreateShowtimeData, prepareUpdateShowtimeData, queryCreateShowtime, queryUpdateShowtime } from "@/services/showtimeService";
import { AlertTriangle, Calendar, Clock, Film, Home } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ShowtimeFormProps {
  readonly initialData?: Showtime;
  readonly onSuccess?: () => void;
  readonly onCancel?: () => void;
}

interface FormData {
  movieId: string;
  roomId: string;
  startDate: string;
  startTime: string;
  endTime: string;
  manualEndTime: boolean;
}

export function ShowtimeForm({ initialData, onSuccess, onCancel }: ShowtimeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<CinemaRoom[]>([]);
  const [conflictError, setConflictError] = useState<string>("");

  // React Query hooks
  const { data: moviesData, isLoading: moviesLoading } = useMovies();
  const { data: roomsData, isLoading: roomsLoading } = useCinemaRooms();
  const createShowtimeMutation = queryCreateShowtime();
  const updateShowtimeMutation = queryUpdateShowtime();

  const dataLoading = moviesLoading || roomsLoading;

  const [formData, setFormData] = useState<FormData>({
    movieId: initialData?.movieId.toString() || "",
    roomId: initialData?.roomId?.toString() || "",
    startDate: initialData ? new Date(initialData.showDateTime).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    startTime: initialData ? new Date(initialData.showDateTime).toTimeString().slice(0, 5) : "10:00",
    endTime: initialData ? new Date(initialData.endDateTime).toTimeString().slice(0, 5) : "",
    manualEndTime: Boolean(initialData),
  });

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Transform API data to our interfaces
  useEffect(() => {
    if (moviesData?.result) {
      const transformedMovies = transformMoviesResponse(moviesData.result);
      setMovies(transformedMovies);

      // If we have initialData, find the selected movie
      if (initialData?.movieId) {
        const movie = transformedMovies.find((m) => m.id === initialData.movieId);
        if (movie) {
          setSelectedMovie(movie);
        }
      }
    }
  }, [moviesData, initialData]);

  useEffect(() => {
    if (roomsData?.result) {
      setRooms(transformCinemaRoomsResponse(roomsData.result));
    }
  }, [roomsData]);

  // Calculate end time when movie or start time changes
  useEffect(() => {
    if (selectedMovie?.duration && !formData.manualEndTime) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(startDateTime.getTime() + selectedMovie.duration * 60 * 1000); // duration in minutes
      setFormData((prev) => ({
        ...prev,
        endTime: endDateTime.toTimeString().slice(0, 5),
      }));
    }
  }, [selectedMovie, formData.startDate, formData.startTime, formData.manualEndTime]);

  // Room availability check - Skip for now until API endpoint is available
  useEffect(() => {
    // Room availability check would be implemented here
    // when the backend provides the endpoint
    setConflictError("");
  }, [formData.roomId, formData.startDate, formData.startTime, formData.endTime, initialData?.id]);

  const handleMovieChange = (movieId: string) => {
    const movie = movies.find((m) => m.id?.toString() === movieId);
    setSelectedMovie(movie || null);
    setFormData((prev) => ({
      ...prev,
      movieId,
      // Reset end time when movie changes
      manualEndTime: false,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (conflictError) {
      toast.error("Vui lòng giải quyết xung đột lịch chiếu trước khi lưu");
      return;
    }

    if (!formData.movieId || !formData.roomId || !formData.startDate || !formData.startTime || !formData.endTime) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsLoading(true);

    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`);

      // Handle case where end time is on the next day
      if (endDateTime < startDateTime) {
        endDateTime.setDate(endDateTime.getDate() + 1);
      }

      const showtimeData: ShowtimeFormData = {
        movieId: parseInt(formData.movieId),
        roomId: parseInt(formData.roomId),
        showDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        status: "SCHEDULE", // Default status
      };

      if (initialData) {
        // Update showtime
        const updateData = { ...showtimeData, id: initialData.id };
        await updateShowtimeMutation.mutateAsync({
          params: { path: { id: initialData.id } },
          body: prepareUpdateShowtimeData(updateData),
        });
        toast.success("Cập nhật lịch chiếu thành công");
      } else {
        // Create new showtime
        await createShowtimeMutation.mutateAsync({
          body: prepareCreateShowtimeData(showtimeData),
        });
        toast.success("Tạo lịch chiếu thành công");
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error saving showtime:", error);
      toast.error("Có lỗi xảy ra khi lưu lịch chiếu");
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = (): string => {
    if (isLoading) return "Đang lưu...";
    if (initialData) return "Cập nhật lịch chiếu";
    return "Tạo lịch chiếu";
  };

  if (dataLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Film className="h-5 w-5" />
          {initialData ? "Chỉnh sửa lịch chiếu" : "Tạo lịch chiếu mới"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="movieId">Chọn phim *</Label>
              <Select value={formData.movieId} onValueChange={handleMovieChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phim" />
                </SelectTrigger>
                <SelectContent>
                  {movies.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id?.toString() || ""}>
                      {movie.name} ({movie.duration} phút)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedMovie && <p className="text-muted-foreground text-sm">Thời lượng: {selectedMovie.duration} phút</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomId">Chọn phòng chiếu *</Label>
              <Select value={formData.roomId} onValueChange={(value) => setFormData((prev) => ({ ...prev, roomId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng chiếu" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                      <div className="flex items-center">
                        <Home className="mr-2 h-4 w-4" />
                        {room.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày chiếu *</Label>
              <div className="relative">
                <Calendar className="text-muted-foreground absolute left-3 top-3 h-4 w-4" />
                <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Giờ bắt đầu *</Label>
              <div className="relative">
                <Clock className="text-muted-foreground absolute left-3 top-3 h-4 w-4" />
                <Input id="startTime" name="startTime" type="time" value={formData.startTime} onChange={handleChange} className="pl-10" required />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="endTime">Giờ kết thúc *</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="manualEndTime"
                  name="manualEndTime"
                  checked={formData.manualEndTime}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="manualEndTime" className="text-sm font-normal">
                  Tùy chỉnh thời gian kết thúc
                </Label>
              </div>
            </div>
            <div className="relative">
              <Clock className="text-muted-foreground absolute left-3 top-3 h-4 w-4" />
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                disabled={!formData.manualEndTime}
                className="pl-10"
                required
              />
            </div>
            {selectedMovie?.duration && !formData.manualEndTime && (
              <p className="text-muted-foreground text-sm">
                Thời gian kết thúc được tính tự động dựa trên thời lượng phim ({selectedMovie.duration} phút)
              </p>
            )}
          </div>

          {conflictError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{conflictError}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading || !!conflictError} className="flex-1">
              {getButtonText()}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Hủy
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
