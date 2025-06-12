import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { type Movie, type MovieFormData } from "../../../interfaces/movies.interface";
import MovieDetail from "./MovieDetail";
import MovieList from "./MovieList";

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

  const handleSubmit = async (values: MovieFormData) => {
    try {
      if (selectedMovie) {
        // Update existing movie
        await fetch(`http://localhost:3000/movies/${selectedMovie.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        window.alert("Movie updated successfully");
      } else {
        // Create new movie
        await fetch("http://localhost:3000/movies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        window.alert("Movie created successfully");
      }
      setIsModalOpen(false);
      setSelectedMovie(undefined);
      // Refresh the movie list
      fetchMovies();
    } catch (error) {
      console.error("Error saving movie:", error);
      window.alert("Failed to save movie");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Movie
        </Button>
      </div>

      <MovieList onEdit={handleEdit} movies={movies} onMoviesChange={fetchMovies} />

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
  );
};

export default MovieManagement;
