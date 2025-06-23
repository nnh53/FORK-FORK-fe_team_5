import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import type { Movie, MovieSearchParams } from "@/interfaces/movies.interface";
import { Calendar, Clock, Search, Star, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { movieService } from "../services/movieService";

interface MovieSearchProps {
  onMovieSelect?: (movie: Movie) => void;
  placeholder?: string;
  showResults?: boolean;
  className?: string;
}

const MovieSearch: React.FC<MovieSearchProps> = ({ onMovieSelect, placeholder = "Tìm kiếm phim...", showResults = true, className = "" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    const searchMovies = async () => {
      try {
        setLoading(true);
        const params: MovieSearchParams = {
          search: searchTerm,
          limit: 8,
        };
        const response = await movieService.searchMovies(params);
        setMovies(response.movies);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error searching movies:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    const delayedSearch = setTimeout(() => {
      if (searchTerm.length >= 2) {
        searchMovies();
      } else {
        setMovies([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handleMovieSelect = (movie: Movie) => {
    setSearchTerm(movie.title);
    setShowDropdown(false);
    onMovieSelect?.(movie);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setMovies([]);
    setShowDropdown(false);
  };

  const formatDuration = (minutes: number) => {
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
            if (movies.length > 0) {
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
            {loading && <div className="p-4 text-center text-gray-500">Đang tìm kiếm...</div>}

            {!loading && movies.length === 0 && searchTerm.length >= 2 && (
              <div className="p-4 text-center text-gray-500">Không tìm thấy phim nào cho "{searchTerm}"</div>
            )}

            {!loading && movies.length > 0 && (
              <div className="divide-y">
                {movies.map((movie) => (
                  <div key={movie.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleMovieSelect(movie)}>
                    <div className="flex items-start gap-3">
                      <img src={movie.poster} alt={movie.title} className="w-12 h-16 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{movie.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{movie.releaseYear}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDuration(movie.duration)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>{movie.rating}/10</span>
                          </div>
                        </div>{" "}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {movie.genre
                            .split(",")
                            .slice(0, 2)
                            .map((genre: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {genre.trim()}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Overlay to close dropdown */}
      {showDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />}
    </div>
  );
};

export default MovieSearch;
