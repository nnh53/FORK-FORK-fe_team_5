import { Button } from "@/components/Shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Textarea } from "@/components/Shadcn/ui/textarea";
import type { CinemaRoom } from "@/interfaces/cinemarooms.interface";
import { MovieStatus } from "@/interfaces/movies.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { Movie, MovieFormData } from "../../../interfaces/movies.interface";

interface MovieDetailProps {
  movie?: Movie;
  onSubmit: (values: MovieFormData) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Movie name is required"),
  ageRestrict: z.number().min(13, "Age restriction must be at least 13").max(18, "Age restriction must be at most 18"),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  actor: z.string().optional(),
  studio: z.string().min(1, "Studio is required"),
  director: z.string().min(1, "Director is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute").optional(),
  trailer: z.string().optional(),
  categoryIds: z.array(z.number()).optional(),
  description: z.string().min(1, "Description is required"),
  status: z.string().optional(),
  poster: z.string().optional(),
  showtimes: z
    .array(
      z.object({
        id: z.string().optional(),
        movieId: z.number().optional(),
        cinemaRoomId: z.string(),
        date: z.string().optional(),
        startTime: z.string(),
        endTime: z.string(),
        format: z.string().optional(),
        availableSeats: z.number().optional(),
        price: z.number().optional(),
      }),
    )
    .optional(),
  posterFile: z.any().optional(),
});

const MovieDetail = ({ movie, onSubmit, onCancel }: MovieDetailProps) => {
  const [cinemaRooms, setCinemaRooms] = useState<CinemaRoom[]>([]);
  const [showAddShowtimeDialog, setShowAddShowtimeDialog] = useState(false);
  const [selectedCinemaRoom, setSelectedCinemaRoom] = useState("");
  const [showtimeStartTime, setShowtimeStartTime] = useState("");
  const [showtimeEndTime, setShowtimeEndTime] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ageRestrict: 13, // Default to minimum allowed age
      fromDate: "",
      toDate: "",
      actor: "",
      studio: "",
      director: "",
      duration: 90,
      trailer: "",
      categoryIds: [],
      description: "",
      status: MovieStatus.ACTIVE,
      poster: "",
      showtimes: [],
    },
  });

  // Fetch cinema rooms
  useEffect(() => {
    const fetchCinemaRooms = async () => {
      try {
        const response = await fetch("http://localhost:3000/cinema-rooms");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCinemaRooms(data);
      } catch (error) {
        console.error("Error fetching cinema rooms:", error);
      }
    };

    fetchCinemaRooms();
  }, []);

  useEffect(() => {
    if (movie) {
      form.reset({
        name: movie.name ?? "",
        ageRestrict: movie.ageRestrict ?? 13, // Default to minimum if not set
        fromDate: movie.fromDate ?? "",
        toDate: movie.toDate ?? "",
        actor: movie.actor ?? "",
        studio: movie.studio ?? "",
        director: movie.director ?? "",
        duration: movie.duration ?? 90,
        trailer: movie.trailer ?? "",
        categoryIds: movie.categoryIds ?? [],
        description: movie.description ?? "",
        status: movie.status ?? MovieStatus.ACTIVE,
        poster: movie.poster ?? "",
        showtimes: movie.showtimes ?? [],
      });
    }
  }, [movie, form]);

  const handleAddShowtime = () => {
    const currentShowtimes = form.getValues("showtimes") || [];

    if (!selectedCinemaRoom || !showtimeStartTime || !showtimeEndTime) {
      toast.error("Please fill in all showtime fields");
      return;
    }

    const newShowtime = {
      id: `temp-${Date.now()}`,
      movieId: movie?.id ?? 0,
      cinemaRoomId: selectedCinemaRoom,
      date: showtimeStartTime.split("T")[0], // Extract date from datetime-local
      startTime: showtimeStartTime,
      endTime: showtimeEndTime,
      format: "2D", // Default format
      availableSeats: 100, // Default value
      price: 100000, // Default value
    };

    form.setValue("showtimes", [...currentShowtimes, newShowtime]);
    setShowAddShowtimeDialog(false);
    setSelectedCinemaRoom("");
    setShowtimeStartTime("");
    setShowtimeEndTime("");
  };

  const handleRemoveShowtime = (index: number) => {
    const currentShowtimes = form.getValues("showtimes") || [];
    const updatedShowtimes = [...currentShowtimes];
    updatedShowtimes.splice(index, 1);
    form.setValue("showtimes", updatedShowtimes);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("posterFile", file);

      // Create a URL for the file for preview
      const fileUrl = URL.createObjectURL(file);
      form.setValue("poster", fileUrl);
    }
  };

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values as MovieFormData);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Movie Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Movie name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="director"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Director*</FormLabel>
                  <FormControl>
                    <Input placeholder="Director name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actor(s)</FormLabel>
                  <FormControl>
                    <Input placeholder="Actors (comma separated)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Studio*</FormLabel>
                  <FormControl>
                    <Input placeholder="Production company/studio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ageRestrict"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age Restriction*</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age restriction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="13">13+</SelectItem>
                      <SelectItem value="16">16+</SelectItem>
                      <SelectItem value="18">18+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)*</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Duration in minutes" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fromDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>From Date (Start Showing)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="toDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>To Date (End Showing)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trailer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trailer URL</FormLabel>
                  <FormControl>
                    <Input placeholder="URL to movie trailer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={MovieStatus.ACTIVE}>Active</SelectItem>
                      <SelectItem value={MovieStatus.INACTIVE}>Inactive</SelectItem>
                      <SelectItem value={MovieStatus.UPCOMING}>Upcoming</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="posterFile"
              render={({ field: { ...field } }) => (
                <FormItem>
                  <FormLabel>Movie Poster</FormLabel>
                  <FormControl>
                    <div className="flex flex-col space-y-2">
                      <Input type="file" accept="image/*" {...field} onChange={handleFileChange} />
                      {form.getValues("poster") && (
                        <div className="mt-2">
                          <img src={form.getValues("poster")} alt="Movie poster preview" className="h-20 w-auto object-contain" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description*</FormLabel>
                <FormControl>
                  <Textarea placeholder="Movie description" {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <FormLabel>Showtimes</FormLabel>
              <Button type="button" size="sm" onClick={() => setShowAddShowtimeDialog(true)}>
                <Plus className="mr-1 h-4 w-4" /> Add Showtime
              </Button>
            </div>

            {form.getValues("showtimes")?.length ? (
              <div className="rounded-md border p-3">
                <div className="mb-2 grid grid-cols-4 gap-2 text-sm font-medium">
                  <div>Cinema Room</div>
                  <div>Date</div>
                  <div>Start Time</div>
                  <div>End Time</div>
                </div>
                {form.getValues("showtimes")?.map((showtime, index) => {
                  const room = cinemaRooms.find((r) => r.id.toString() === showtime.cinemaRoomId);
                  return (
                    <div key={showtime.id ?? index} className="grid grid-cols-4 items-center gap-2 border-t py-1">
                      <div>{room?.name || `Room ${showtime.cinemaRoomId}`}</div>
                      <div>{showtime.date}</div>
                      <div>{new Date(showtime.startTime).toLocaleTimeString()}</div>
                      <div className="flex items-center justify-between">
                        <span>{new Date(showtime.endTime).toLocaleTimeString()}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveShowtime(index)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-md border py-4 text-center text-gray-500">No showtimes added yet</div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{movie ? "Update" : "Create"} Movie</Button>
          </div>
        </form>
      </Form>

      <Dialog open={showAddShowtimeDialog} onOpenChange={setShowAddShowtimeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Showtime</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <FormLabel>Cinema Room</FormLabel>
              <Select onValueChange={setSelectedCinemaRoom} value={selectedCinemaRoom}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cinema room" />
                </SelectTrigger>
                <SelectContent>
                  {cinemaRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                      {room.name || `Room ${room.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <FormLabel>Start Time</FormLabel>
              <Input type="datetime-local" value={showtimeStartTime} onChange={(e) => setShowtimeStartTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <FormLabel>End Time</FormLabel>
              <Input type="datetime-local" value={showtimeEndTime} onChange={(e) => setShowtimeEndTime(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddShowtimeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddShowtime}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MovieDetail;
