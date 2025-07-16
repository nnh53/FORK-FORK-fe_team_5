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
import { useMutationHandler } from "@/hooks/useMutationHandler";
import type { Movie, MovieFormData } from "@/interfaces/movies.interface";
import { MovieStatus } from "@/interfaces/movies.interface";
import type { components } from "@/schema-from-be";
import { queryMovieCategories, transformMovieCategoriesResponse } from "@/services/movieCategoryService";
import {
  queryCreateMovie,
  queryDeleteMovie,
  queryMovies,
  queryUpdateMovie,
  transformMovieResponse,
  transformMovieToRequest,
} from "@/services/movieService";
import { Plus } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { MovieDataTable } from "./MovieDataTable";
import MovieDetail from "./MovieDetail";
import { MovieGenreManagement } from "./MovieGenreManagement";
import { MovieViewDialog } from "./MovieViewDialog";
type MovieResponse = components["schemas"]["MovieResponse"];

const searchOptions = [
  { value: "name", label: "Tên phim" },
  { value: "actor", label: "Diễn viên" },
  { value: "director", label: "Đạo diễn" },
  { value: "studio", label: "Hãng phim" },
];

// Status filter options
const statusFilterOptions = {
  label: "Trạng thái",
  value: "status",
  type: "select" as const,
  selectOptions: [
    { value: MovieStatus.ACTIVE, label: "Active" },
    { value: MovieStatus.UPCOMING, label: "Upcoming" },
    { value: MovieStatus.INACTIVE, label: "Canceled" },
  ],
  placeholder: "Chọn trạng thái",
};

// Type guard for Movie
const isValidMovie = (movie: Movie | undefined | null): movie is Movie => {
  return !!movie && typeof movie.id === "number" && !!movie.name;
};

// Filter functions
const filterByGlobalSearch = (movie: Movie, searchTerm: string): boolean => {
  if (!searchTerm || !isValidMovie(movie)) return false;
  const lowerSearchTerm = searchTerm.toLowerCase().trim();
  return (
    (movie.name?.toLowerCase().includes(lowerSearchTerm) ?? false) ||
    (movie.director?.toLowerCase().includes(lowerSearchTerm) ?? false) ||
    (movie.studio?.toLowerCase().includes(lowerSearchTerm) ?? false) ||
    (movie.categories?.some((cat) => cat.name?.toLowerCase().includes(lowerSearchTerm) ?? false) ?? false) ||
    (movie.description?.toLowerCase().includes(lowerSearchTerm) ?? false)
  );
};

const filterByStatus = (movie: Movie, status: string): boolean => {
  return movie.status === status;
};

const filterByCategory = (movie: Movie, categoryId: string): boolean => {
  const categoryIdNumber = parseInt(categoryId, 10);
  // Kiểm tra nếu movie có category với id trùng với categoryId
  return movie.categories?.some((cat) => cat.id === categoryIdNumber) ?? false;
};

const applyFilters = (movies: Movie[], criteria: FilterCriteria[], searchTerm: string): Movie[] => {
  let result = movies;

  if (searchTerm) {
    result = result.filter((movie) => filterByGlobalSearch(movie, searchTerm));
  }

  return result.filter((movie) =>
    criteria.every((criterion) => {
      switch (criterion.field) {
        case "status":
          return filterByStatus(movie, criterion.value as string);
        case "category":
          return filterByCategory(movie, criterion.value as string);
        default:
          return true;
      }
    }),
  );
};

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

  // React Query hooks
  const moviesQuery = queryMovies();
  const categoriesQuery = queryMovieCategories();
  const createMovieMutation = queryCreateMovie();
  const updateMovieMutation = queryUpdateMovie();
  const deleteMovieMutation = queryDeleteMovie();

  // Transform API response to Movie interface
  const movies: Movie[] = useMemo(() => {
    return moviesQuery.data?.result ? moviesQuery.data.result.map((movieResponse: MovieResponse) => transformMovieResponse(movieResponse)) : [];
  }, [moviesQuery.data?.result]);

  // Transform API response to MovieCategory interface
  const categories = useMemo(() => {
    if (!categoriesQuery.data?.result) return [];
    return transformMovieCategoriesResponse(categoriesQuery.data.result);
  }, [categoriesQuery.data?.result]);

  // Động tạo filterOptions dựa trên danh sách thể loại từ API
  const filterOptions = useMemo(() => {
    const categoryOptions = categories.map((cat) => ({
      value: cat.id?.toString() || "",
      label: cat.name || "Unknown",
    }));

    return [
      statusFilterOptions,
      {
        label: "Thể loại",
        value: "category",
        type: "select" as const,
        selectOptions: categoryOptions,
        placeholder: "Chọn thể loại",
      },
    ];
  }, [categories]);

  // Filtered movies
  const filteredMovies = useMemo(() => {
    return applyFilters(movies, filterCriteria, searchTerm);
  }, [movies, searchTerm, filterCriteria]);

  // Mutation handlers
  useMutationHandler(
    createMovieMutation,
    "Thêm phim thành công",
    "Lỗi khi thêm phim",
    () => {
      setIsModalOpen(false);
      setSelectedMovie(undefined);
    },
    moviesQuery.refetch,
  );

  useMutationHandler(
    updateMovieMutation,
    "Cập nhật phim thành công",
    "Lỗi khi cập nhật phim",
    () => {
      setIsModalOpen(false);
      setSelectedMovie(undefined);
    },
    moviesQuery.refetch,
  );

  useMutationHandler(
    deleteMovieMutation,
    "Xóa phim thành công",
    "Lỗi khi xóa phim",
    () => {
      setIsDeleteDialogOpen(false);
      setMovieToDelete(null);
    },
    moviesQuery.refetch,
  );

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

  const handleDeleteConfirm = () => {
    if (movieToDelete?.id !== undefined) {
      deleteMovieMutation.mutate({
        params: { path: { id: movieToDelete.id } },
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMovie(undefined);
  };

  const validateMovieData = (values: MovieFormData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!values.name) errors.push("Movie Name is required");
    if (!values.director) errors.push("Director is required");
    if (!values.studio) errors.push("Studio is required");
    if (!values.categoryIds || values.categoryIds.length === 0) errors.push("At least one category is required");
    if (!values.description) errors.push("Description is required");

    if (!values.ageRestrict) {
      errors.push("Age restriction is required");
    } else if (values.ageRestrict < 13 || values.ageRestrict > 18) {
      errors.push("Age restriction must be between 13 and 18");
    }

    if (!values.duration || values.duration <= 0) errors.push("Duration must be a positive number");

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
    const validation = validateMovieData(values);
    if (!validation.isValid) {
      toast.error("Please fix the following errors:", {
        id: "movie-validation-errors",
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

    const movieRequestData = transformMovieToRequest({
      ...values,
      id: selectedMovie?.id,
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
              <SearchBar
                searchOptions={searchOptions}
                onSearchChange={(value) => {
                  setSearchTerm(value);
                  if (tableRef.current) tableRef.current.resetPagination();
                }}
                placeholder="Tìm kiếm theo id, tên phim, hãng phim, diễn viên, đạo diễn, hoặc mô tả..."
                className="flex-1"
                resetPagination={() => tableRef.current?.resetPagination()}
              />
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
