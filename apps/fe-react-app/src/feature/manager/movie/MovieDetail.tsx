import { Button } from "@/components/Shadcn/ui/button";
import { Checkbox } from "@/components/Shadcn/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/Shadcn/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Textarea } from "@/components/Shadcn/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MovieStatus, MovieVersion, type CinemaRoom, type Movie, type MovieFormData, type MovieGenre } from "../../../interfaces/movies.interface";

interface MovieDetailProps {
  movie?: Movie;
  onSubmit: (values: MovieFormData) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  genre: z.string().min(1, "Genre is required"),
  genres: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  director: z.string().min(1, "Director is required"),
  actors: z.string().optional(),
  releaseYear: z.number().min(1900, "Release year must be at least 1900"),
  startShowingDate: z.string().optional(),
  endShowingDate: z.string().optional(),
  productionCompany: z.string().min(1, "Production company is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  rating: z.number().min(1, "Rating must be at least 1").max(10, "Rating must be at most 10"),
  description: z.string().min(1, "Description is required"),
  poster: z.string().optional(),
  trailerUrl: z.string().optional(),
  status: z.string(),
  version: z.string(),
  showtimes: z
    .array(
      z.object({
        id: z.string().optional(),
        cinemaRoomId: z.string(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .optional(),
  posterFile: z.any().optional(),
});

const GenreCheckbox = ({ genre, field }: { genre: MovieGenre; field: { value?: MovieGenre[]; onChange: (value: MovieGenre[]) => void } }) => {
  const isSelected = field.value?.some((g: MovieGenre) => g.id === genre.id) || false;
  const handleGenreChange = (checked: boolean) => {
    const currentGenres = field.value || [];
    if (checked) {
      field.onChange([...currentGenres, genre]);
    } else {
      field.onChange(currentGenres.filter((g: MovieGenre) => g.id !== genre.id));
    }
  };

  return (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
      <FormControl>
        <Checkbox checked={isSelected} onCheckedChange={handleGenreChange} />
      </FormControl>
      <FormLabel className="font-normal">{genre.name}</FormLabel>
    </FormItem>
  );
};

const MovieDetail = ({ movie, onSubmit, onCancel }: MovieDetailProps) => {
  const [genres, setGenres] = useState<MovieGenre[]>([]);
  const [cinemaRooms, setCinemaRooms] = useState<CinemaRoom[]>([]);
  const [showAddShowtimeDialog, setShowAddShowtimeDialog] = useState(false);
  const [selectedCinemaRoom, setSelectedCinemaRoom] = useState("");
  const [showtimeStartTime, setShowtimeStartTime] = useState("");
  const [showtimeEndTime, setShowtimeEndTime] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      genre: "",
      genres: [],
      director: "",
      actors: "",
      releaseYear: new Date().getFullYear(),
      startShowingDate: "",
      endShowingDate: "",
      productionCompany: "",
      duration: 90,
      rating: 5,
      description: "",
      poster: "",
      trailerUrl: "",
      status: MovieStatus.ACTIVE,
      version: MovieVersion.TWO_D,
      showtimes: [],
    },
  });

  // Fetch genres and cinema rooms
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("http://localhost:3000/genres");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

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

    fetchGenres();
    fetchCinemaRooms();
  }, []);

  useEffect(() => {
    if (movie) {
      form.reset({
        ...movie,
        startShowingDate: movie.startShowingDate || "",
        endShowingDate: movie.endShowingDate || "",
        trailerUrl: movie.trailerUrl || "",
        actors: movie.actors || "",
      });
    }
  }, [movie, form]);

  const handleAddShowtime = () => {
    const currentShowtimes = form.getValues("showtimes") || [];

    if (!selectedCinemaRoom || !showtimeStartTime || !showtimeEndTime) {
      alert("Please fill in all showtime fields");
      return;
    }

    const newShowtime = {
      id: `temp-${Date.now()}`,
      cinemaRoomId: selectedCinemaRoom,
      startTime: showtimeStartTime,
      endTime: showtimeEndTime,
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
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Movie Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Movie title" {...field} />
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
              name="actors"
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
              name="productionCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Production Company*</FormLabel>
                  <FormControl>
                    <Input placeholder="Production company" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="releaseYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Release Year*</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Release year" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Running Time (minutes)*</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Duration in minutes" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startShowingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>From Date (Start Showing)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endShowingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>To Date (End Showing)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (1-10)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Rating (1-10)" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trailerUrl"
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
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version*</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value={MovieVersion.TWO_D} />
                        </FormControl>
                        <FormLabel className="font-normal">2D</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value={MovieVersion.THREE_D} />
                        </FormControl>
                        <FormLabel className="font-normal">3D</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value={MovieVersion.IMAX} />
                        </FormControl>
                        <FormLabel className="font-normal">IMAX</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value={MovieVersion.FOUR_DX} />
                        </FormControl>
                        <FormLabel className="font-normal">4DX</FormLabel>
                      </FormItem>
                    </RadioGroup>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={MovieStatus.ACTIVE}>Active</SelectItem>
                      <SelectItem value={MovieStatus.INACTIVE}>Inactive</SelectItem>
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
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Genre*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary genre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre.id} value={genre.name}>
                        {genre.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="genres"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Movie Types/Genres (Select all that apply)</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    <FormField
                      control={form.control}
                      name="genres"
                      render={({ field }) => (
                        <>
                          {genres.map((genre) => (
                            <GenreCheckbox key={genre.id} genre={genre} field={field} />
                          ))}
                        </>
                      )}
                    />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content (Description)*</FormLabel>
                <FormControl>
                  <Textarea placeholder="Movie description" {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <FormLabel>Cinema Times</FormLabel>
              <Button type="button" size="sm" onClick={() => setShowAddShowtimeDialog(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add Cinema Time
              </Button>
            </div>

            {form.getValues("showtimes")?.length ? (
              <div className="border rounded-md p-3">
                <div className="grid grid-cols-3 gap-2 font-medium text-sm mb-2">
                  <div>Cinema Room</div>
                  <div>Start Time</div>
                  <div>End Time</div>
                </div>
                {form.getValues("showtimes")?.map((showtime, index) => {
                  const room = cinemaRooms.find((r) => r.id === showtime.cinemaRoomId);
                  return (
                    <div key={showtime.id || index} className="grid grid-cols-3 gap-2 items-center py-1 border-t">
                      <div>{room?.name || showtime.cinemaRoomId}</div>
                      <div>{new Date(showtime.startTime).toLocaleString()}</div>
                      <div className="flex items-center justify-between">
                        <span>{new Date(showtime.endTime).toLocaleString()}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveShowtime(index)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 border rounded-md">No cinema times added yet</div>
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
            <DialogTitle>Add Cinema Time</DialogTitle>
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
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
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
