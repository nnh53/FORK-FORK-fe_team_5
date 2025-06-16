import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type Movie, type MovieFormData } from "../../../interfaces/movies.interface";
import MovieDetail from "./MovieDetail";
import MovieList from "./MovieList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MovieManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | undefined>();
  const [movies, setMovies] = useState<Movie[]>([]);

  // Fetch movies for the initial load
  const fetchMovies = async () => {
    try {
      const response = await fetch("http://localhost:3000/movies");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to fetch movies");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

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

    // Required fields validation
    if (!values.title) errors.push("Movie Name is required");
    if (!values.director) errors.push("Director is required");
    if (!values.productionCompany) errors.push("Production Company is required");
    if (!values.genre) errors.push("Primary Genre is required");
    if (!values.description) errors.push("Description is required");

    // Numeric validations
    if (!values.duration || values.duration <= 0) errors.push("Running Time must be a positive number");
    if (!values.releaseYear || values.releaseYear < 1900) errors.push("Release Year must be at least 1900");
    if (values.rating < 1 || values.rating > 10) errors.push("Rating must be between 1 and 10");

    // Date validations
    if (values.startShowingDate && values.endShowingDate) {
      const startDate = new Date(values.startShowingDate);
      const endDate = new Date(values.endShowingDate);
      if (endDate < startDate) {
        errors.push("End showing date cannot be earlier than start showing date");
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
            {validation.errors.map((error, index) => (
              <li key={index}>{error}</li>
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
        URL.revokeObjectURL(posterUrl);
      }

      // Prepare data for API
      const movieData = {
        ...values,
        poster: posterUrl || values.poster,
      };

      // Remove the file object as it can't be serialized
      delete movieData.posterFile;

      if (selectedMovie) {
        // Update existing movie
        await fetch(`http://localhost:3000/movies/${selectedMovie.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(movieData),
        });
        toast.success("Movie updated successfully");
      } else {
        // Create new movie
        await fetch("http://localhost:3000/movies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(movieData),
        });
        toast.success("Movie created successfully");
      }
      setIsModalOpen(false);
      setSelectedMovie(undefined);
      // Refresh the movie list
      fetchMovies();
    } catch (error) {
      console.error("Error saving movie:", error);
      toast.error("Failed to save movie");
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
            <div className="mb-6 flex w-full max-w-md">
              {/*<Input*/}
              {/*  type="text"*/}
              {/*  placeholder="Search cinema rooms..."*/}
              {/*  value={searchInput}*/}
              {/*  onChange={(e) => setSearchInput(e.target.value)}*/}
              {/*  onKeyPress={handleKeyPress}*/}
              {/*  maxLength={28}*/}
              {/*  className="mr-2"*/}
              {/*/>*/}
              {/*<Button onClick={handleSearch}>Search</Button>*/}
            </div>
            <MovieList onEdit={handleEdit} movies={movies} onMoviesChange={fetchMovies} />
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
