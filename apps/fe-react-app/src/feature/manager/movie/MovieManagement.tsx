import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { DatePicker } from "@/components/Shadcn/ui/date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import type { Movie, MovieFormData } from "@/interfaces/movies.interface";
import { MovieStatus } from "@/interfaces/movies.interface";
import { transformMovieResponse, transformMovieToRequest, useCreateMovie, useMovies, useUpdateMovie } from "@/services/movieService";
import type { MovieResponse } from "@/type-from-be";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import MovieDetail from "./MovieDetail";
import MovieList from "./MovieList";

const MovieManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | undefined>();
  const [searchInput, setSearchInput] = useState<string>("");
  const [from, setFrom] = useState<Date | undefined>(undefined);
  const [to, setTo] = useState<Date | undefined>(undefined);

  // Use React Query hooks
  const moviesQuery = useMovies();
  const createMovieMutation = useCreateMovie();
  const updateMovieMutation = useUpdateMovie();

  // Transform API response to Movie interface
  const movies: Movie[] = moviesQuery.data?.result
    ? moviesQuery.data.result.map((movieResponse: MovieResponse) => transformMovieResponse(movieResponse))
    : [];

  // Show loading state
  if (moviesQuery.isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">Đang tải danh sách phim...</div>
      </div>
    );
  }

  // Show error state
  if (moviesQuery.error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-red-500">Có lỗi xảy ra khi tải danh sách phim</div>
      </div>
    );
  }

  const handleCreate = () => {
    setSelectedMovie(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMovie(undefined);
  };

  const validateMovieData = (values: MovieFormData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Required fields validation using new Movie interface
    if (!values.name) errors.push("Movie Name is required");
    if (!values.director) errors.push("Director is required");
    if (!values.studio) errors.push("Studio is required");
    if (!values.type) errors.push("Type/Genre is required");
    if (!values.description) errors.push("Description is required");

    // Age restriction validation (must be between 13-18)
    if (!values.ageRestrict) {
      errors.push("Age restriction is required");
    } else if (values.ageRestrict < 13 || values.ageRestrict > 18) {
      errors.push("Age restriction must be between 13 and 18");
    }

    // Numeric validations
    if (!values.duration || values.duration <= 0) errors.push("Duration must be a positive number");

    // Date validations
    if (values.fromDate && values.toDate) {
      const startDate = new Date(values.fromDate);
      const endDate = new Date(values.toDate);
      if (endDate < startDate) {
        errors.push("End date cannot be earlier than start date");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleSubmit = async (values: MovieFormData) => {
    // Validate the form data
    const validation = validateMovieData(values);
    if (!validation.isValid) {
      toast.error("Please fix the following errors:", {
        description: (
          <ul className="list-disc pl-4">
            {validation.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ),
      });
      return;
    }

    try {
      // Handle file upload if present
      let posterUrl = values.poster;
      if (values.posterFile) {
        // In a real app, you would upload the file to a server
        // For this mock, we'll just use a fake URL or the existing one
        posterUrl = URL.createObjectURL(values.posterFile);
        // Clean up the URL when no longer needed
        if (posterUrl) {
          setTimeout(() => URL.revokeObjectURL(posterUrl!), 5000);
        }
      }

      // Use the transform function to convert to the correct API format
      const movieRequestData = transformMovieToRequest({
        ...values,
        id: selectedMovie?.id,
        poster: posterUrl ?? values.poster,
        showtimes: values.showtimes ?? [],
      });

      if (selectedMovie?.id) {
        // Update existing movie using mutation
        updateMovieMutation.mutate(
          {
            params: { path: { id: selectedMovie.id } },
            body: movieRequestData,
          },
          {
            onSuccess: () => {
              toast.success("Movie updated successfully");
              setIsModalOpen(false);
              setSelectedMovie(undefined);
            },
            onError: (error) => {
              toast.error("Failed to update movie");
              console.error("Movie update error:", error);
            },
          },
        );
      } else {
        // Create new movie using mutation
        createMovieMutation.mutate(
          {
            body: movieRequestData,
          },
          {
            onSuccess: () => {
              toast.success("Movie created successfully");
              setIsModalOpen(false);
              setSelectedMovie(undefined);
            },
            onError: (error) => {
              toast.error("Failed to create movie");
              console.error("Movie create error:", error);
            },
          },
        );
      }
    } catch (error) {
      const errorMessage = selectedMovie ? "Failed to update movie" : "Failed to create movie";
      toast.error(errorMessage);
      console.error("Movie operation error:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle>Movie Management</CardTitle>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Movie
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex gap-4">
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                maxLength={50}
                className="mr-2 w-1/3"
              />
              <div className="mb-4 flex gap-4">
                <DatePicker date={from} setDate={setFrom} placeholder="From date" />
                <DatePicker date={to} setDate={setTo} placeholder="To date" />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value={MovieStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={MovieStatus.INACTIVE}>Inactive</SelectItem>
                    <SelectItem value={MovieStatus.UPCOMING}>Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Search</Button>
            </div>
            <MovieList onEdit={handleEdit} movies={movies} onMoviesChange={() => moviesQuery.refetch()} />
          </CardContent>
        </Card>
      </div>

      <div className="p-6">
        <div className="mb-4"></div>
        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            if (!open) handleCancel();
          }}
        >
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedMovie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
            </DialogHeader>
            <MovieDetail movie={selectedMovie} onSubmit={handleSubmit} onCancel={handleCancel} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
export default MovieManagement;
