import { Button } from "@/components/Shadcn/ui/button";
import { DialogFooter } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { type Showtime, type ShowtimeFormData, ShowtimeStatus } from "@/interfaces/showtime.interface";
import { useEffect } from "react";
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
  const { control, handleSubmit, reset, watch } = useForm<ShowtimeFormData | Showtime>({
    defaultValues: showtime || {
      movie_id: "",
      room_id: "",
      show_date_time: "",
      show_end_time: "",
      status: ShowtimeStatus.SCHEDULE,
    },
  });

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Phim*</label>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <SelectTrigger className={error ? "border-red-500" : ""}>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Phòng chiếu*</label>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <SelectTrigger className={error ? "border-red-500" : ""}>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bắt đầu*</label>
              <Input {...field} type="datetime-local" className={error ? "border-red-500" : ""} />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian kết thúc*</label>
              <Input {...field} type="datetime-local" className={error ? "border-red-500" : ""} />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái*</label>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <SelectTrigger className={error ? "border-red-500" : ""}>
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
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)}>
          {showtime ? "Cập nhật" : "Thêm"} suất chiếu
        </Button>
      </DialogFooter>
    </div>
  );
};

export default ShowtimeForm;
