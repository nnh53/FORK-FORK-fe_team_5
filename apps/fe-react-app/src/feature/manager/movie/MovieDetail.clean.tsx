import { Button } from "@/components/Shadcn/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Textarea } from "@/components/Shadcn/ui/textarea";
import { MovieStatus } from "@/interfaces/movies.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
  posterFile: z.any().optional(),
});

const MovieDetail = ({ movie, onSubmit, onCancel }: MovieDetailProps) => {
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
    },
  });

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
      });
    }
  }, [movie, form]);

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
                  <Input placeholder="Enter movie name" {...field} />
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
                  <Input placeholder="Enter director name" {...field} />
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
                  <Input placeholder="Enter main actors" {...field} />
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
                  <Input placeholder="Enter studio name" {...field} />
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
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Movie duration" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
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
                <FormControl>
                  <Input
                    type="number"
                    min="13"
                    max="18"
                    placeholder="Age restriction"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fromDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Release Date</FormLabel>
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
              <FormItem>
                <FormLabel>End Date</FormLabel>
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
                  <Input placeholder="YouTube trailer URL" {...field} />
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
                    <SelectItem value={MovieStatus.UPCOMING}>Upcoming</SelectItem>
                    <SelectItem value={MovieStatus.INACTIVE}>Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormLabel>Movie Poster</FormLabel>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {form.getValues("poster") && (
            <div className="mt-2">
              <img src={form.getValues("poster")} alt="Movie poster preview" className="h-32 w-24 rounded-md border object-cover" />
            </div>
          )}
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

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{movie ? "Update" : "Create"} Movie</Button>
        </div>
      </form>
    </Form>
  );
};

export default MovieDetail;
