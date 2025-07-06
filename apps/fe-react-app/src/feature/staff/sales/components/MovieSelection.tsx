import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Label } from "@/components/Shadcn/ui/label";
import { Separator } from "@/components/Shadcn/ui/separator";
import type { Movie } from "@/interfaces/movies.interface";
import { Film } from "lucide-react";
import React from "react";
import MovieSearch from "../../../../components/MovieSearch";

interface MovieSelectionProps {
  movies: Movie[];
  selectedMovie: Movie | null;
  onMovieSelect: (movie: Movie) => void;
  onNext: () => void;
}

const MovieSelection: React.FC<MovieSelectionProps> = ({ movies, selectedMovie, onMovieSelect, onNext }) => {
  const handleMovieSelect = (movie: Movie) => {
    onMovieSelect(movie);
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Film className="h-5 w-5" />
          Chọn Phim
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Movie Search */}
        <div>
          <Label className="mb-2 block text-sm font-medium">Tìm kiếm phim nhanh</Label>
          <MovieSearch onMovieSelect={handleMovieSelect} placeholder="Nhập tên phim để tìm kiếm..." className="mb-4" />
        </div>

        <Separator />

        {/* Movie List */}
        <div>
          <Label className="mb-4 block text-sm font-medium">Hoặc chọn từ danh sách</Label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {movies.map((movie) => (
              <button
                key={movie.id}
                onClick={() => handleMovieSelect(movie)}
                className={`w-full cursor-pointer rounded-lg border p-4 text-left transition-colors ${
                  selectedMovie?.id === movie.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                }`}
                type="button"
              >
                <div className="flex gap-4">
                  <img src={movie.poster ?? "/placeholder-movie.jpg"} alt={movie.name ?? "Movie"} className="h-20 w-16 rounded object-cover" />
                  <div>
                    <h3 className="font-semibold">{movie.name ?? "Untitled"}</h3>
                    <p className="text-sm text-gray-500">
                      {movie.categories && movie.categories.length > 0 ? movie.categories.map((cat) => cat.name).join(", ") : "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">{movie.duration ? `${movie.duration} phút` : "N/A"}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieSelection;
