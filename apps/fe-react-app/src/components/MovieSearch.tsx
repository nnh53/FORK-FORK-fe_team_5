import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import type { Movie } from "@/interfaces/movies.interface";
import { transformMovieResponse, useMovies } from "@/services/movieService";
import type { MovieResponse } from "@/type-from-be";
import { Calendar, Clock, Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface MovieSearchProps {
  onMovieSelect?: (movie: Movie) => void;
  placeholder?: string;
  showResults?: boolean;
  className?: string;
}

const MovieSearch: React.FC<MovieSearchProps> = ({ onMovieSelect, placeholder = "Tìm kiếm phim...", showResults = true, className = "" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch all movies using React Query
  const moviesQuery = useMovies();

  useEffect(() => {
    const filterMovies = () => {
      if (!moviesQuery.data?.result || searchTerm.length < 2) {
        setFilteredMovies([]);
        setShowDropdown(false);
        return;
      }

      const filtered = moviesQuery.data.result
        .map((movieResponse: MovieResponse) => transformMovieResponse(movieResponse))
        .filter(
          (movie: Movie) =>
            movie.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.director?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.actor?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .slice(0, 8); // Limit to 8 results

      setFilteredMovies(filtered);
      setShowDropdown(true);
    };

    const delayedSearch = setTimeout(filterMovies, 300);
    return () => clearTimeout(delayedSearch);
  }, [searchTerm, moviesQuery.data]);

  const handleMovieSelect = (movie: Movie) => {
    setSearchTerm(movie.name ?? "");
    setShowDropdown(false);
    onMovieSelect?.(movie);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredMovies([]);
    setShowDropdown(false);
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
          onFocus={() => {
            if (filteredMovies.length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        {searchTerm && (
          <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0" onClick={clearSearch}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && showDropdown && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-0">
            {moviesQuery.isLoading && <div className="p-4 text-center text-gray-500">Đang tìm kiếm...</div>}

            {!moviesQuery.isLoading && filteredMovies.length === 0 && searchTerm.length >= 2 && (
              <div className="p-4 text-center text-gray-500">Không tìm thấy phim nào cho "{searchTerm}"</div>
            )}

            {!moviesQuery.isLoading && filteredMovies.length > 0 && (
              <div className="divide-y">
                {filteredMovies.map((movie) => (
                  <button
                    key={movie.id}
                    className="w-full p-4 hover:bg-gray-50 cursor-pointer transition-colors text-left"
                    onClick={() => handleMovieSelect(movie)}
                    type="button"
                  >
                    <div className="flex items-start gap-3">
                      <img src={movie.poster ?? "/placeholder-movie.jpg"} alt={movie.name ?? "Movie"} className="w-12 h-16 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{movie.name ?? "Untitled"}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{movie.fromDate ? new Date(movie.fromDate).getFullYear() : "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDuration(movie.duration)}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {movie.categories &&
                            movie.categories.length > 0 &&
                            movie.categories.map((category) => (
                              <Badge key={category.id} variant="outline" className="text-xs">
                                {category.name}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Overlay to close dropdown */}
      {showDropdown && (
        <button
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => setShowDropdown(false)}
          type="button"
          aria-label="Close search results"
        />
      )}
    </div>
  );
};

export default MovieSearch;
