import { Button } from "@/components/Shadcn/ui/button";
import { Checkbox } from "@/components/Shadcn/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import { ScrollArea } from "@/components/Shadcn/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Textarea } from "@/components/Shadcn/ui/textarea";
import ImageUpload from "@/components/shared/ImageUpload"; // Import ImageUpload
import type { MovieCategory } from "@/interfaces/movie-category.interface";
import { MovieStatus } from "@/interfaces/movies.interface";
import { queryMovieCategories, transformMovieCategoriesResponse } from "@/services/movieCategoryService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
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
  // React Query hooks
  const categoriesQuery = queryMovieCategories();

  // Transform API response to MovieCategory interface
  const categories: MovieCategory[] = React.useMemo(() => {
    if (!categoriesQuery.data?.result) return [];
    return transformMovieCategoriesResponse(categoriesQuery.data.result);
  }, [categoriesQuery.data?.result]);

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
    } else {
      // For new movie creation, set default poster text
      form.setValue("poster", "");
    }
  }, [movie, form]);

  const handleCategoryChange = (categoryId: number, checked: boolean, field: { value?: number[]; onChange: (value: number[]) => void }) => {
    const currentIds = field.value ?? [];
    if (checked) {
      field.onChange([...currentIds, categoryId]);
    } else {
      field.onChange(currentIds.filter((id: number) => id !== categoryId));
    }
  };

  const handleImageChange = (imageIdOrUrl: string) => {
    form.setValue("poster", imageIdOrUrl);
    form.setValue("posterFile", null); // Reset posterFile if URL is used
  };

  const handleImageClear = () => {
    form.setValue("poster", "");
    form.setValue("posterFile", null);
  };

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    // If no poster is provided or it's empty, set default text
    if (!values.poster || values.poster.trim() === "") {
      values.poster = "";
    }
    onSubmit(values as MovieFormData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
        {/* Row 1: Movie Name và Duration */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Movie Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter movie name" {...field} />
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
        </div>

        {/* Row 2: Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Movie description" {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Row 3: From Date và To Date */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="fromDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Date</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="Select from date" {...field} />
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
                <FormLabel>To Date</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="Select to date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 4: Director, Actor, Studio */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="director"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Director <span className="text-red-500">*</span>
                </FormLabel>
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
                <FormLabel>
                  Studio <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter studio name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 5: Age Restriction và Status */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="ageRestrict"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Age Restriction <span className="text-red-500">*</span>
                </FormLabel>
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

        {/* Row 6: Category Selection */}
        <FormField
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {categoriesQuery.isLoading && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="text-sm">Loading categories...</span>
                    </div>
                  )}
                  {!categoriesQuery.isLoading && categories.length === 0 && (
                    <div className="py-4 text-center text-sm text-gray-500">No categories available</div>
                  )}
                  {!categoriesQuery.isLoading && categories.length > 0 && (
                    <ScrollArea className="h-32 rounded border p-2">
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={field.value?.includes(category.id!) || false}
                              onCheckedChange={(checked) => {
                                handleCategoryChange(category.id!, !!checked, field);
                              }}
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Row 7: Movie Poster và Trailer */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <FormLabel>Movie Poster</FormLabel>
            <ImageUpload
              currentImage={form.watch("poster") || ""}
              onImageChange={handleImageChange}
              onImageClear={handleImageClear}
              previewSize="md"
              preserveAspectRatio={true}
              maxPreviewHeight={200}
              layout="horizontal"
            />
          </div>

          <FormField
            control={form.control}
            name="trailer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trailer URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter trailer URL (YouTube, etc.)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
