import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/Shadcn/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import type { Movie, MovieSearchParams, MovieSearchResponse } from "@/interfaces/movies.interface.ts";
import { Calendar, Clock, Filter, Play, Search, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { movieService } from "../../services/movieService";

const MoviesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchResponse, setSearchResponse] = useState<MovieSearchResponse>({
    movies: [],
    totalPages: 0,
    totalCount: 0,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<string[]>([]);

  // Search parameters
  const [searchParams, setSearchParams] = useState<MovieSearchParams>({
    search: "",
    genre: "",
    status: "all",
    page: 1,
    limit: 12,
  });
  useEffect(() => {
    fetchGenres();
    // Call searchMovies on mount
    searchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    searchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchGenres = async () => {
    try {
      const genreList = await movieService.getGenres();
      setGenres(genreList);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const searchMovies = async () => {
    try {
      setLoading(true);
      const response = await movieService.searchMovies(searchParams);
      setSearchResponse(response);
    } catch (error) {
      console.error("Error searching movies:", error);
      toast.error("Không thể tải danh sách phim");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  const handleGenreChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      genre: value === "all" ? "" : value,
      page: 1,
    }));
  };
  const handleStatusChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      status: value as "now-showing" | "coming-soon" | "all",
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
  };

  const handleMovieSelect = (movie: Movie) => {
    // Navigate to movie detail or booking page
    navigate(`/booking?movieId=${movie.id}`);
  };

  const getStatusBadge = (movie: Movie) => {
    const today = new Date();
    const releaseDate = new Date(movie.releaseYear, 0, 1); // Simplified - using release year

    if (releaseDate <= today) {
      return <Badge className="bg-green-500">Đang chiếu</Badge>;
    } else {
      return <Badge className="bg-blue-500">Sắp chiếu</Badge>;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-2">Danh Sách Phim</h1>
        <p className="text-center text-gray-600">Khám phá và đặt vé cho những bộ phim hay nhất</p>
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Tìm kiếm & Lọc phim
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm phim..."
                value={searchParams.search || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Genre Filter */}
            <Select value={searchParams.genre || "all"} onValueChange={handleGenreChange}>
              <SelectTrigger>
                <SelectValue placeholder="Thể loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thể loại</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={searchParams.status || "all"} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="now-showing">Đang chiếu</SelectItem>
                <SelectItem value="coming-soon">Sắp chiếu</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() =>
                setSearchParams({
                  search: "",
                  genre: "",
                  status: "all",
                  page: 1,
                  limit: 12,
                })
              }
            >
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Info */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          Tìm thấy {searchResponse.totalCount} phim
          {searchParams.search && ` cho "${searchParams.search}"`}
        </p>
        <p className="text-sm text-gray-500">
          Trang {searchResponse.currentPage} / {searchResponse.totalPages}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="aspect-[2/3] bg-gray-200"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Movies Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {searchResponse.movies.map((movie) => (
            <Card key={movie.id} className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => handleMovieSelect(movie)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Đặt vé
                  </Button>
                </div>
                <div className="absolute top-2 right-2">{getStatusBadge(movie)}</div>
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {movie.rating}/10
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{movie.title}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{movie.releaseYear}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(movie.duration)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {movie.genre
                      .split(",")
                      .slice(0, 2)
                      .map((genre, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {genre.trim()}
                        </Badge>
                      ))}
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={() => handleMovieSelect(movie)}>
                  Đặt vé ngay
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && searchResponse.movies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold mb-2">Không tìm thấy phim nào</h3>
          <p className="text-gray-600 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          <Button
            onClick={() =>
              setSearchParams({
                search: "",
                genre: "",
                status: "all",
                page: 1,
                limit: 12,
              })
            }
          >
            Xem tất cả phim
          </Button>
        </div>
      )}

      {/* Pagination */}
      {!loading && searchResponse.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, searchResponse.currentPage - 1))}
                  className={searchResponse.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {[...Array(searchResponse.totalPages)].map((_, index) => {
                const page = index + 1;
                const isCurrentPage = page === searchResponse.currentPage;
                const shouldShow = page === 1 || page === searchResponse.totalPages || Math.abs(page - searchResponse.currentPage) <= 2;

                if (!shouldShow) {
                  if (page === searchResponse.currentPage - 3 || page === searchResponse.currentPage + 3) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink onClick={() => handlePageChange(page)} isActive={isCurrentPage} className="cursor-pointer">
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(searchResponse.totalPages, searchResponse.currentPage + 1))}
                  className={searchResponse.currentPage === searchResponse.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
