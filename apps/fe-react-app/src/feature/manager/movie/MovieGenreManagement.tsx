import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Checkbox } from "@/components/Shadcn/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { ScrollArea } from "@/components/Shadcn/ui/scroll-area";
import type { MovieCategory } from "@/interfaces/movie-category.interface";
import type { Movie } from "@/interfaces/movies.interface";
import { queryMovieCategories, transformMovieCategoriesResponse } from "@/services/movieCategoryService";
import { queryUpdateMovie } from "@/services/movieService";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface MovieGenreManagementProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function MovieGenreManagement({ movie, isOpen, onClose, onSuccess }: Readonly<MovieGenreManagementProps>) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // React Query hooks
  const categoriesQuery = queryMovieCategories();
  const updateMovieMutation = queryUpdateMovie();

  // Transform API response to MovieCategory interface
  const categories: MovieCategory[] = categoriesQuery.data?.result
    ? transformMovieCategoriesResponse(categoriesQuery.data.result)
    : [];

  // Initialize selected categories when movie changes
  useEffect(() => {
    if (movie?.categoryIds) {
      setSelectedCategoryIds([...movie.categoryIds]);
    } else if (movie?.categories) {
      const ids = movie.categories.map((cat) => cat.id).filter((id) => id !== undefined);
      setSelectedCategoryIds(ids);
    } else {
      setSelectedCategoryIds([]);
    }
  }, [movie]);

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategoryIds((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSave = async () => {
    if (!movie?.id) return;

    setIsLoading(true);
    try {
      await updateMovieMutation.mutateAsync({
        params: { path: { id: movie.id } },
        body: {
          name: movie.name ?? "",
          ageRestrict: movie.ageRestrict ?? 13,
          fromDate: movie.fromDate ?? "",
          toDate: movie.toDate ?? "",
          actor: movie.actor ?? "",
          studio: movie.studio ?? "",
          director: movie.director ?? "",
          duration: movie.duration ?? 0,
          trailer: movie.trailer ?? "",
          categoryIds: selectedCategoryIds,
          description: movie.description ?? "",
          status: movie.status ?? "ACTIVE",
          poster: movie.poster ?? "",
        },
      });

      toast.success("Cập nhật thể loại phim thành công");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error updating movie genres:", error);
      toast.error("Không thể cập nhật thể loại phim");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original state
    if (movie?.categoryIds) {
      setSelectedCategoryIds([...movie.categoryIds]);
    } else if (movie?.categories) {
      const ids = movie.categories.map((cat) => cat.id).filter((id) => id !== undefined);
      setSelectedCategoryIds(ids);
    } else {
      setSelectedCategoryIds([]);
    }
    onClose();
  };

  if (!movie) return null;

  const renderCategoriesList = () => {
    if (categoriesQuery.isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2">Đang tải...</span>
        </div>
      );
    }

    if (categories.length === 0) {
      return <div className="py-8 text-center text-gray-500">Không có thể loại nào</div>;
    }

    return (
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center space-x-3">
            <Checkbox
              id={`category-${category.id}`}
              checked={selectedCategoryIds.includes(category.id!)}
              onCheckedChange={() => handleCategoryToggle(category.id!)}
            />
            <div className="flex-1">
              <label
                htmlFor={`category-${category.id}`}
                className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.name}
              </label>
              {category.description && <p className="mt-1 text-xs text-gray-500">{category.description}</p>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Quản lý thể loại phim - {movie.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current genres */}
          <div>
            <h4 className="mb-2 text-sm font-medium">Thể loại hiện tại:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCategoryIds.length > 0 ? (
                categories
                  .filter((cat) => selectedCategoryIds.includes(cat.id!))
                  .map((cat) => (
                    <Badge key={cat.id} variant="default" className="text-xs">
                      {cat.name}
                    </Badge>
                  ))
              ) : (
                <span className="text-sm text-gray-500">Chưa có thể loại nào</span>
              )}
            </div>
          </div>

          {/* Available genres */}
          <div>
            <h4 className="mb-2 text-sm font-medium">Chọn thể loại:</h4>
            <ScrollArea className="h-[300px] rounded border p-4">{renderCategoriesList()}</ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
