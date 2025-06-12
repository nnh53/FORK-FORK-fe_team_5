import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import type { Movie } from "../../../interfaces/movies.interface";

interface MovieListProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onMoviesChange: () => void;
}

const MovieList = ({ movies, onEdit, onMoviesChange }: MovieListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = (movie: Movie) => {
    setMovieToDelete(movie);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (movieToDelete) {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/movies/${movieToDelete.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Refresh the movie list
        onMoviesChange();
        window.alert("Movie deleted successfully");
      } catch (error) {
        console.error("Error deleting movie:", error);
        window.alert("Failed to delete movie");
      } finally {
        setLoading(false);
      }
    }
    setDeleteDialogOpen(false);
    setMovieToDelete(null);
  };

  return (
    <div className="w-full overflow-hidden rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Release Year</TableHead>
              <TableHead>Production Company</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : movies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No movies found
                </TableCell>
              </TableRow>
            ) : (
              movies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell>{movie.title}</TableCell>
                  <TableCell>{movie.releaseYear}</TableCell>
                  <TableCell>{movie.productionCompany}</TableCell>
                  <TableCell>{movie.duration} min</TableCell>
                  <TableCell>{movie.version}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        movie.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {movie.status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(movie)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(movie)}>
                        <Trash className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Movie</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this movie? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MovieList;
