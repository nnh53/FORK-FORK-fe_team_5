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
import {
  queryCreateMovie,
  queryDeleteMovie,
  queryMovies,
  queryUpdateMovie,
  transformMovieResponse,
  transformMovieToRequest,
} from "@/services/movieService";
import type { CustomAPIResponse, MovieResponse } from "@/type-from-be";
import type { UseMutationResult } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { MovieDataTable } from "./MovieDataTable";
import MovieDetail from "./MovieDetail";
import { MovieGenreManagement } from "./MovieGenreManagement";
import { MovieViewDialog } from "./MovieViewDialog";

const useMovieMutationHandler = <TData, TError extends CustomAPIResponse, TVariables>(
  mutation: UseMutationResult<TData, TError, TVariables>,
  successMessage: string,
  errorMessage: string,
  onSuccess?: () => void,
) => {
  const queryClient = useQueryClient();
  const moviesQuery = queryMovies();

  useEffect(() => {
    if (mutation.isSuccess) {
      toast.success(successMessage, { id: successMessage });
      moviesQuery.refetch();
      onSuccess?.();
      // Reset mutation state after a short delay
      setTimeout(() => mutation.reset(), 100);
    } else if (mutation.isError) {
      toast.error(mutation.error?.message || errorMessage, {
        id: `${successMessage}-error`,
      });
    }
  }, [mutation, queryClient, moviesQuery, successMessage, errorMessage, onSuccess]);
};

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
  const moviesQuery = queryMovies();
  const createMovieMutation = queryCreateMovie();
  const updateMovieMutation = queryUpdateMovie();
  const deleteMovieMutation = queryDeleteMovie();

  // Sử dụng custom hooks để xử lý mutations
  useMovieMutationHandler(createMovieMutation, "Movie created successfully", "Failed to create movie", () => {
    setIsModalOpen(false);
    setSelectedMovie(undefined);
  });

  useMovieMutationHandler(updateMovieMutation, "Movie updated successfully", "Failed to update movie", () => {
    setIsModalOpen(false);
    setSelectedMovie(undefined);
  });

  useMovieMutationHandler(deleteMovieMutation, "Đã xóa phim thành công", "Không thể xóa phim", () => {
    setIsDeleteDialogOpen(false);
    setMovieToDelete(null);
  });

  // Transform API response to Movie interface
  const movies: Movie[] = useMemo(() => {
    return moviesQuery.data?.result ? moviesQuery.data.result.map((movieResponse: MovieResponse) => transformMovieResponse(movieResponse)) : [];
  }, [moviesQuery.data?.result]);

  // Reset pagination khi filter thay đổi
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.resetPagination();
    }
  }, [filterCriteria, searchTerm]);

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

  // Show error state
  if (moviesQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="mb-4 text-xl font-semibold text-red-600">Đã xảy ra lỗi khi tải dữ liệu phim</h2>
        <p className="mb-4 text-gray-600">{(moviesQuery.error as Error)?.message || "Không thể kết nối đến máy chủ"}</p>
        <Button onClick={() => moviesQuery.refetch()}>Thử lại</Button>
      </div>
    );
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

  const handleDeleteConfirm = () => {
    if (!movieToDelete?.id) return;

    deleteMovieMutation.mutate({
      params: { path: { id: movieToDelete.id } },
    });
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

  const handleSubmit = (values: MovieFormData) => {
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
        id: "movie-validation-error",
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
        updateMovieMutation.mutate({
          params: { path: { id: selectedMovie.id } },
          body: movieRequestData,
        });
      } else {
        createMovieMutation.mutate({
          body: movieRequestData,
        });
      }
    } catch (error) {
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
                onSearchChange={setSearchTerm}
                placeholder="Tìm kiến theo id, tên phim, hãng phim, diễn viên, đạo diễn, hoặc mô tả..."
                className="flex-1"
              />
              {/* Filter */}
              <Filter filterOptions={filterOptions} onFilterChange={setFilterCriteria} className="flex-1" />
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
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700" disabled={deleteMovieMutation.isPending}>
                {deleteMovieMutation.isPending ? "Đang xóa..." : "Xóa"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default MovieManagement;
