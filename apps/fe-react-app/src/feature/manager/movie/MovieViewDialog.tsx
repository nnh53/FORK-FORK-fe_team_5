import { Badge } from "@/components/Shadcn/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import type { Movie } from "@/interfaces/movies.interface";

interface MovieViewDialogProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieViewDialog({ movie, isOpen, onClose }: MovieViewDialogProps) {
  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Movie Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="space-y-2">
                <p>
                  <strong>Title:</strong> {movie.name ?? "N/A"}
                </p>
                <p>
                  <strong>Director:</strong> {movie.director ?? "N/A"}
                </p>
                <p>
                  <strong>Studio:</strong> {movie.studio ?? "N/A"}
                </p>
                <p>
                  <strong>Actor:</strong> {movie.actor ?? "N/A"}
                </p>
                <p>
                  <strong>Duration:</strong> {movie.duration ? `${movie.duration} minutes` : "N/A"}
                </p>
                <p>
                  <strong>Age Restriction:</strong> {movie.ageRestrict ? `${movie.ageRestrict}+` : "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {movie.status ?? "N/A"}
                </p>
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Release Period</h3>
              <p>
                <strong>From:</strong> {movie.fromDate ? new Date(movie.fromDate).toLocaleDateString() : "N/A"}
              </p>
              <p>
                <strong>To:</strong> {movie.toDate ? new Date(movie.toDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {movie.categories && movie.categories.length > 0 ? (
                  movie.categories.map((cat) => (
                    <Badge key={cat.id ?? cat.name} variant="outline" className="text-xs">
                      {cat.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">No categories</span>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {movie.poster && (
              <div>
                <h3 className="mb-2 font-semibold">Poster</h3>
                <img src={movie.poster} alt={movie.name} className="h-auto max-w-full rounded" />
              </div>
            )}
            {movie.banner && (
              <div>
                <h3 className="mb-2 font-semibold">Banner</h3>
                <img src={movie.banner} alt={movie.name} className="h-auto max-w-full rounded" />
              </div>
            )}
            <div>
              <h3 className="mb-2 font-semibold">Description</h3>
              <p className="text-gray-700">{movie.description ?? "No description available"}</p>
            </div>
            {movie.trailer && (
              <div>
                <h3 className="mb-2 font-semibold">Trailer</h3>
                <a href={movie.trailer} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {movie.trailer}
                </a>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
