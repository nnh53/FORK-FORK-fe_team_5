import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MovieStatus, MovieVersion, type Movie, type MovieFormData } from "../../../interfaces/movies.interface";

interface MovieDetailProps {
  movie?: Movie;
  onSubmit: (values: MovieFormData) => void;
  onCancel: () => void;
}

const MovieDetail = ({ movie, onSubmit, onCancel }: MovieDetailProps) => {
  const form = useForm<MovieFormData>({
    defaultValues: {
      title: "",
      genre: "",
      director: "",
      releaseYear: new Date().getFullYear(),
      productionCompany: "",
      duration: 90,
      rating: 5,
      description: "",
      poster: "",
      status: MovieStatus.ACTIVE,
      version: MovieVersion.TWO_D,
    },
  });

  useEffect(() => {
    if (movie) {
      form.reset(movie);
    }
  }, [movie, form.reset]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Movie title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <FormControl>
                  <Input placeholder="Genre" {...field} />
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
                <FormLabel>Director</FormLabel>
                <FormControl>
                  <Input placeholder="Director name" {...field} />
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
                <FormLabel>Production Company</FormLabel>
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
                <FormLabel>Release Year</FormLabel>
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
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Duration in minutes" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
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
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Rating (1-10)" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="poster"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poster URL</FormLabel>
                <FormControl>
                  <Input placeholder="URL to movie poster" {...field} />
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
                <FormLabel>Version</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select version" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={MovieVersion.TWO_D}>2D</SelectItem>
                    <SelectItem value={MovieVersion.THREE_D}>3D</SelectItem>
                    <SelectItem value={MovieVersion.IMAX}>IMAX</SelectItem>
                    <SelectItem value={MovieVersion.FOUR_DX}>4DX</SelectItem>
                  </SelectContent>
                </Select>
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
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
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
