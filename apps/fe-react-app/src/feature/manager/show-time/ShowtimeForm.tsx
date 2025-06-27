import { Button } from "@/components/Shadcn/ui/button";
import { Calendar } from "@/components/Shadcn/ui/calendar";
import { DialogFooter } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Shadcn/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { type Showtime, type ShowtimeFormData, ShowtimeStatus } from "@/interfaces/showtime.interface";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface Movie {
  id: string;
  title: string;
}

interface Room {
  id: string;
  name: string;
}

interface ShowtimeFormProps {
  showtime?: Showtime;
  onSubmit: (values: ShowtimeFormData | Showtime) => void;
  onCancel: () => void;
  movies: Movie[];
  rooms: Room[];
}

const ShowtimeForm = ({ showtime, onSubmit, onCancel, movies, rooms }: ShowtimeFormProps) => {
  const form = useForm<ShowtimeFormData | Showtime>({
    defaultValues: showtime || {
      movie_id: "",
      room_id: "",
      show_date_time: "",
      show_end_time: "",
      status: ShowtimeStatus.SCHEDULE,
    },
  });

  const { control, handleSubmit, reset, watch } = form;

  // Watch form values to enable validation between dependent fields
  const showDateTimeValue = watch("show_date_time");

  useEffect(() => {
    if (showtime) {
      // Ensure date fields are formatted correctly for datetime-local inputs
      const formattedShowtime = {
        ...showtime,
        show_date_time: formatDateTimeForInput(showtime.show_date_time),
        show_end_time: formatDateTimeForInput(showtime.show_end_time),
      };
      reset(formattedShowtime);
    }
  }, [showtime, reset]);

  // Helper function to format datetime string for datetime-local input
  const formatDateTimeForInput = (dateTimeString: string): string => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toISOString().slice(0, 16); // Format: "YYYY-MM-DDThh:mm"
  };

  // Enhanced DateTimePicker component using Calendar and Popover
  const EnhancedDateTimePicker = ({
    value,
    onChange,
    error,
    disabled,
    id,
    label,
  }: {
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    disabled?: boolean;
    id?: string;
    label?: string;
  }) => {
    // Parse initial date and time from value
    const parseDateTime = (dateTimeStr: string) => {
      if (!dateTimeStr) return { dateValue: undefined, timeValue: "" };

      try {
        const dateObj = new Date(dateTimeStr);
        if (isNaN(dateObj.getTime())) return { dateValue: undefined, timeValue: "" };

        const hours = String(dateObj.getHours()).padStart(2, "0");
        const minutes = String(dateObj.getMinutes()).padStart(2, "0");
        return {
          dateValue: dateObj,
          timeValue: `${hours}:${minutes}`,
        };
      } catch {
        return { dateValue: undefined, timeValue: "" };
      }
    };

    // State for popover
    const [open, setOpen] = useState(false);

    // Initialize state from props
    const [dateObj, setDateObj] = useState(() => parseDateTime(value));

    // Prevent update loop with this ref
    const skipUpdateRef = useRef(false);

    // Update component state when value prop changes
    useEffect(() => {
      if (skipUpdateRef.current) {
        skipUpdateRef.current = false;
        return;
      }
      setDateObj(parseDateTime(value));
    }, [value]);

    // Create combined date-time when either input changes
    const updateCombinedDateTime = (newDate?: Date, newTime = "") => {
      if (!newDate) {
        skipUpdateRef.current = true;
        onChange("");
        return;
      }

      // Keep date only if there's no time
      if (!newTime) {
        const dateOnly = new Date(newDate);
        dateOnly.setHours(0, 0, 0, 0);
        skipUpdateRef.current = true;
        onChange(dateOnly.toISOString());
        return;
      }

      // Combine date with time
      const [hours, minutes] = newTime.split(":").map(Number);
      const combinedDate = new Date(newDate);
      combinedDate.setHours(hours || 0, minutes || 0, 0, 0);
      skipUpdateRef.current = true;
      onChange(combinedDate.toISOString());
    };

    // Format date for display
    const formatDate = (date?: Date) => {
      if (!date) return "Chọn ngày";
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    return (
      <div className="flex gap-4">
        <div className="flex flex-col gap-1 flex-grow">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id={`${id}-date`}
                className={`w-full justify-between font-normal ${error ? "border-red-500" : ""}`}
                disabled={disabled}
              >
                {formatDate(dateObj.dateValue)}
                <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateObj.dateValue}
                onSelect={(date) => {
                  setDateObj((prev) => ({
                    dateValue: date,
                    timeValue: prev.timeValue,
                  }));
                  updateCombinedDateTime(date, dateObj.timeValue);
                  setOpen(false);
                }}
                disabled={disabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-32">
          <Input
            type="time"
            id={`${id}-time`}
            value={dateObj.timeValue}
            onChange={(e) => {
              const newTime = e.target.value;
              setDateObj((prev) => ({
                dateValue: prev.dateValue,
                timeValue: newTime,
              }));
              updateCombinedDateTime(dateObj.dateValue, newTime);
            }}
            className={error ? "border-red-500" : ""}
            disabled={disabled || !dateObj.dateValue}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Movie selection */}
        <Controller
          name="movie_id"
          control={control}
          rules={{ required: "Phim là bắt buộc" }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="movie-select">
                Phim*
              </label>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <SelectTrigger id="movie-select" className={error ? "border-red-500" : ""}>
                  <SelectValue placeholder="Chọn phim" />
                </SelectTrigger>
                <SelectContent>
                  {movies.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
            </div>
          )}
        />

        {/* Room selection */}
        <Controller
          name="room_id"
          control={control}
          rules={{ required: "Phòng chiếu là bắt buộc" }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="room-select">
                Phòng chiếu*
              </label>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <SelectTrigger id="room-select" className={error ? "border-red-500" : ""}>
                  <SelectValue placeholder="Chọn phòng chiếu" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
            </div>
          )}
        />

        {/* Show date time */}
        <Controller
          name="show_date_time"
          control={control}
          rules={{ required: "Thời gian bắt đầu là bắt buộc" }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="start-time-picker-date">
                Thời gian bắt đầu*
              </label>
              <EnhancedDateTimePicker value={field.value} onChange={field.onChange} error={!!error} id="start-time-picker" />
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
            </div>
          )}
        />

        {/* Show end time */}
        <Controller
          name="show_end_time"
          control={control}
          rules={{
            required: "Thời gian kết thúc là bắt buộc",
            validate: (value) => {
              // Check that end time is after start time
              if (showDateTimeValue && value) {
                const startDate = new Date(showDateTimeValue);
                const endDate = new Date(value);
                return endDate > startDate || "Thời gian kết thúc phải sau thời gian bắt đầu";
              }
              return true;
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="end-time-picker-date">
                Thời gian kết thúc*
              </label>
              <EnhancedDateTimePicker value={field.value} onChange={field.onChange} error={!!error} id="end-time-picker" />
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
            </div>
          )}
        />

        {/* Status */}
        <Controller
          name="status"
          control={control}
          rules={{ required: "Trạng thái là bắt buộc" }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status-select">
                Trạng thái*
              </label>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <SelectTrigger id="status-select" className={error ? "border-red-500" : ""}>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ShowtimeStatus.SCHEDULE}>Đã lên lịch</SelectItem>
                  <SelectItem value={ShowtimeStatus.ONSCREEN}>Đang chiếu</SelectItem>
                  <SelectItem value={ShowtimeStatus.COMPLETE}>Đã hoàn thành</SelectItem>
                </SelectContent>
              </Select>
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
            </div>
          )}
        />
      </div>

      <DialogFooter className="pt-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Hủy
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit((data) => {
            onSubmit(data);
          })}
          className="flex items-center gap-2"
        >
          {showtime ? "Cập nhật" : "Thêm"} suất chiếu
        </Button>
      </DialogFooter>
    </div>
  );
};

export default ShowtimeForm;
