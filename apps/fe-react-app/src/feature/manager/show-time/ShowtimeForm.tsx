"use client";

import { Alert, AlertDescription } from "@/components/Shadcn/ui/alert";
import { Button } from "@/components/Shadcn/ui/button";
import { Calendar } from "@/components/Shadcn/ui/calendar";
import { Card, CardContent } from "@/components/Shadcn/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Shadcn/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { CinemaRoom } from "@/interfaces/cinemarooms.interface";
import type { Movie } from "@/interfaces/movies.interface";
import type { Showtime, ShowtimeFormData } from "@/interfaces/showtime.interface";
import { transformCinemaRoomsResponse, useCinemaRooms } from "@/services/cinemaRoomService";
import { queryMovies, transformMoviesResponse } from "@/services/movieService";
import { prepareCreateShowtimeData, prepareUpdateShowtimeData, queryCreateShowtime, queryUpdateShowtime } from "@/services/showtimeService";
import { cn } from "@/utils/utils";
import { showtimeFormSchema } from "@/utils/validation.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { AlertTriangle, CalendarIcon, Clock, Home } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { ShowtimeTimeline } from "./ShowtimeTimeline";

interface ShowtimeFormProps {
  readonly initialData?: Showtime;
  readonly onSuccess?: () => void;
  readonly onCancel?: () => void;
}

type FormData = z.infer<typeof showtimeFormSchema>;

// Helper function to combine date and time into ISO string
const createISODateTime = (date: Date, time: string): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}T${time}:00.000Z`;
};

// Helper function to format time for input[type="time"]
const formatTimeForInput = (date: Date): string => {
  return date.toTimeString().slice(0, 5); // Returns HH:mm format
};

export function ShowtimeForm({ initialData, onSuccess, onCancel }: ShowtimeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<CinemaRoom[]>([]);
  const [conflictError, setConflictError] = useState<string>("");

  // React Query hooks
  const { data: moviesData, isLoading: moviesLoading } = queryMovies();
  const { data: roomsData, isLoading: roomsLoading } = useCinemaRooms();
  const createShowtimeMutation = queryCreateShowtime();
  const updateShowtimeMutation = queryUpdateShowtime();

  const dataLoading = moviesLoading || roomsLoading;

  const form = useForm<FormData>({
    resolver: zodResolver(showtimeFormSchema),
    defaultValues: {
      movieId: initialData?.movieId.toString() || "",
      roomId: initialData?.roomId?.toString() || "",
      showDate: initialData ? new Date(initialData.showDateTime) : undefined,
      startTime: initialData ? formatTimeForInput(new Date(initialData.showDateTime)) : "",
      endTime: initialData ? formatTimeForInput(new Date(initialData.endDateTime)) : "",
      manualEndTime: Boolean(initialData),
    },
  });

  const watchedValues = form.watch();
  const { movieId, showDate, startTime, manualEndTime, roomId } = watchedValues;

  // Memoize selected movie to prevent unnecessary recalculations
  const selectedMovie = useMemo(() => {
    return movies.find((m) => m.id?.toString() === movieId) || null;
  }, [movies, movieId]);

  // Transform API data to our interfaces
  useEffect(() => {
    if (moviesData?.result) {
      const transformedMovies = transformMoviesResponse(moviesData.result);
      setMovies(transformedMovies);
    }
  }, [moviesData]);

  useEffect(() => {
    if (roomsData?.result) {
      setRooms(transformCinemaRoomsResponse(roomsData.result));
    }
  }, [roomsData]);

  // Optimized: Calculate end time when movie or start time changes
  const calculateEndTime = useCallback(() => {
    if (selectedMovie?.duration && !manualEndTime && startTime) {
      // Parse time string to minutes
      const [hours, minutes] = startTime.split(":").map(Number);
      const startMinutes = hours * 60 + minutes;

      // Add movie duration
      const endMinutes = startMinutes + selectedMovie.duration;

      // Convert back to HH:mm format
      const endHours = Math.floor(endMinutes / 60) % 24; // Handle day overflow
      const endMins = endMinutes % 60;
      const calculatedEndTime = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;

      // Only update if the value is different to prevent infinite re-renders
      if (form.getValues("endTime") !== calculatedEndTime) {
        form.setValue("endTime", calculatedEndTime, { shouldValidate: true });
      }
    }
  }, [selectedMovie, manualEndTime, startTime, form]);

  useEffect(() => {
    calculateEndTime();
  }, [calculateEndTime]);

  // Optimized: Reset conflict error when relevant fields change
  useEffect(() => {
    setConflictError("");
  }, [roomId, showDate, startTime, watchedValues.endTime, initialData?.id]);

  const handleMovieChange = useCallback(
    (movieId: string) => {
      form.setValue("movieId", movieId, { shouldValidate: true });
      // Reset manual end time when movie changes to allow auto-calculation
      if (form.getValues("manualEndTime")) {
        form.setValue("manualEndTime", false, { shouldValidate: true });
      }
      // Reset conflict error when movie changes
      setConflictError("");
    },
    [form],
  );

  const handleFieldChange = useCallback(
    (field: keyof FormData, value: string | boolean | Date) => {
      form.setValue(field, value, { shouldValidate: true });
      // Reset conflict error when any relevant field changes
      setConflictError("");
    },
    [form],
  );

  const handleSubmit = async (data: FormData) => {
    if (conflictError) {
      toast.error("Vui lòng giải quyết xung đột lịch chiếu trước khi lưu");
      return;
    }

    setIsLoading(true);

    try {
      // Create ISO DateTime strings using the helper function
      const showDateTime = createISODateTime(data.showDate, data.startTime);
      const endDateTime = createISODateTime(data.showDate, data.endTime);

      // Parse to check if end time is next day
      const startTimeMinutes = parseInt(data.startTime.split(":")[0]) * 60 + parseInt(data.startTime.split(":")[1]);
      const endTimeMinutes = parseInt(data.endTime.split(":")[0]) * 60 + parseInt(data.endTime.split(":")[1]);

      let finalEndDateTime = endDateTime;

      // If end time is earlier than start time, it means next day
      if (endTimeMinutes < startTimeMinutes) {
        const nextDay = new Date(data.showDate);
        nextDay.setDate(nextDay.getDate() + 1);
        finalEndDateTime = createISODateTime(nextDay, data.endTime);
      }

      const showtimeData: ShowtimeFormData = {
        movieId: parseInt(data.movieId),
        roomId: parseInt(data.roomId),
        showDateTime,
        endDateTime: finalEndDateTime,
        status: "SCHEDULE", // Default status
      };

      if (initialData) {
        // Update showtime
        const updateData = {
          ...showtimeData,
          id: initialData.id,
          roomName: initialData.roomName,
        };
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
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Chọn phòng chiếu <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select value={field.value} onValueChange={(value) => handleFieldChange("roomId", value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phòng chiếu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rooms.map((room) => (
                          <SelectItem key={room.id} value={(room.id ?? "").toString()}>
                            <div className="flex items-center">
                              <Home className="mr-2 h-4 w-4" />
                              {room.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="movieId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Chọn phim <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select value={field.value} onValueChange={handleMovieChange} disabled={!roomId}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phim" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {movies.map((movie) => (
                          <SelectItem key={movie.id} value={movie.id?.toString() || ""}>
                            {movie.name} ({movie.duration} phút)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <ShowtimeTimeline
              roomId={roomId}
              selectedDate={showDate}
              movies={movies}
              selectedMovieId={movieId}
            />

            {/* Date Picker using Calendar like Register.tsx */}
            <FormField
              control={form.control}
              name="showDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Ngày chiếu <span className="text-red-500">*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          disabled={!movieId}
                          className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "dd/MM/yyyy") : <span>Chọn ngày chiếu</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => handleFieldChange("showDate", date || new Date())}
                        disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Pickers using Input type="time" */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Giờ bắt đầu <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        <Input
                          type="time"
                          className="bg-background appearance-none pl-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          {...field}
                          disabled={!showDate}
                          onChange={(e) => handleFieldChange("startTime", e.target.value)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>
                        Giờ kết thúc <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="manualEndTime"
                          checked={form.watch("manualEndTime")}
                          onChange={(e) => handleFieldChange("manualEndTime", e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </div>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Clock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        <Input
                          type="time"
                          className="bg-background appearance-none pl-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          {...field}
                          disabled={!form.watch("manualEndTime") || !showDate}
                          onChange={(e) => handleFieldChange("endTime", e.target.value)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {conflictError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{conflictError}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading || !!conflictError}>
                {getButtonText()}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Hủy
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
