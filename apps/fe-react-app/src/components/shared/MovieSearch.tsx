import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import type { Movie } from "@/interfaces/movies.interface";
import type { components } from "@/schema-from-be";
import { queryMovieSearch, transformMovieResponse } from "@/services/movieService";
import { Calendar, Clock, Search, X } from "lucide-react";
import React, { useState } from "react";
type MovieResponse = components["schemas"]["MovieResponse"];

interface MovieSearchProps {
  onMovieSelect?: (movie: Movie) => void;
  placeholder?: string;
  showResults?: boolean;
  className?: string;
}

const MovieSearch: React.FC<MovieSearchProps> = ({ onMovieSelect, placeholder = "Tìm kiếm phim...", showResults = true, className = "" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch all movies using React Query with queryMovieSearch for separation
  const { data: moviesData, isLoading } = queryMovieSearch();

  // Filter movies from search term
  const filteredMovies = !moviesData?.result || searchTerm.length < 2
    ? []
    : moviesData.result
        .map((movieResponse: MovieResponse) => transformMovieResponse(movieResponse))
        .filter(
          (movie: Movie) =>
            movie.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.director?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.actor?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .slice(0, 8);

  // Update showDropdown based on filtered results
  const shouldShowDropdown = searchTerm.length >= 2 && (isLoading || filteredMovies.length > 0);

  // Update showDropdown when search term or results change
  React.useEffect(() => {
    setShowDropdown(shouldShowDropdown);
  }, [shouldShowDropdown]);

  const handleMovieSelect = (movie: Movie) => {
    setSearchTerm(movie.name ?? "");
    setShowDropdown(false);
    onMovieSelect?.(movie);
  };

  const clearSearch = () => {
    setSearchTerm("");
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
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
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
          <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 transform p-0" onClick={clearSearch}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && showDropdown && (
        <Card className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-0">
            {isLoading && <div className="p-4 text-center text-gray-500">Đang tìm kiếm...</div>}

            {!isLoading && filteredMovies.length === 0 && searchTerm.length >= 2 && (
              <div className="p-4 text-center text-gray-500">Không tìm thấy phim nào cho "{searchTerm}"</div>
            )}

            {!isLoading && filteredMovies.length > 0 && (
              <div className="divide-y">
                {filteredMovies.map((movie) => (
                  <button
                    key={movie.id}
                    className="w-full cursor-pointer p-4 text-left transition-colors hover:bg-gray-50"
                    onClick={() => handleMovieSelect(movie)}
                    type="button"
                  >
                    <div className="flex items-start gap-3">
                      <img src={movie.poster ?? "/placeholder-movie.jpg"} alt={movie.name ?? "Movie"} className="h-16 w-12 rounded object-cover" />
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-medium">{movie.name ?? "Untitled"}</h4>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{movie.fromDate ? new Date(movie.fromDate).getFullYear() : "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDuration(movie.duration)}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
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
