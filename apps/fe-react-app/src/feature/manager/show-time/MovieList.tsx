import { Button } from "@/components/Shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { Edit, Eye, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [movieToView, setMovieToView] = useState<Movie | null>(null);

  const handleDeleteClick = (movie: Movie) => {
    setMovieToDelete(movie);
    setDeleteDialogOpen(true);
  };

  const handleViewClick = (movie: Movie) => {
    setMovieToView(movie);
    setViewDialogOpen(true);
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
        toast.success("Movie deleted successfully");
      } catch (error) {
        console.error("Error deleting movie:", error);
        toast.error("Failed to delete movie");
      } finally {
        setLoading(false);
      }
    }
    setDeleteDialogOpen(false);
    setMovieToDelete(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="text-center py-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (movies.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="text-center py-4">
            No movies found
          </TableCell>
        </TableRow>
      );
    }

    return movies.map((movie) => (
      <TableRow key={movie.id}>
        <TableCell>{movie.title}</TableCell>
        <TableCell>{movie.releaseYear}</TableCell>
        <TableCell>{movie.productionCompany}</TableCell>
        <TableCell>{movie.duration} min</TableCell>
        <TableCell>{movie.version}</TableCell>
        <TableCell>
          {movie.startShowingDate ? (
            <>
              {formatDate(movie.startShowingDate)} - {formatDate(movie.endShowingDate)}
            </>
          ) : (
            "N/A"
          )}
        </TableCell>
        <TableCell>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              movie.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {movie.status.toUpperCase()}
          </span>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="icon" onClick={() => handleViewClick(movie)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => onEdit(movie)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleDeleteClick(movie)}>
              <Trash className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Release Year</TableHead>
              <TableHead>Production Company</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Showing Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
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

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className=" max-h-[80%] min-w-[50%] overflow-auto">
          <DialogHeader>
            <DialogTitle>Movie Details</DialogTitle>
          </DialogHeader>
          {movieToView && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{movieToView.title}</h3>
                  <p className="text-sm text-gray-500">{movieToView.genre}</p>
                </div>

                {movieToView.poster && (
                  <div className="aspect-[2/3] overflow-hidden rounded-md">
                    <img src={movieToView.poster} alt={`${movieToView.title} poster`} className="w-full h-full object-cover" />
                  </div>
                )}

                {movieToView.trailerUrl && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Trailer</h4>
                    <a href={movieToView.trailerUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      Watch Trailer
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Director</h4>
                  <p>{movieToView.director}</p>
                </div>

                {movieToView.actors && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Actors</h4>
                    <p>{movieToView.actors}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-1">Production Company</h4>
                  <p>{movieToView.productionCompany}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Release Year</h4>
                    <p>{movieToView.releaseYear}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Duration</h4>
                    <p>{movieToView.duration} minutes</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Version</h4>
                    <p>{movieToView.version}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Rating</h4>
                    <p>{movieToView.rating}/10</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Showing Period</h4>
                  <p>
                    {movieToView.startShowingDate ? `${formatDate(movieToView.startShowingDate)} - ${formatDate(movieToView.endShowingDate)}` : "N/A"}
                  </p>
                </div>

                {movieToView.showtimes && movieToView.showtimes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Showtimes</h4>
                    <ul className="space-y-1">
                      {movieToView.showtimes.map((showtime, index) => (
                        <li key={index} className="text-sm">
                          Room {showtime.cinemaRoomId}: {new Date(showtime.startTime).toLocaleString()} -{" "}
                          {new Date(showtime.endTime).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm">{movieToView.description}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MovieList;
