import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/Shadcn/ui/alert-dialog";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import type { FilterCriteria } from "@/components/shared/Filter";
import { Filter } from "@/components/shared/Filter";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SearchBar } from "@/components/shared/SearchBar";
import type { Movie, MovieFormData } from "@/interfaces/movies.interface";
import { MovieGenre, MovieStatus } from "@/interfaces/movies.interface";
import { queryCreateMovie, queryDeleteMovie, queryUpdateMovie, transformMovieResponse, transformMovieToRequest, useMovies } from "@/services/movieService";
import type { MovieResponse } from "@/type-from-be";
import { Plus } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { MovieDataTable } from "./MovieDataTable";
import MovieDetail from "./MovieDetail";
import { MovieGenreManagement } from "./MovieGenreManagement";
import { MovieViewDialog } from "./MovieViewDialog";

const searchOptions = [
  { value: "name", label: "Tên phim" },
  { value: "actor", label: "Diễn viên" },
  { value: "director", label: "Đạo diễn" },
  { value: "studio", label: "Hãng phim" },
];

const filterOptions = [
  {
    label: "Trạng thái",
    value: "status",
    type: "select" as const,
    selectOptions: [
      { value: MovieStatus.ACTIVE, label: "Active" },
      { value: MovieStatus.UPCOMING, label: "Upcoming" },
      { value: MovieStatus.INACTIVE, label: "Canceled" },
    ],
    placeholder: "Chọn trạng thái",
  },
  {
    label: "Thể loại",
    value: "type",
    type: "select" as const,
    selectOptions: Object.values(MovieGenre).map((genre) => ({
      value: genre,
      label: genre.charAt(0) + genre.slice(1).toLowerCase(),
    })),
    placeholder: "Chọn thể loại",
  },
];

const MovieManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);
  const [viewMovie, setViewMovie] = useState<Movie | undefined>();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [genreManagementMovie, setGenreManagementMovie] = useState<Movie | undefined>();
  const [isGenreManagementOpen, setIsGenreManagementOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const tableRef = useRef<{ resetPagination: () => void }>(null);

  // Use React Query hooks
  const moviesQuery = useMovies();
  const createMovieMutation = queryCreateMovie();
  const updateMovieMutation = queryUpdateMovie();
  const deleteMovieMutation = queryDeleteMovie();

  // Transform API response to Movie interface
  const movies: Movie[] = useMemo(() => {
    return moviesQuery.data?.result ? moviesQuery.data.result.map((movieResponse: MovieResponse) => transformMovieResponse(movieResponse)) : [];
  }, [moviesQuery.data?.result]);

  // Helper function to match filter criteria
  const matchesCriteria = (movie: Movie, criteria: FilterCriteria): boolean => {
    switch (criteria.field) {
      case "status":
        return movie.status === criteria.value;
      case "category":
        return movie.categories?.some((cat) => cat.name === criteria.value) ?? false;
      default:
        return true;
    }
  };

  // Lọc phim theo searchTerm và filterCriteria
  const filteredMovies = useMemo(() => {
    let result = movies;

    // Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (movie) =>
          movie.name?.toLowerCase().includes(lower) ||
          movie.director?.toLowerCase().includes(lower) ||
          movie.studio?.toLowerCase().includes(lower) ||
          movie.categories?.some((cat) => cat.name?.toLowerCase().includes(lower)) ||
          movie.description?.toLowerCase().includes(lower),
      );
    }

    // Filter
    if (filterCriteria.length > 0) {
      result = result.filter((movie) => {
        return filterCriteria.every((criteria) => matchesCriteria(movie, criteria));
      });
    }

    return result;
  }, [movies, searchTerm, filterCriteria]);

  // Show loading state
  if (moviesQuery.isLoading) {
    return <LoadingSpinner name="phim" />;
  }

  const handleCreate = () => {
    setSelectedMovie(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleView = (movie: Movie) => {
    setViewMovie(movie);
    setIsViewDialogOpen(true);
  };

  const handleManageGenres = (movie: Movie) => {
    setGenreManagementMovie(movie);
    setIsGenreManagementOpen(true);
  };

  const handleDelete = (movie: Movie) => {
    setMovieToDelete(movie);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!movieToDelete?.id) return;

    try {
      await deleteMovieMutation.mutateAsync({
        params: { path: { id: movieToDelete.id } },
      });

      toast.success("Đã xóa phim thành công");
      moviesQuery.refetch();
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Không thể xóa phim");
    } finally {
      setIsDeleteDialogOpen(false);
      setMovieToDelete(null);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMovie(undefined);
  };

  const validateMovieData = (values: MovieFormData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Required fields validation using new Movie interface
    if (!values.name) errors.push("Movie Name is required");
    if (!values.director) errors.push("Director is required");
    if (!values.studio) errors.push("Studio is required");
    if (!values.categoryIds || values.categoryIds.length === 0) errors.push("At least one category is required");
    if (!values.description) errors.push("Description is required");

    // Age restriction validation (must be between 13-18)
    if (!values.ageRestrict) {
      errors.push("Age restriction is required");
    } else if (values.ageRestrict < 13 || values.ageRestrict > 18) {
      errors.push("Age restriction must be between 13 and 18");
    }

    // Numeric validations
    if (!values.duration || values.duration <= 0) errors.push("Duration must be a positive number");

    // Date validations
    if (values.fromDate && values.toDate) {
      const startDate = new Date(values.fromDate);
      const endDate = new Date(values.toDate);
      if (endDate < startDate) {
        errors.push("End date cannot be earlier than start date");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleSubmit = async (values: MovieFormData) => {
    // Validate the form data
    const validation = validateMovieData(values);
    if (!validation.isValid) {
      toast.error("Please fix the following errors:", {
        description: (
          <ul className="list-disc pl-4">
            {validation.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ),
      });
      return;
    }

    try {
      // Handle file upload if present
      let posterUrl = values.poster;
      if (values.posterFile) {
        // In a real app, you would upload the file to a server
        // For this mock, we'll just use a fake URL or the existing one
        posterUrl = URL.createObjectURL(values.posterFile);
        // Clean up the URL when no longer needed
        if (posterUrl) {
          setTimeout(() => URL.revokeObjectURL(posterUrl!), 5000);
        }
      }

      const movieRequestData = transformMovieToRequest({
        ...values,
        id: selectedMovie?.id,
        poster: posterUrl ?? values.poster,
      });

      if (selectedMovie?.id) {
        updateMovieMutation.mutate(
          {
            params: { path: { id: selectedMovie.id } },
            body: movieRequestData,
          },
          {
            onSuccess: () => {
              toast.success("Movie updated successfully");
              setIsModalOpen(false);
              setSelectedMovie(undefined);
            },
            onError: (error) => {
              toast.error("Failed to update movie");
              console.error("Movie update error:", error);
            },
          },
        );
      } else {
        createMovieMutation.mutate(
          {
            body: movieRequestData,
          },
          {
            onSuccess: () => {
              toast.success("Movie created successfully");
              setIsModalOpen(false);
              setSelectedMovie(undefined);
            },
            onError: (error) => {
              toast.error("Failed to create movie");
              console.error("Movie create error:", error);
            },
          },
        );
      }
    } catch (error) {
      const errorMessage = selectedMovie ? "Failed to update movie" : "Failed to create movie";
      toast.error(errorMessage);
      console.error("Movie operation error:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-2xl font-bold">Movie Management</CardTitle>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Movie
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col gap-4 md:flex-row">
              {/* SearchBar */}
              <SearchBar
                searchOptions={searchOptions}
                onSearchChange={(value) => {
                  setSearchTerm(value);
                  if (tableRef.current) tableRef.current.resetPagination();
                }}
                placeholder="Tìm kiến theo id, tên phim, hãng phim, diễn viên, đạo diễn, hoặc mô tả..."
                className="flex-1"
                resetPagination={() => tableRef.current?.resetPagination()}
              />
              {/* Filter */}
              <Filter
                filterOptions={filterOptions}
                onFilterChange={(criteria) => {
                  setFilterCriteria(criteria);
                  if (tableRef.current) tableRef.current.resetPagination();
                }}
                className="flex-1"
              />
            </div>
            <MovieDataTable
              data={filteredMovies}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
              onManageGenres={handleManageGenres}
            />
          </CardContent>
        </Card>
      </div>

      <div className="p-6">
        <div className="mb-4"></div>
        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            if (!open) handleCancel();
          }}
        >
          <DialogContent className="min-w-[80vw]">
            <DialogHeader>
              <DialogTitle>{selectedMovie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
            </DialogHeader>
            <MovieDetail movie={selectedMovie} onSubmit={handleSubmit} onCancel={handleCancel} />
          </DialogContent>
        </Dialog>

        <MovieViewDialog
          movie={viewMovie || null}
          isOpen={isViewDialogOpen}
          onClose={() => {
            setIsViewDialogOpen(false);
            setViewMovie(undefined);
          }}
        />

        <MovieGenreManagement
          movie={genreManagementMovie || null}
          isOpen={isGenreManagementOpen}
          onClose={() => {
            setIsGenreManagementOpen(false);
            setGenreManagementMovie(undefined);
          }}
          onSuccess={() => {
            moviesQuery.refetch();
          }}
        />

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa phim</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa phim "{movieToDelete?.name}"? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default MovieManagement;
