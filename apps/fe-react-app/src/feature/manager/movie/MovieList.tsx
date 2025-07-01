import { Button } from "@/components/Shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Movie } from "@/interfaces/movies.interface";
import { useDeleteMovie } from "@/services/movieService";
import { Edit, Eye, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const getStatusClassName = (status?: string) => {
  if (status === "ACTIVE") return "bg-green-100 text-green-800";
  if (status === "UPCOMING") return "bg-blue-100 text-blue-800";
  return "bg-red-100 text-red-800";
};

interface MovieListProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onMoviesChange: () => void;
}

const MovieList = ({ movies, onEdit, onMoviesChange }: MovieListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const [loading] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [movieToView, setMovieToView] = useState<Movie | null>(null);

  // Use useDeleteMovie hook from movieService
  const deleteMovieMutation = useDeleteMovie();

  // Handle delete mutation result
  useEffect(() => {
    if (deleteMovieMutation.isSuccess) {
      toast.success("Movie deleted successfully");
      onMoviesChange(); // Refresh the movie list
      setDeleteDialogOpen(false);
      setMovieToDelete(null);
    } else if (deleteMovieMutation.isError) {
      toast.error("Failed to delete movie");
    }
  }, [deleteMovieMutation.isSuccess, deleteMovieMutation.isError, onMoviesChange]);

  const handleDeleteClick = (movie: Movie) => {
    setMovieToDelete(movie);
    setDeleteDialogOpen(true);
  };

  const handleViewClick = (movie: Movie) => {
    setMovieToView(movie);
    setViewDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (movieToDelete?.id) {
      // Use mutation from movieService
      deleteMovieMutation.mutate({
        params: { path: { id: movieToDelete.id } },
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const renderTableContent = () => {
    if (loading) {
      return <LoadingSpinner name="phim" />;
    }

    if (movies.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={10} className="text-center py-4">
            No movies found
          </TableCell>
        </TableRow>
      );
    }

    return movies.map((movie) => (
      <TableRow key={movie.id}>
        <TableCell>{movie.name ?? "N/A"}</TableCell>
        <TableCell>{movie.director ?? "N/A"}</TableCell>
        <TableCell>{movie.studio ?? "N/A"}</TableCell>
        <TableCell>{movie.duration ? `${movie.duration} min` : "N/A"}</TableCell>
        <TableCell>2D</TableCell> {/* Default version */}
        <TableCell>{movie.ageRestrict ? `${movie.ageRestrict}+` : "N/A"}</TableCell>
        <TableCell>{movie.categories && movie.categories.length > 0 ? movie.categories.map((cat) => cat.name).join(", ") : "N/A"}</TableCell>
        <TableCell>
          {movie.fromDate ? (
            <>
              {formatDate(movie.fromDate)} - {formatDate(movie.toDate)}
            </>
          ) : (
            "N/A"
          )}
        </TableCell>
        <TableCell>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClassName(movie.status)}`}>
            {movie.status?.toUpperCase() ?? "UNKNOWN"}
          </span>
        </TableCell>
        <TableCell>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleViewClick(movie)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onEdit(movie)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(movie)}>
              <Trash className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="w-full overflow-hidden rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Director</TableHead>
              <TableHead>Studio</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Age Restrict</TableHead>
              <TableHead>Type</TableHead>
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Movie Details</DialogTitle>
          </DialogHeader>
          {movieToView && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{movieToView.name ?? "Untitled"}</h3>
                  <p className="text-sm text-gray-500">
                    {movieToView.categories && movieToView.categories.length > 0
                      ? movieToView.categories.map((cat) => cat.name).join(", ")
                      : "No categories specified"}
                  </p>
                </div>

                {movieToView.poster && (
                  <div className="aspect-[2/3] overflow-hidden rounded-md">
                    <img src={movieToView.poster} alt={`${movieToView.name} poster`} className="w-full h-full object-cover" />
                  </div>
                )}

                {movieToView.trailer && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Trailer</h4>
                    <a href={movieToView.trailer} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      Watch Trailer
                    </a>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-1">Status</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClassName(movieToView.status)}`}>
                    {movieToView.status?.toUpperCase() ?? "UNKNOWN"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Director</h4>
                  <p>{movieToView.director ?? "N/A"}</p>
                </div>

                {movieToView.actor && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Actor(s)</h4>
                    <p>{movieToView.actor}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-1">Studio</h4>
                  <p>{movieToView.studio ?? "N/A"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Age Restriction</h4>
                    <p>{movieToView.ageRestrict ? `${movieToView.ageRestrict}+` : "No restriction"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Duration</h4>
                    <p>{movieToView.duration ? `${movieToView.duration} minutes` : "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Categories</h4>
                    <p>
                      {movieToView.categories && movieToView.categories.length > 0 ? movieToView.categories.map((cat) => cat.name).join(", ") : "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Showing Period</h4>
                  <p>{movieToView.fromDate ? `${formatDate(movieToView.fromDate)} - ${formatDate(movieToView.toDate)}` : "N/A"}</p>
                </div>

                {movieToView.showtimes && movieToView.showtimes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Showtimes</h4>
                    <ul className="space-y-1 max-h-32 overflow-y-auto">
                      {movieToView.showtimes.map((showtime, index) => (
                        <li key={`${showtime.id}-${index}`} className="text-sm">
                          Room {showtime.cinemaRoomId}: {showtime.date} | {new Date(showtime.startTime).toLocaleTimeString()} -{" "}
                          {new Date(showtime.endTime).toLocaleTimeString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm">{movieToView.description ?? "No description available"}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MovieList;
